import React from 'react';
import PropTypes from 'prop-types';
import Person from '@components/person';
import AddResource from '@components/addResource';
import Link from '@components/link';
import Header from '@components/header';

import { Helmet } from 'react-helmet';

import * as styles from './styles.module.scss';

export const Container = ({ type, slug, data }) => {
  let title = 'Family History Talks';
  let description = 'Family Genealogy Website';
  let image = '';

  if (data && type === '404') {
    title = 'Oh Snap - 404 Page';
    description = "Looks like this page doesn't exist.";
  }

  if (data && type === 'person') {
    title = `Family History Talks - ${data.name}`;
    description = `${data.description.childMarkdownRemark}`.replace(
      /(<([^>]+)>)/gi,
      ''
    );
    // image = `${data.shareImage.file.url}`;
  }

  const isBrowser = typeof window !== 'undefined';
  const url = isBrowser
    ? window.location.href
    : 'https://familyhistorytalks.com';

  return (
    <div>
      <Helmet>
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <title>{title}</title>
        <link rel="canonical" href={`${url}/${slug}`} />
        <meta property="og:url" content={url} />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#343434" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="Family History Talks" />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={image} />
        <meta name="image" content={image} />
      </Helmet>

      <Header />

      <div className={`${styles.container}`}>
        <div className={styles.wrapper}>
          {type === 'home' && (
            <div>
              <h1>Hello!</h1>
            </div>
          )}

          {type === 'person' && <Person data={data} />}
          {type === 'addResource' && <AddResource />}

          {type === '404' && (
            <div className={styles.fourOhFour}>
              <div>
                <h1>Oh Snap</h1>
                <p>
                  Looks like this page doesn&apos;t exist.{' '}
                  <Link to="/">There&apos;s no place like home.</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Container.propTypes = {
  slug: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.any,
};

Container.defaultProps = {};

export default Container;
