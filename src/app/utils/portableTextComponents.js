import CustomLink from "@components/customLink/component.js";

// Shared renderers for Sanity rich text. Pass to <PortableText components={...} />
// (RichText adds the citation / figure / box types on top of these).
export const portableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "";
      const newTab = Boolean(value?.openInNewTab);
      return (
        <CustomLink to={href} target={newTab ? "_blank" : undefined}>
          {children}
          {newTab && <span className="sr-only"> (opens in a new tab)</span>}
        </CustomLink>
      );
    },
  },
};
