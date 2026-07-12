import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL, absoluteUrl } from '../config/site';

/**
 * Drops per-page <title>/meta tags plus an optional JSON-LD graph into
 * <head>. `structuredData` accepts a single schema.org object or an array —
 * pass an array when a page needs more than one node (e.g. Article + Breadcrumb).
 */
export default function SEO({ title, description, image, url, type = 'website', structuredData }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = url ? absoluteUrl(url) : SITE_URL;
  const schemas = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [];
  const ogImage = image
    ? (/^https?:\/\//i.test(image) ? image : absoluteUrl(image))
    : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
