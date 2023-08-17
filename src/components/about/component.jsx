import React from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';
import SVG from '@components/svg';

import * as styles from './styles.module.scss';

export const About = ({ data }) => {
  return (
    <div className={`${styles.aboutContainer}`}>
      <div className={`${styles.topCopy}`}>
        <h1>About Family History Talks</h1>
        <p>Page coming soon</p>
      </div>
    </div>
  );
};

About.propTypes = {};

About.defaultProps = {};

export default About;
