import React from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';

import * as styles from './styles.module.scss';

export const Surname = ({ data }) => {
  console.log(data);
  return (
    <div className={`${styles.surnameContainer}`}>
      <h1>{data.surname}</h1>
      <div className={`${styles.people}`}>
        {data && data.people && data.people.edges
          ? data.people.edges.map((person, index) => {
              return (
                <Link to={`/person/${person.node.slug}`} key={index}>
                  {person.node.name}
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
};

Surname.propTypes = {
  slug: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.any,
};

Surname.defaultProps = {};

export default Surname;
