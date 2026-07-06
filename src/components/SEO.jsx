import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Star Store';
const SITE_URL = 'https://starstore.com';

/**
 * Drops per-page <title>/meta tags plus an optional JSON-LD graph into
 * <head>. `structuredData` accepts a single schema.org object or an array —
 * pass an array when a page needs more than one node (e.g. Article + Breadcrumb).
 */
export default function SEO({ title, description, image, url, type = 'website', structuredData }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL;
  const schemas = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [];

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
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
