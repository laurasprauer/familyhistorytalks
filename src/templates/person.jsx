import React from 'react';
import { graphql } from 'gatsby';
import Container from '@components/container';

class PersonTemplate extends React.Component {
  render() {
    const { slug, type } = this.props.pageContext;
    const data = this.props.data.contentfulPerson;
    return <Container slug={slug} type={type} data={data} />;
  }
}

export const pageQuery = graphql`
  query Person($slug: String!) {
    contentfulPerson(slug: { eq: $slug }) {
      name
      slug
      body {
        childMarkdownRemark {
          html
        }
      }
      description {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;

export default PersonTemplate;
