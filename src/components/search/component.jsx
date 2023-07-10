import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';
import moment from 'moment';

import * as styles from './styles.module.scss';

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        console.log(response);
        // response needs to return id and link
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError('something went wrong and your form was not submitted');
      });
  };
  return (
    <div className={`${styles.search}`}>
      <h1>Search</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" id="search" onChange={saveInput} />

        <p>+add filter</p>
        <p>+sort</p>

        <input type="submit" value="Search Resources" disabled={loading} />
      </form>
    </div>
  );
};

Search.propTypes = {};

Search.defaultProps = {};

export default Search;
