import PropTypes from "prop-types";
import CustomLink from "@components/customLink/component.js";

import * as styles from "./styles.module.scss";

export const Surnames = ({ surnames = [] }) => (
  <div className={styles.surnamesContainer}>
    <h1>Surnames</h1>
    <p>Below is the complete list of all biographical articles hosted on Family History Talks, grouped by surname.</p>
    <div className={styles.surnames}>
      <ul>
        {surnames.map((surname) => (
          <li key={surname.slug}>
            <CustomLink to={`/surnames/${surname.slug}`}>
              <strong>{surname.surname}</strong>
            </CustomLink>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

Surnames.propTypes = {
  surnames: PropTypes.arrayOf(PropTypes.shape({ surname: PropTypes.string, slug: PropTypes.string })),
};

export default Surnames;
