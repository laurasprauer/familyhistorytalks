import "../app/styles/global-styles.scss";

import { Roboto, Roboto_Slab } from "next/font/google";

// Self-hosted by next/font (no Google Fonts request). The CSS custom properties are
// picked up by --font-roboto / --font-roboto-slab in styles/variables/_misc.scss.
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-roboto-base: ${roboto.style.fontFamily};
          --font-roboto-slab-base: ${robotoSlab.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
