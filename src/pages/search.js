import Layout from "@components/layout/component.js";
import Search from "@components/search/component.js";

export default function SearchPage() {
  return (
    <Layout
      title="Search"
      path="search"
      description="Search the Family History Talks archive of documents and biographies."
    >
      <Search />
    </Layout>
  );
}
