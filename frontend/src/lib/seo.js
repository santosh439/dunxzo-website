import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BRAND } from "../content/site.js";

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", value);
}

/** Per page SEO and social metadata for every DU-NZO route */
export function useSeo(title, description = BRAND.description) {
  const { pathname } = useLocation();
  useEffect(() => {
    const full = title ? `${title} | DU-NZO` : "DU-NZO | Compliance without the complexity";
    const url = `${BRAND.url}${pathname === "/" ? "" : pathname}`;
    document.title = full;
    setMeta("name", "description", description);
    setMeta("property", "og:title", full);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", full);
    setMeta("name", "twitter:description", description);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = url;
  }, [title, description, pathname]);
}
