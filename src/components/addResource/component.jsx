import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@components/link';

import * as styles from './styles.module.scss';

export const AddResource = () => {
  const [title, setTitle] = useState();
  const [startYear, setStartYear] = useState();
  const [endYear, setEndYear] = useState();
  const [transcript, setTranscript] = useState();
  const [file, setFile] = useState(null);

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
    } else if (e.target.id === 'transcript') {
      setTranscript(e.target.value);
    } else if (e.target.id === 'file') {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    let errors = [];

    const titleEl = document.getElementById('title').value;
    const startYearEl = document.getElementById('startYear').value;
    const endYearEl = document.getElementById('endYear').value;
    const transcriptEl = document.getElementById('transcript').value;
    const fileEl = document.getElementById('file').files[0];

    const titleValue = title ? title : titleEl;
    const startYearValue = startYear ? startYear : startYearEl;
    const endYearValue = endYear ? endYear : endYearEl;
    const transcriptValue = transcript ? transcript : transcriptEl;
    const fileValue = file ? file : fileEl;

    if (!titleValue || titleValue === '') {
      errors.push('resource title is required');
    }
    if (!startYearValue) {
      errors.push('resource start year is required');
    }
    if (!endYearValue) {
      errors.push('resource end year is required');
    }
    if (!transcriptValue || transcriptValue === '') {
      errors.push('resource transcript is required');
    }
    if (!fileValue) {
      errors.push('pdf of resource is required');
    }

    if (errors.length > 0) return setError(errors);

    setLoading(true);

    // need to hit aws lambda function
    let url = '';

    return fetch(url, {
      method: 'POST',
      body: {
        title: titleValue,
        startYear: startYearValue,
        endYear: endYearValue,
        transcript: transcriptValue,
        file: fileValue,
      },
    })
      .then((response) => {
        // response needs to return id and link
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
      <div className={`${styles.addResource}`}>
        <h1>Add Resources</h1>
        <p>Your resource has been uploaded!</p>
        <p>ID: --id--</p>
        <p>Link: --link--</p>
        <p>
          <Link to="/">Return to Homepage</Link>
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
            placeholder="1994"
          />
        </label>
        <label>
          Transcript of Content
          <textarea
            name="transcript"
            id="transcript"
            onChange={saveInput}
            placeholder="Copy and paste all text in your pdf resource here."
          />
        </label>
        <label>
          Upload your resource as a PDF
          <input
            type="file"
            id="file"
            name="file"
            accept="application/pdf"
            onChange={saveInput}
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
