import CustomLink from "@components/customLink/component.js";

import * as styles from "./styles.module.scss";

export const Home = () => (
  <div className={styles.home}>
    <h1>Welcome to Family History Talks</h1>
    <p>
      This site is still in progress, but we&apos;re actively working on filling it with genealogy information
      personal to our researchers. In the meantime, check out our{" "}
      <CustomLink to="/surnames">available biographical articles</CustomLink> grouped by surname, or{" "}
      <CustomLink to="/search">search our resources</CustomLink>.
    </p>
  </div>
);

export default Home;
