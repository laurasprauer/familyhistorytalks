const path = require('path');

exports.onCreateWebpackConfig = ({ actions, getConfig, stage, loaders }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        path: require.resolve('path-browserify'),
        '@components': path.resolve(__dirname, 'src/components'),
      },
      extensions: ['.js', '.json', '.jsx', '.tsx', '.ts'],
      fallback: {
        url: require.resolve('url/'),
      },
    },
  });
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allContentfulPerson {
          nodes {
            slug
            isLive
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your Contentful posts`,
      result.errors
    );
    return;
  }

  const pageTemplate = path.resolve('./src/templates/flexible.jsx');
  const personTemplate = path.resolve('./src/templates/person.jsx');
  const allPersons = result.data.allContentfulPerson.nodes;

  if (allPersons.length > 0) {
    allPersons.forEach((person) => {
      if (person.isLive) {
        const slug = `/person/${person.slug}`;
        createPage({
          path: slug,
          component: personTemplate,
          context: {
            slug: person.slug,
            type: 'person',
          },
        });
      }
    });
  }

  createPage({
    path: '/',
    component: pageTemplate,
    context: {
      slug: '/',
      type: 'home',
    },
  });

  createPage({
    path: '/search',
    component: pageTemplate,
    context: {
      slug: '/search',
      type: 'search',
    },
  });

  createPage({
    path: '/add-resource',
    component: pageTemplate,
    context: {
      slug: '/add-resource',
      type: 'addResource',
    },
  });
};
