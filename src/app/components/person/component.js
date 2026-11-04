import PropTypes from "prop-types";
import classNames from "classnames";
import CustomLink from "@components/customLink/component.js";
import CustomImage from "@components/customImage/component.js";
import RichText from "@components/richText/component.js";
import { buildFamilyTree } from "@utils/buildFamilyTree.js";

import * as styles from "./styles.module.scss";

const formatDate = (month, day, year) => {
  if (!month && !day && !year) return "????";
  return [month, day && year ? `${day},` : day, year].filter(Boolean).join(" ");
};

// Hotspot (0–1) → CSS object-position so cropped portraits keep the face in view.
const hotspotPosition = (image) =>
  image?.hotspot ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%` : "center top";

const FamilyName = ({ member }) => {
  const nameClasses = classNames(styles.name, {
    [styles.self]: member.relationship === "self",
    [styles.spouse]: member.relationship === "spouse / partner",
  });
  if (member.link && member.link !== "unknownPlaceholder" && member.isLive) {
    return (
      <CustomLink to={`/person/${member.link}`} className={nameClasses}>
        {member.name}
      </CustomLink>
    );
  }
  return <span className={nameClasses}>{member.name}</span>;
};

FamilyName.propTypes = {
  member: PropTypes.object.isRequired,
};

const FamilyList = ({ members }) => (
  <ul>
    {members.map((member, index) => (
      <li key={`${member.link || member.name}-${index}`}>
        <div className={classNames(styles.flex, { [styles.lastItem]: member.lastItem })}>
          <div>
            <FamilyName member={member} />
            {member.dates ? <span className={styles.dates}>{member.dates}</span> : null}
          </div>
          {member.relationship !== "self" ? <span className={styles.relation}>{member.relationship}</span> : null}
        </div>
        {member.children?.length ? <FamilyList members={member.children} /> : null}
      </li>
    ))}
  </ul>
);

FamilyList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export const Person = ({ data }) => {
  const assets = data.assets || [];
  const citationNumbers = Object.fromEntries(assets.map((asset, index) => [asset._id, index + 1]));
  const portrait = data.profileImage?.asset;

  return (
    <div className={styles.person}>
      <div className={styles.content}>
        <div className={styles.top}>
          {portrait?.url ? (
            <CustomImage
              basePath={portrait.url}
              alt={data.profileImage.alt || `${data.name} portrait`}
              widths={[300, 600]}
              sizes="(max-width: 599px) 300px, 140px"
              objectPosition={hotspotPosition(data.profileImage)}
              className={styles.portrait}
              priority
            />
          ) : null}
          <div>
            <h1 className={styles.nameTitle}>{data.name}</h1>
            <p className={styles.selfDates}>
              {formatDate(data.birthMonth, data.birthDay, data.birthYear)} -{" "}
              {formatDate(data.deathMonth, data.deathDay, data.deathYear)}
            </p>
          </div>
        </div>
        <RichText value={data.body} citationNumbers={citationNumbers} />
      </div>
      <aside className={styles.sidebar}>
        <h2>Family Relationships</h2>
        <div className={styles.family}>
          <FamilyList members={buildFamilyTree(data)} />
        </div>
        {assets.length > 0 ? (
          <>
            <h2>Resources</h2>
            <div>
              {assets.map((asset, index) => (
                <div key={asset._id} className={styles.resource}>
                  <CustomLink id={asset._id} to={asset.url} target="_blank">
                    <h3>
                      <span className={styles.number} aria-hidden="true">
                        {index + 1}
                      </span>
                      <span className="sr-only">Source {index + 1}: </span>
                      {asset.title}
                    </h3>
                    {asset.description ? <p>{asset.description}</p> : null}
                  </CustomLink>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
};

Person.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Person;
