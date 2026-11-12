import { templateConfig as site } from "../../config/template.config";
export function Brand() { return <a className="brand" href="#inicio" aria-label={`${site.displayName} — início`}><span className="brand-mark" aria-hidden="true">M<span>M</span></span><span className="brand-name">Macedo Marques<small>ADVOCACIA</small></span></a>; }
