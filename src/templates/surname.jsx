import React from 'react';
import { graphql } from 'gatsby';
import Container from '@components/container';

class SurnameTemplate extends React.Component {
  render() {
    const { slug, type, surname } = this.props.pageContext;
    const data = this.props.data.allContentfulPerson;
    return (
      <Container
        slug={slug}
        type={type}
        data={{ people: data, surname: surname }}
      />
    );
  }
}

export const pageQuery = graphql`
  query People($surname: String!) {
    allContentfulPerson(
      filter: { surname: { eq: $surname }, isLive: { eq: true } }
    ) {
      edges {
        node {
          name
          surname
          slug
          birthYear
          deathYear
        }
      }
    }
  }
`;

export default SurnameTemplate;
