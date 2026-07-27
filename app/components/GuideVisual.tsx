import { Icon } from "./Icon";

export function GuideVisual({ icon, title, labels }: { icon: string; title: string; labels: string[] }) {
  return <figure className="guide-visual" aria-labelledby={`visual-${icon}`}>
    <div className="guide-visual-mark"><Icon name={icon} size={42} /></div>
    <div className="guide-visual-path" aria-hidden="true" />
    <div className="guide-visual-labels">{labels.map((label, index) => <span key={label}><b>{index + 1}</b>{label}</span>)}</div>
    <figcaption id={`visual-${icon}`}>{title}, organized into a clear sequence you can work through at your own pace.</figcaption>
  </figure>;
}
