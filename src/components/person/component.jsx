import React from 'react';
import PropTypes from 'prop-types';

import * as styles from './styles.module.scss';

export const Person = ({ data }) => {
  return (
    <div className={`${styles.person}`}>
      {data.name ? (
        <h1 className={`${styles.personTitle}`}>{data.name}</h1>
      ) : null}
      {data.body ? (
        <div
          dangerouslySetInnerHTML={{
            __html: data.body.childMarkdownRemark.html,
          }}
        ></div>
      ) : null}
    </div>
  );
};

Person.propTypes = {
  data: PropTypes.any,
};

Person.defaultProps = {};

export default Person;
