import React from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';

import * as styles from './styles.module.scss';

export const Surnames = ({ data }) => {
  console.log(data);
  return (
    <div className={`${styles.surnamesContainer}`}>
      <h1>Surnames</h1>
      <p>
        Below is the complete list of all biography articles hosted on Family
        History Talks, organized by surname. We&#39;re always looking to improve
        and expand our articles and resources. If you have any questions,
        concerns, or have any additional information you would like to share,
        please feel free to contact us at{' '}
        <a href="familyhistorytalks@gmail.com">familyhistorytalks@gmail.com</a>.
      </p>
      <div className={`${styles.surnames}`}>
        <ul>
          {data && data.surnames
            ? data.surnames.map((surname, index) => {
                if (surname.node.isLive) {
                  return (
                    <li key={index}>
                      <Link to={`/surnames/${surname.node.slug}`}>
                        <strong>{surname.node.surname}</strong>
                      </Link>
                    </li>
                  );
                }
              })
            : null}
        </ul>
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
