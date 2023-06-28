import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';

import * as styles from './styles.module.scss';

export const AddResource = () => {
  const [title, setTitle] = useState();
  const [startYear, setStartYear] = useState();
  const [endYear, setEndYear] = useState();
  const [content, setContent] = useState();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveInput = (e) => {
    setError(null);
    if (e.target.id === 'title') {
      setTitle(e.target.value);
    } else if (e.target.id === 'startYear') {
      setStartYear(e.target.value);
    } else if (e.target.id === 'endYear') {
      setEndYear(e.target.value);
    } else if (e.target.id === 'content') {
      setContent(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    let errors = [];

    const titleEl = document.getElementById('title').value;
    const startYearEl = document.getElementById('startYear').value;
    const endYearEl = document.getElementById('endYear').value;
    const contentEl = document.getElementById('content').value;

    const titleValue = title ? title : titleEl;
    const startYearValue = startYear ? startYear : startYearEl;
    const endYearValue = endYear ? endYear : endYearEl;
    const contentValue = content ? content : contentEl;

    if (!titleValue || titleValue === '') {
      errors.push('resource title is required');
    }
    if (!startYearValue) {
      errors.push('resource start year is required');
    }
    if (!endYearValue) {
      errors.push('resource end year is required');
    }
    if (!contentValue || contentValue === '') {
      errors.push('a transcript of resource content is required');
    }

    if (errors.length > 0) return setError(errors);

    setLoading(true);

    const formData = new FormData();
    formData.append('title', titleValue);
    formData.append('startYear', startYearValue);
    formData.append('endYear', endYearValue);
    formData.append('content', contentValue);

    let url = ''; // need to hit aws lambda function

    return fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        setLoading(false);
        setError('something went wrong and your form was not submitted');
      });
  };

  if (success) {
    return (
      <div className={`${styles.success}`}>
        <h1>Thanks!</h1>
        <p>
          I received your message and will get back to you as soon as I can.
        </p>
        <p>
          <Link to="/" darkmode={!darkmode}>
            Return to Homepage
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.addResource}`}>
      <h1>Add Resources</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title of Resource
          <input
            type="text"
            name="title"
            id="title"
            onChange={saveInput}
            value={title}
            placeholder="Title"
          />
        </label>
        <label>
          Start Year
          <input
            type="number"
            name="startYear"
            id="startYear"
            onChange={saveInput}
            value={startYear}
            placeholder="1992"
          />
        </label>
        <label>
          End Year
          <input
            type="number"
            name="endYear"
            id="endYear"
            onChange={saveInput}
            value={endYear}
            placeholder="1994"
          />
        </label>
        <label>
          Transcript of Content
          <textarea
            type="number"
            name="content"
            id="content"
            onChange={saveInput}
            value={content}
            placeholder="Copy and paste all text in your pdf resource here."
          />
        </label>
        <input type="submit" value="Upload Resource" disabled={loading} />
        {error &&
          error.map((er) => {
            return (
              <p key={er} className={styles.error}>
                {er}
              </p>
            );
          })}
      </form>
    </div>
  );
};

AddResource.propTypes = {};

AddResource.defaultProps = {};

export default AddResource;
