import Layout from "@components/layout/component.js";
import Surnames from "@components/surnames/component.js";
import { readStaticData } from "@utils/readStaticData.js";

export async function getStaticProps() {
  return { props: { surnames: readStaticData().surnameList } };
}

export default function SurnamesPage({ surnames }) {
  return (
    <Layout title="Surnames" path="surnames" description="List of available biographies by surname.">
      <Surnames surnames={surnames} />
    </Layout>
  );
}
