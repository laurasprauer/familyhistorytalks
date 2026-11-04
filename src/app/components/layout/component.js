import PropTypes from "prop-types";
import Head from "next/head";
import Header from "@components/header/component.js";
import { DEFAULT_SEO } from "@utils/defaultSEO.cjs";

import * as styles from "./styles.module.scss";

// Every page: <head> SEO tags, skip link, header and the centered content column.
// `path` is the page path without a leading slash ("" for home) — used for canonical.
export const Layout = ({ title, description, path = "", image, noindex = false, children }) => {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  const fullTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title;
  const metaDescription = description || DEFAULT_SEO.description;
  const canonical = `${siteUrl}/${path}`;
  // On Netlify, image URLs are same-origin proxy paths (/sanity-images/…); OG needs absolute.
  const ogImage = image?.startsWith("/") ? `${siteUrl}${image}` : image;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="robots"
          content={noindex ? "noindex" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
        />
        {siteUrl && <link rel="canonical" href={canonical} />}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDescription} />
        {siteUrl && <meta property="og:url" content={canonical} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      </Head>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.container}>
        <div className={styles.wrapper}>{children}</div>
      </main>
    </>
  );
};

Layout.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string,
  noindex: PropTypes.bool,
  children: PropTypes.node,
};

export default Layout;
