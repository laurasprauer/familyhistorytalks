import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { PortableText } from "@portabletext/react";
import CustomImage from "@components/customImage/component.js";
import { portableTextComponents } from "@utils/portableTextComponents.js";

import * as styles from "./styles.module.scss";

// Bio / surname body (Sanity "blockContent").
// citationNumbers maps an Assets document _id → its footnote number (its position in
// the person's Assets list). Each citation links to the element with that _id as its
// id — the matching entry in the person sidebar.
const CitationContext = createContext({});

const scrollToAsset = (event, id) => {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.focus({ preventScroll: true });
};

const Citation = ({ value }) => {
  const citationNumbers = useContext(CitationContext);
  const id = value?.asset?._ref;
  const number = id && citationNumbers[id];
  if (!number) return null;
  return (
    <a href={`#${id}`} className={styles.citation} onClick={(e) => scrollToAsset(e, id)}>
      [{number}
      {value.detail || ""}]<span className="sr-only"> (source {number})</span>
    </a>
  );
};

// Captions and boxes: paragraphs with links and citations.
const smallComponents = { ...portableTextComponents, types: { assetCitation: Citation } };
const SmallText = ({ value }) => <PortableText value={value || []} components={smallComponents} />;

const Figure = ({ value }) => {
  const asset = value.image?.asset;
  if (!asset?.url) return null;
  return (
    <figure className={styles.figure} style={value.maxWidth ? { maxWidth: value.maxWidth } : undefined}>
      <CustomImage
        basePath={asset.url}
        alt={value.alt}
        width={asset.width}
        height={asset.height}
        widths={[420, 840, 1280]}
        sizes="(max-width: 840px) 100vw, 720px"
        className={styles.figureImage}
      />
      {value.caption?.length ? (
        <figcaption className={styles.caption}>
          <SmallText value={value.caption} />
        </figcaption>
      ) : null}
    </figure>
  );
};

const components = {
  ...portableTextComponents,
  types: {
    assetCitation: Citation,
    figure: Figure,
    highlightBox: ({ value }) => (
      <div className={styles.highlight}>
        <SmallText value={value.content} />
      </div>
    ),
    warningBox: ({ value }) => (
      <div className={styles.warning} role="note">
        <SmallText value={value.content} />
      </div>
    ),
  },
};

export const RichText = ({ value, citationNumbers = {}, className }) => {
  if (!value?.length) return null;
  return (
    <CitationContext.Provider value={citationNumbers}>
      <div className={classNames(styles.richText, className)}>
        <PortableText value={value} components={components} />
      </div>
    </CitationContext.Provider>
  );
};

RichText.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object),
  citationNumbers: PropTypes.objectOf(PropTypes.number),
  className: PropTypes.string,
};

export default RichText;
