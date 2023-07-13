import React from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';

import * as styles from './styles.module.scss';

export const Surnames = ({ data }) => {
  return (
    <div className={`${styles.surnamesContainer}`}>
      <h1>Surnames</h1>
      <p>
        Below is the complete list of all biography articles hosted on Family
        History Talks, organized by surname. We&#39;re always looking to improve
        and expand our articles and resources. If you have any questions,
        concerns, or have any additional information you would like to share -
        please feel free to contact us at{' '}
        <a href="familyhistorytalks@gmail.com">familyhistorytalks@gmail.com</a>.
      </p>
      <div className={`${styles.surnames}`}>
        {data && data.surnames
          ? data.surnames.map((surname, index) => {
              return (
                <Link to={surname.slug} key={index}>
                  <strong>{surname.surname}</strong> ({surname.count})
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
};

Surnames.propTypes = {
  slug: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.any,
};

Surnames.defaultProps = {};

export default Surnames;
