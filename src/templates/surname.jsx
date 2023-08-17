import React from 'react';
import { graphql } from 'gatsby';
import Container from '@components/container';

class SurnameTemplate extends React.Component {
  render() {
    const { slug, type } = this.props.pageContext;
    const data = {
      surname: this.props.data.contentfulSurname,
      people: this.props.data.allContentfulPerson.edges,
    };

    return <Container slug={slug} type={type} data={[data]} />;
  }
}

export const pageQuery = graphql`
  query Surname($slug: String!) {
    allContentfulPerson(
      sort: { fields: name }
      filter: { isLive: { eq: true }, surname: { slug: { eq: $slug } } }
    ) {
      edges {
        node {
          slug
          name
          profileImage {
            file {
              url
            }
          }
          deathYear
          birthYear
        }
      }
    }
    contentfulSurname(slug: { eq: $slug }) {
      surname
      slug
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;

export default SurnameTemplate;
