import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { renderFamilyTreeArray } from './renderFamilyTreeArray.jsx';
import Link from '@components/link';
import * as styles from './styles.module.scss';
import './styles.scss';

export const Person = ({ data }) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // on component load, we are going to fetch all the resources
    if (data.resources && data.resources.length > 0) {
      const resourcesArray = [];
      const resourcesPromises = data.resources.map((resource, index) => {
        return fetch(
          `https://resources.familyhistorytalks.com/${resource.sid}/data.json`
        )
          .then((response) => response.json())
          .then((json) => {
            resourcesArray.push({ ...json, order: index + 1 });
          });
      });
      Promise.all(resourcesPromises).then(() => {
        // now that we have all the resource data
        // loop through the resource spans and add the appropriate links
        setTimeout(() => {
          setResources(resourcesArray.sort((a, b) => a.order - b.order));
          const isBrowser = typeof window !== 'undefined';
          if (isBrowser) {
            const resourceSpans = document.querySelectorAll('span[resource]');
            if (resourceSpans && resourceSpans.length > 0) {
              resourceSpans.forEach((span) => {
                const spanAttribute = span.getAttribute('resource');
                const resourceIndex = resourcesArray.findIndex((resource) => {
                  return spanAttribute == resource.id;
                });
                // only set the span's attributes if it's empty
                if (!span.innerHTML) {
                  const inlineFunction = `(function(){const element = document.getElementById("${resourcesArray[resourceIndex].id}");element.scrollIntoView({ behavior: 'smooth', block: 'center' });element.focus({ preventScroll: true });return false;})(); return false;`;
                  span.setAttribute('onClick', inlineFunction);
                  const txt = document.createTextNode(
                    `[${resourcesArray[resourceIndex].order}]`
                  );
                  span.appendChild(txt);
                }
              });
            }
          }
        });
      });
    }
  }, []);

  const formatDate = (month, day, year) => {
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

  return (
    <div className={`${styles.person}`}>
      <div className={`${styles.content}`}>
        <h1>
          {data.name} {data.surname}
        </h1>
        <p className={`${styles.selfDates}`}>
          {formatDate(data.birthMonth, data.birthDay, data.birthYear)} -{' '}
          {formatDate(data.deathMonth, data.deathDay, data.deathYear)}
        </p>
        <div
          dangerouslySetInnerHTML={{
            __html: data.body.childMarkdownRemark.html,
          }}
        ></div>
      </div>
      <div className={`${styles.sidebar}`}>
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
        {data.resources && data.resources.map ? (
          <>
            <h2>Resources</h2>
            <div>
              {resources.map((resource) => {
                return (
                  <div key={resource.id} className={`${styles.resource}`}>
                    <Link
                      id={`${resource.id}`}
                      target="_blank"
                      to={`https://resources.familyhistorytalks.com/${resource.id}/${resource.fileName}`}
                    >
                      <h3>
                        <span>{resource.order}</span>
                        {resource.title}
                      </h3>
                      <p>{resource.description}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

Person.propTypes = {
  data: PropTypes.any,
};

Person.defaultProps = {};

export default Person;
