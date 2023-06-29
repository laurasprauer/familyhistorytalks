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
      surname
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
      birthDay
      birthMonth
      birthYear
      deathDay
      deathMonth
      deathYear
      gender
      mother {
        birthYear
        deathYear
        name
        gender
        isLive
        slug
        surname
      }
      father {
        birthYear
        deathYear
        name
        gender
        isLive
        slug
        surname
      }
      childrenOfPerson {
        birthYear
        deathYear
        name
        gender
        isLive
        slug
        surname
        gender
        mother {
          birthYear
          deathYear
          name
          gender
          isLive
          slug
          surname
        }
        father {
          birthYear
          deathYear
          name
          gender
          isLive
          slug
          surname
        }
      }
    }
  }
`;

export default PersonTemplate;
