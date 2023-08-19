import React from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';
import SVG from '@components/svg';

import * as styles from './styles.module.scss';

export const Surname = ({ data }) => {
  const people = data[0].people;
  const surname = data[0].surname;
  return (
    <div className={`${styles.surnameContainer}`}>
      <div className={`${styles.backLink}`}>
        <Link to="/surnames">
          <SVG name="arrow" /> Back to Surnames List
        </Link>
      </div>
      <h1>{surname.surname}</h1>
      {surname.body ? (
        <div
          className={`${styles.surnameBody}`}
          dangerouslySetInnerHTML={{
            __html: surname.body.childMarkdownRemark.html,
          }}
        ></div>
      ) : null}
      <div className={`${styles.people}`}>
        <ul>
          {people
            ? people.map((person, index) => {
                return (
                  <li key={index}>
                    <Link to={`/person/${person.node.slug}`}>
                      {person.node.profileImage ? (
                        <img
                          src={person.node.profileImage.file.url}
                          alt={`${person.node.name} portrait`}
                        />
                      ) : (
                        <SVG name="profile" />
                      )}
                      <div>
                        <span className={`${styles.personName}`}>
                          {person.node.name}{' '}
                        </span>
                        <span className={`${styles.personBirth}`}>
                          ({person.node.birthYear} - {person.node.deathYear})
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })
            : null}
        </ul>
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
