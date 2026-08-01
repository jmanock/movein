import { ExternalLink } from "lucide-react";
import type { LocalResource } from "../data/local-resources";
import { Icon } from "./Icon";

export function LocalResourceCards({ resources }: { resources: LocalResource[] }) {
  return <div className="local-resource-grid">{resources.map((resource) => <a href={resource.url} target="_blank" rel="noopener noreferrer" key={`${resource.organization}-${resource.title}`}><span className="local-resource-icon"><Icon name={resource.icon} size={20} /></span><small>{resource.organization}</small><h3>{resource.title}</h3><p>{resource.description}</p><strong>Open official resource <ExternalLink size={14} aria-hidden="true" /></strong></a>)}</div>;
}
