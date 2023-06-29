import React from 'react';
import PropTypes from 'prop-types';
import { renderFamilyTreeArray } from './renderFamilyTreeArray.jsx';
import Link from '@components/link';
import * as styles from './styles.module.scss';

export const Person = ({ data }) => {
  const formatDate = (month, day, year, yearOnly) => {
    if (!month && !day && !year) {
      return '????';
    }

    return `${month ? month : ''} ${day ? day : ''} ${day && year ? ',' : ''} ${
      year ? year : ''
    }`;
  };

  const wrapNameInLink = (link, content, isLive, relationship) => {
    if (link && link !== 'unknownPlaceholder' && isLive) {
      return (
        <Link to={`/person/${link}`} className={`${styles.name}`}>
          {content}
        </Link>
      );
    }
    return (
      <span
        className={`${styles.name} ${
          relationship === 'self' ? styles.self : ''
        } ${relationship === 'spouse / partner' ? styles.spouse : ''}`}
      >
        {content}
      </span>
    );
  };

  const familyTreeArray = renderFamilyTreeArray(data);
  console.log(familyTreeArray);

  return (
    <div className={`${styles.person}`}>
      <div className={`${styles.sidebar}`}>
        <h1>
          {data.name} {data.surname}
        </h1>
        <p className={`${styles.selfDates}`}>
          {formatDate(data.birthMonth, data.birthDay, data.birthYear)} -{' '}
          {formatDate(data.deathMonth, data.deathDay, data.deathYear)}
        </p>
        <h2>Family Relationships</h2>
        <div className={`${styles.family}`}>
          <ul>
            {familyTreeArray.map((person, index) => {
              return (
                <li key={index}>
                  <div
                    className={`${styles.flex} ${
                      person.lastItem ? styles.lastItem : ''
                    }`}
                  >
                    <div>
                      {wrapNameInLink(
                        person.link,
                        person.name,
                        person.isLive,
                        person.relationship
                      )}
                      {person.dates ? (
                        <span className={`${styles.dates}`}>
                          {person.dates}
                        </span>
                      ) : null}
                    </div>
                    {person.relationship !== 'self' ? (
                      <span className={`${styles.relation}`}>
                        {person.relationship}
                      </span>
                    ) : null}
                  </div>
                  {person.childrenOfPerson ? (
                    <ul>
                      {person.childrenOfPerson.map((child, childIndex) => {
                        return (
                          <li key={childIndex}>
                            <div
                              className={`${styles.flex} ${
                                child.lastItem ? styles.lastItem : ''
                              }`}
                            >
                              <div>
                                {wrapNameInLink(
                                  child.link,
                                  child.name,
                                  child.isLive,
                                  child.relationship
                                )}
                                {child.dates ? (
                                  <span className={`${styles.dates}`}>
                                    {child.dates}
                                  </span>
                                ) : null}
                              </div>
                              {child.relationship !== 'self' ? (
                                <span className={`${styles.relation}`}>
                                  {child.relationship}
                                </span>
                              ) : null}
                            </div>

                            {child.childrenOfPerson ? (
                              <ul>
                                {child.childrenOfPerson.map(
                                  (childChild, childChildIndex) => {
                                    return (
                                      <li key={childChildIndex}>
                                        <div
                                          className={`${styles.flex} ${
                                            childChild.lastItem
                                              ? styles.lastItem
                                              : ''
                                          }`}
                                        >
                                          <div>
                                            {wrapNameInLink(
                                              childChild.link,
                                              childChild.name,
                                              childChild.isLive,
                                              childChild.relationship == 'self'
                                            )}
                                            {childChild.dates ? (
                                              <span
                                                className={`${styles.dates}`}
                                              >
                                                {childChild.dates}
                                              </span>
                                            ) : null}
                                          </div>
                                          {childChild.relationship !==
                                          'self' ? (
                                            <span
                                              className={`${styles.relation}`}
                                            >
                                              {childChild.relationship}
                                            </span>
                                          ) : null}
                                        </div>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div
        className={`${styles.content}`}
        dangerouslySetInnerHTML={{
          __html: data.body.childMarkdownRemark.html,
        }}
      ></div>
    </div>
  );
};

Person.propTypes = {
  data: PropTypes.any,
};

Person.defaultProps = {};

export default Person;
