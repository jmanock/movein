"use client";

import { Calculator, Printer, RotateCcw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";

const expenses = [
  ["monthlyRent", "Monthly rent due before move-in"],
  ["securityDeposit", "Security deposit"],
  ["applicationFees", "Application and administrative fees"],
  ["utilityDeposits", "Utility deposits or connection fees"],
  ["internetSetup", "Internet equipment or installation"],
  ["movingCosts", "Movers, truck, supplies, or storage"],
  ["petCosts", "Pet fees or deposits"],
  ["parking", "Parking, access, or move-in fees"],
  ["insurance", "Renters insurance"],
  ["other", "Other confirmed move-in expense"],
] as const;

type ExpenseKey = (typeof expenses)[number][0];
type Values = Record<ExpenseKey, string>;
const emptyValues = () => Object.fromEntries(expenses.map(([key]) => [key, ""])) as Values;

export function MoveInCostCalculator() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [calculated, setCalculated] = useState(false);
  const started = useRef(false);
  const numbers = useMemo(() => expenses.map(([key]) => parseCurrency(values[key])), [values]);
  const total = numbers.reduce((sum, value) => sum + value, 0);
  const categoryCount = numbers.filter((value) => value > 0).length;

  const update = (key: ExpenseKey, value: string) => {
    if (!started.current) {
      started.current = true;
      trackEvent("move_in_calculator_started", { source_page: "/renters/move-in-cost-calculator", homeowner_or_renter: "renter" });
    }
    setValues((current) => ({ ...current, [key]: value }));
    setCalculated(false);
  };

  return <section className="move-cost-calculator" aria-labelledby="calculator-heading">
    <header><Calculator aria-hidden="true" /><div><span className="eyebrow">Private planning tool</span><h2 id="calculator-heading">Add only the costs that apply to your move.</h2><p>Amounts stay in this page and are not saved or sent to Analytics.</p></div></header>
    <div className="move-cost-fields">{expenses.map(([key, label]) => <label key={key}><span>{label}</span><span className="currency-input"><span aria-hidden="true">$</span><input inputMode="decimal" autoComplete="off" name={key} value={values[key]} onChange={(event) => update(key, event.target.value)} placeholder="0.00" aria-label={`${label} in dollars`} /></span></label>)}</div>
    <div className="calculator-actions no-print"><button className="button" type="button" onClick={() => { setCalculated(true); trackEvent("move_in_calculator_completed", { source_page: "/renters/move-in-cost-calculator", homeowner_or_renter: "renter", expense_category_count: categoryCount }); }}>Calculate total</button><button type="button" onClick={() => { setValues(emptyValues()); setCalculated(false); started.current = false; }}><RotateCcw size={16} aria-hidden="true" /> Reset</button><button type="button" onClick={() => { try { window.print(); } catch { /* Browser-controlled. */ } }}><Printer size={16} aria-hidden="true" /> Print / Save PDF</button></div>
    <div className={`calculator-result ${calculated ? "ready" : ""}`} aria-live="polite"><span>Estimated amount needed before move-in</span><strong>{calculated ? formatCurrency(total) : "—"}</strong><small>{calculated ? `${categoryCount} ${categoryCount === 1 ? "category" : "categories"} included` : "Enter your written amounts, then calculate."}</small></div>
    <aside><strong>Planning estimate—not a quote.</strong> Confirm every amount and due date in the lease, property statement, official provider information, insurance documents, and mover agreement. Do not enter account or payment details.</aside>
  </section>;
}

function parseCurrency(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 10_000_000) : 0;
}

function formatCurrency(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value); }
