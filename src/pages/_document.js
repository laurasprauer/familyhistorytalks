import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#343434" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
