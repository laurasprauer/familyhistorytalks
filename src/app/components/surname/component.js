import PropTypes from "prop-types";
import CustomLink from "@components/customLink/component.js";
import CustomImage from "@components/customImage/component.js";
import RichText from "@components/richText/component.js";
import SVG from "@components/svg/component.js";

import * as styles from "./styles.module.scss";

export const Surname = ({ data }) => (
  <div className={styles.surnameContainer}>
    <div className={styles.backLink}>
      <CustomLink to="/surnames">
        <SVG name="arrow" /> Back to Surnames List
      </CustomLink>
    </div>
    <h1>{data.surname}</h1>
    <RichText value={data.body} className={styles.surnameBody} />
    <div className={styles.people}>
      <ul>
        {(data.people || []).map((person) => (
          <li key={person.slug}>
            <CustomLink to={`/person/${person.slug}`}>
              {person.profileImage?.asset?.url ? (
                <CustomImage
                  basePath={person.profileImage.asset.url}
                  alt=""
                  widths={[70]}
                  sizes="35px"
                  className={styles.thumb}
                />
              ) : (
                <SVG name="profile" />
              )}
              <div>
                <span className={styles.personName}>{person.name}</span>
                <span className={styles.personBirth}>
                  ({person.birthYear || "????"} - {person.deathYear || "????"})
                </span>
              </div>
            </CustomLink>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

Surname.propTypes = {
  data: PropTypes.shape({
    surname: PropTypes.string,
    body: PropTypes.array,
    people: PropTypes.array,
  }).isRequired,
};

export default Surname;
