import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';
import moment from 'moment';

import * as styles from './styles.module.scss';

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const saveInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // let url = `/documents/search?query=kizzy&startYear=1800&endYear=2000`;
    // http://search-api-1080216822.us-east-1.elb.amazonaws.com/documents/search?query=kizzy
    let url = `http://search-api-1080216822.us-east-1.elb.amazonaws.com/documents/search?query=${encodeURIComponent(
      searchQuery
    )}`;

    return fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        setResults(response);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError('Oops! Something went wrong and your form was not submitted.');
      });
  };
  return (
    <div className={`${styles.search}`}>
      <h1>Search</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" id="search" onChange={saveInput} />

        {/* <div className={`${styles.filter}`}>
          <button>+add filter</button>
        </div> */}

        <input type="submit" value="Search" disabled={loading} />
      </form>
      {error ? <div className={`${styles.error}`}>{error}</div> : null}
      {results ? (
        <div className={`${styles.results}`}>
          {results && results.length
            ? results.map((item, index) => {
                return (
                  <Link
                    to={`https://resources.familyhistorytalks.com/${item.id}/${item.fileName}`}
                    key={index}
                    className={`${styles.resultItem}`}
                    target="_blank"
                  >
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Link>
                );
              })
            : null}
        </div>
      ) : null}
    </div>
  );
};

Search.propTypes = {};

Search.defaultProps = {};

export default Search;
