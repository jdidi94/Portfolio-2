import { SEO_CONFIG, absoluteSeoUrl } from "@config/seo";

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Applies document title + Open Graph / Twitter tags at runtime.
 * Complements static tags in `index.html` for local / preview hosts.
 */
export function applySeoTags(): void {
  const { title, description, siteName, ogImageAlt, locale, keywords } =
    SEO_CONFIG;
  const url = absoluteSeoUrl("/");
  const image = absoluteSeoUrl(SEO_CONFIG.ogImagePath);

  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", keywords.join(", "));
  upsertMeta("name", "author", siteName);
  upsertLink("canonical", url);

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", siteName);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:alt", ogImageAlt);
  upsertMeta("property", "og:locale", locale);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", image);
  upsertMeta("name", "twitter:image:alt", ogImageAlt);
  if (SEO_CONFIG.twitterHandle) {
    upsertMeta("name", "twitter:site", SEO_CONFIG.twitterHandle);
  }
}
