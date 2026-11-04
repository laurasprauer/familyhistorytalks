import Layout from "@components/layout/component.js";
import NotFound from "@components/notFound/component.js";

export default function Custom404() {
  return (
    <Layout title="Page Not Found" path="404" noindex>
      <NotFound />
    </Layout>
  );
}
