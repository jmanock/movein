"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CircleCheck, LoaderCircle, PackageCheck, ReceiptText, Upload, X } from 'lucide-react';
import { normalizeReceipt } from '../lib/receipts/processing';
import { formatMoney, reviewedReceipt, reviewFromReceipt } from '../lib/receipts/review';
import type { ReceiptReview } from '../lib/receipts/review';
import { UPLOAD_LIMIT_LABEL, validateUpload } from '../lib/receipts/upload';
import { receiptQuality } from '../lib/receipts/quality';
import { ITEM_ROLES, RECEIPT_TYPES, type ReceiptType } from '../lib/receipts/intelligence-types';
import type { InventoryItem, ParsedReceipt } from '../lib/receipts/types';

type Stage = 'upload' | 'processing' | 'review' | 'saving' | 'saved';
export function ReceiptWorkspace({ enabled, mode, timeoutMs, debug, unavailableMessage, developmentHousehold = false }: { developmentHousehold?: boolean; enabled: boolean; mode: 'demo' | 'ollama' | null; timeoutMs: number; debug: boolean; unavailableMessage: string }) {
  const [stage, setStage] = useState<Stage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [original, setOriginal] = useState<ParsedReceipt | null>(null);
  const [review, setReview] = useState<ReceiptReview | null>(null);
  const [saved, setSaved] = useState<InventoryItem[]>([]);
  const [diagnostics, setDiagnostics] = useState<{ provider: string; model: string | null; durationMs: number; promptVersion: string; warningCodes: string[]; jsonRepaired: boolean } | null>(null);
  const [requestId, setRequestId] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const locked = useRef(false);
  useEffect(() => () => activeRequest.current?.abort(), []);
  useEffect(() => { if (stage === 'review' || stage === 'saved') title.current?.focus(); }, [stage]);
  useEffect(() => { if (error) errorBox.current?.focus(); }, [error]);
  const busy = stage === 'processing' || stage === 'saving';
  function reset() {
    setDiagnostics(null); setFile(null); setOriginal(null); setReview(null); setSaved([]); setError(''); setRequestId(''); setStage('upload');
    if (fileInput.current) fileInput.current.value = '';
  }
  function selectFile(files: FileList | null) {
    if (locked.current) return;
    setError('');
    if (!files || files.length !== 1) { setError('Choose one receipt at a time.'); return; }
    const next = files[0];
    const problem = validateUpload(next);
    if (problem) { setFile(null); setError(problem); if (fileInput.current) fileInput.current.value = ''; return; }
    setFile(next);
  }
  async function process() {
    if (!file || locked.current) return;
    locked.current = true; setError(''); setStage('processing');
    const controller = new AbortController(); activeRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), timeoutMs + 15000);
    try {
      const form = new FormData(); form.set('receipt', file);
      const response = await fetch('/api/receipts/process', { method: 'POST', body: form, signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'We couldn’t process this receipt. Try again.');
      if (data.mode !== mode) throw new Error('We couldn’t read the result. Try again.');
      let receipt: ParsedReceipt;
      try { receipt = normalizeReceipt(data.receipt); }
      catch { throw new Error('We couldn’t read the purchase details. Please try another receipt.'); }
      if (!receipt.items.length) throw new Error('No usable purchases were found. Try another receipt.');
      setDiagnostics(debug ? data.debug ?? null : null); setOriginal(receipt); setReview(reviewFromReceipt(receipt)); setRequestId(crypto.randomUUID()); setStage('review');
    } catch (problem) {
      setError(problem instanceof Error && problem.name !== 'AbortError' ? problem.message : 'Processing took too long. Please try again.'); setStage('upload');
    } finally {
      // No image preview, object URL, localStorage, or raw file remains after the attempt.
      setFile(null); if (fileInput.current) fileInput.current.value = '';
      clearTimeout(timeout); activeRequest.current = null; locked.current = false;
    }
  }
  function updateField(field: 'merchant' | 'purchaseDate' | 'subtotal' | 'tax' | 'total', value: string) {
    setReview((current) => current ? { ...current, [field]: value } : current);
  }
  function updateItem(index: number, field: keyof ReceiptReview['items'][number], value: string | boolean) {
    setReview((current) => current ? { ...current, items: current.items.map((item, at) => at === index ? { ...item, [field]: value } : item) } : current);
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!original || !review || locked.current) return;
    setError('');
    let receipt;
    try { receipt = reviewedReceipt(original, review); }
    catch (problem) { setError(problem instanceof Error ? problem.message : 'Check the purchase details.'); return; }
    locked.current = true; setStage('saving');
    const controller = new AbortController(); activeRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/receipts/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receipt, selected: review.items.flatMap((item, index) => item.selected ? [index] : []), requestId }), signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Your receipt could not be saved. Please try again.');
      if (!Array.isArray(data.inventory)) throw new Error('The save confirmation could not be read. Retry with the same details.');
      setSaved(data.inventory); setStage('saved');
    } catch (problem) {
      setError(problem instanceof Error && problem.name !== 'AbortError' ? problem.message : 'Saving took too long. Retry with the same details to check your save.'); setStage('review');
    } finally { clearTimeout(timeout); activeRequest.current = null; locked.current = false; }
  }
  const quality = original ? receiptQuality(original) : null;
  const step = stage === 'upload' || stage === 'processing' ? 0 : stage === 'saved' ? 2 : 1;
  return <div className="receipt-workspace" aria-busy={busy}>
    <div className="receipt-tool-nav"><Link href="/receipts" aria-current="page">Receipts</Link><Link href="/my-home">My Home <ArrowRight size={16} aria-hidden="true" /></Link></div>
    <ol className="receipt-steps" aria-label="Receipt progress">{['Upload', 'Review', 'Save'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={index <= step ? 'active' : ''}><span>{index < step ? <Check size={16} aria-hidden="true" /> : index + 1}</span>{label}</li>)}</ol>
    {!enabled ? <div className="receipt-status"><h2>Receipt reading is unavailable.</h2><p>{unavailableMessage}</p><Link className="text-link" href="/my-home">View your home records</Link></div> : <>
      {developmentHousehold && <p className="receipt-demo-note"><strong>Development household</strong> Explicit local test mode: records are shared by local browsers.</p>}
      {mode === 'demo' ? <p className="receipt-demo-note"><strong>Local demo</strong> Try the full flow with sample purchases. Your file is checked and discarded; its contents are not read. Saves belong to your household.</p> : <p className="receipt-demo-note"><strong>Local receipt processing</strong> Your photo is read on this computer, then discarded. Review before saving. Saved purchase records belong to your household.</p>}
      {error && <div ref={errorBox} tabIndex={-1} className="receipt-error" role="alert">{error}</div>}
      {(stage === 'upload' || stage === 'processing') && <section className="receipt-upload-panel">
        <h2>Upload a receipt</h2><p>MoveIn can turn purchases worth keeping track of into useful home records.</p>
        <div className={`receipt-dropzone ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); if (!busy) selectFile(event.dataTransfer.files); }}>
          <Upload size={36} aria-hidden="true" /><h3>Drop your receipt here</h3><p>Or choose a photo from your phone or computer.</p><p>{mode === 'demo' ? 'JPG, PNG, or PDF' : 'JPG or PNG'} · up to {UPLOAD_LIMIT_LABEL}</p>
          <label className={`button ${busy ? 'receipt-disabled' : ''}`} htmlFor="receipt-file">{file ? 'Change file' : 'Choose a file'}</label>
          <input ref={fileInput} id="receipt-file" className="receipt-file-input" type="file" accept={mode === 'demo' ? '.jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf' : '.jpg,.jpeg,.png,image/jpeg,image/png'} disabled={busy} onChange={(event) => selectFile(event.target.files)} />
        </div>
        {file && <div className="receipt-selected-file"><ReceiptText aria-hidden="true" /><div><strong>{file.name}</strong><span>{file.type === 'application/pdf' ? 'PDF' : file.type === 'image/png' ? 'PNG image' : 'JPEG image'} · {file.size < 1024 * 1024 ? `${Math.max(1, Math.ceil(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(2)} MB`}</span></div><button type="button" aria-label="Remove selected receipt" disabled={busy} onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ''; }}><X size={20} aria-hidden="true" /></button></div>}
        <button className="button receipt-primary-action" type="button" disabled={!file || busy} onClick={process}>{busy ? <><LoaderCircle className="receipt-spinner" size={18} aria-hidden="true" />Preparing your review…</> : <>Continue to review <ArrowRight size={18} aria-hidden="true" /></>}</button>
        <p className="receipt-storage-note">Your uploaded receipt is processed and discarded. MoveIn keeps only the purchase information you choose to save.</p>
        {busy && <p className="receipt-processing-status" role="status">{mode === 'demo' ? 'Preparing sample purchase details. Nothing has been saved.' : 'Reading your receipt. This can take a few minutes. Nothing has been saved.'}</p>}
      </section>}
      {(stage === 'review' || stage === 'saving') && review && original && <form onSubmit={save} className="receipt-review-panel">
        <h2 ref={title} tabIndex={-1}>Review your purchase</h2><p>Check the details, then choose what belongs in My Home. Nothing is saved until you confirm.</p>
        {quality && quality.warnings.length > 0 && <aside className="receipt-review-warnings" aria-label="Details to check"><strong>{quality.status === 'missing_information' ? 'Some details need your help' : 'A few details to check'}</strong><ul>{quality.warnings.filter((warning) => warning.itemIndex === undefined).map((warning) => <li key={warning.code}>{warning.message}</li>)}</ul><p>Please check highlighted purchases below.</p></aside>}
        {debug && diagnostics && <details className="receipt-debug"><summary>Development extraction diagnostics</summary><dl><dt>Provider / model</dt><dd>{diagnostics.provider} / {diagnostics.model ?? 'fixture'}</dd><dt>Duration</dt><dd>{(diagnostics.durationMs / 1000).toFixed(1)} seconds</dd><dt>Prompt</dt><dd>{diagnostics.promptVersion}</dd><dt>JSON fence removed</dt><dd>{diagnostics.jsonRepaired ? 'Yes' : 'No'}</dd><dt>Warning codes</dt><dd>{diagnostics.warningCodes.join(', ') || 'None'}</dd></dl></details>}
        <fieldset disabled={busy}><legend className="receipt-sr-only">Purchase details</legend><div className="receipt-fields">
          <label className={`receipt-field-wide ${!original.merchant ? 'receipt-field-attention' : ''}`}>Merchant<input maxLength={500} value={review.merchant} onChange={(event) => updateField('merchant', event.target.value)} placeholder="Store name" /></label>
          <label>Document type<select value={review.receiptType} onChange={(event) => setReview(current => current ? { ...current, receiptType: event.target.value as ReceiptType } : current)}>{RECEIPT_TYPES.map(type => <option key={type} value={type}>{type === 'mixed' ? 'Purchase and return' : type[0].toUpperCase() + type.slice(1)}</option>)}</select></label>
          <label className={!original.purchaseDate || quality?.warnings.some(warning => ['ambiguous_date', 'invalid_date', 'date_year_inferred'].includes(warning.code)) ? 'receipt-field-attention' : ''}>Purchase date<input type="date" value={review.purchaseDate} onChange={(event) => updateField('purchaseDate', event.target.value)} /><small>Optional if unknown</small>{original.rawDateText && <small>Printed: {original.rawDateText}</small>}</label>
          {(['subtotal', 'tax', 'total'] as const).map((field) => <label key={field} className={original[`${field}Minor` as 'subtotalMinor' | 'taxMinor' | 'totalMinor'] === null ? 'receipt-field-attention' : ''}>{field[0].toUpperCase() + field.slice(1)} (USD)<input inputMode="decimal" value={review[field]} onChange={(event) => updateField(field, event.target.value)} placeholder="Not recorded" /></label>)}
        </div>
        <div className="receipt-items-heading"><div><h3>Choose what to keep track of</h3><p>You can add or remove any purchase.</p></div><span>{review.items.filter((item) => item.selected).length} selected</span></div>
        <div className="receipt-review-items">{review.items.map((item, index) => <article className={`receipt-review-item ${item.selected ? 'chosen' : ''} ${quality?.warnings.some((warning) => warning.itemIndex === index) ? 'attention' : ''}`} key={index}>
          <div className="receipt-item-choice"><label><input type="checkbox" checked={item.selected} onChange={(event) => updateItem(index, 'selected', event.target.checked)} /><span>Add {item.name || 'this item'} to My Home</span></label><small className={original.items[index].isHouseholdAsset ? "receipt-recommendation recommended" : "receipt-recommendation"}>{original.items[index].isHouseholdAsset ? 'Recommended for My Home' : 'Not recommended by default'}</small></div>
          {(original.items[index].uncertaintyFlags?.includes('ambiguousName') || !original.items[index].normalizedName) && <p className="receipt-source-text"><strong>Printed on receipt</strong><span>{original.items[index].rawDescription}</span></p>}
          {original.items[index].assetReason && !quality?.warnings.some(warning => warning.itemIndex === index && warning.code === 'uncertain_asset') && <p className="receipt-asset-reason">{original.items[index].assetReason}</p>}
          {quality?.warnings.filter((warning) => warning.itemIndex === index).map((warning) => <p className="receipt-field-note" key={warning.code}>{warning.message}</p>)}
          <div className="receipt-item-fields"><label className="receipt-field-wide">Item name<input required maxLength={500} value={item.name} onChange={(event) => updateItem(index, 'name', event.target.value)} /></label><label>Category<input maxLength={500} value={item.category} onChange={(event) => updateItem(index, 'category', event.target.value)} /></label><label>Purchase type<select value={item.itemRole} onChange={(event) => updateItem(index, 'itemRole', event.target.value)}>{ITEM_ROLES.map(role => <option value={role} key={role}>{role.replaceAll('_', ' ')}</option>)}</select></label><label>Quantity<input required type="number" min="0.001" step="any" value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} /></label><label>Unit price (USD)<input inputMode="decimal" value={item.unitPrice} onChange={(event) => updateItem(index, 'unitPrice', event.target.value)} placeholder="Not recorded" /></label><label>Line total (USD)<input inputMode="decimal" value={item.totalPrice} onChange={(event) => updateItem(index, 'totalPrice', event.target.value)} placeholder="Not recorded" /></label></div>
          <p className="receipt-item-selection">{item.selected ? 'Will be added to My Home' : 'Saved on the receipt only'}</p>
        </article>)}</div></fieldset>
        <div className="receipt-save-bar"><div><strong>{review.items.filter((item) => item.selected).length} items for My Home</strong><p>All purchase lines stay with the saved receipt.</p></div><button className="button" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="receipt-spinner" size={18} aria-hidden="true" />Saving…</> : <>Save receipt <Check size={18} aria-hidden="true" /></>}</button></div>
        <button className="receipt-plain-button" type="button" disabled={busy} onClick={() => { if (window.confirm('Discard this review and start another receipt?')) reset(); }}>Discard review</button>
        {busy && <p role="status">Saving your receipt and selected household items together.</p>}
      </form>}
      {stage === 'saved' && <section className="receipt-success"><CircleCheck size={44} aria-hidden="true" /><h2 ref={title} tabIndex={-1}>Receipt saved</h2><p>{saved.length} {saved.length === 1 ? 'item added' : 'items added'} to My Home.</p>
        {saved.length ? <ul className="receipt-saved-items">{saved.map((item) => <li key={item.id}><PackageCheck aria-hidden="true" /><div><strong>{item.name}</strong><span>{item.category ?? 'Household item'} · {formatMoney(item.purchasePriceMinor, item.currency)}</span></div></li>)}</ul> : <p>Your purchase details are saved. No items were added to inventory.</p>}
        <div className="receipt-success-actions"><Link className="button" href="/my-home">View My Home <ArrowRight size={18} aria-hidden="true" /></Link><button className="receipt-plain-button" type="button" onClick={reset}>Add another receipt</button></div>
      </section>}
    </>}
  </div>;
}
