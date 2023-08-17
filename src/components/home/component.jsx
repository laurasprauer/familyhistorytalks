import React from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';
import SVG from '@components/svg';

import * as styles from './styles.module.scss';

export const Home = ({ data }) => {
  return (
    <div className={`${styles.homeContainer}`}>
      <div className={`${styles.topCopy}`}>
        <h1>Welcome to Family History Talks</h1>
        <p>
          This site is still in progress, but we&apos;re activing working on
          filling it with genealogy information personal to our researchers. In
          the meantime, check out our{' '}
          <Link to="/surnames">available biographical articles</Link> grouped by
          surname, or <Link to="/search">search our resources</Link>.
        </p>
      </div>
    </div>
  );
};

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
