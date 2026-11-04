import Layout from "@components/layout/component.js";
import Surname from "@components/surname/component.js";
import { readStaticData } from "@utils/readStaticData.js";

export async function getStaticPaths() {
  const { surnames } = readStaticData();
  return { paths: Object.keys(surnames).map((slug) => ({ params: { slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { data: readStaticData().surnames[params.slug] } };
}

export default function SurnamePage({ data }) {
  return (
    <Layout
      title={`${data.surname} Surname`}
      path={`surnames/${data.slug}`}
      description={`List of available ${data.surname} biographies.`}
    >
      <Surname data={data} />
    </Layout>
  );
}
