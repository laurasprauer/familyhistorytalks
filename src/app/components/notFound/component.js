import CustomLink from "@components/customLink/component.js";

import * as styles from "./styles.module.scss";

export const NotFound = () => (
  <div className={styles.notFound}>
    <div>
      <h1>Oh Snap</h1>
      <p>
        Looks like this page doesn&apos;t exist. <CustomLink to="/">There&apos;s no place like home.</CustomLink>
      </p>
    </div>
  </div>
);

export default NotFound;
