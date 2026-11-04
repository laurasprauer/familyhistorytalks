import Layout from "@components/layout/component.js";
import Person from "@components/person/component.js";
import { readStaticData } from "@utils/readStaticData.js";

export async function getStaticPaths() {
  const { people } = readStaticData();
  return { paths: Object.keys(people).map((slug) => ({ params: { slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { data: readStaticData().people[params.slug] } };
}

export default function PersonPage({ data }) {
  return (
    <Layout
      title={data.name}
      path={`person/${data.slug}`}
      description={data.description || undefined}
      image={data.profileImage?.asset?.url}
    >
      <Person data={data} />
    </Layout>
  );
}
