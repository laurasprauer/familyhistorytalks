"use client";

import { useState } from "react";
import classNames from "classnames";
import CustomLink from "@components/customLink/component.js";
import SVG from "@components/svg/component.js";

import * as styles from "./styles.module.scss";

const LINKS = [
  { to: "/surnames", label: "Surnames" },
  { to: "/search", label: "Search" },
  { to: "/about", label: "About" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <CustomLink to="/" className={styles.logo}>
        <SVG name="logo" />
        <span className="sr-only">Family History Talks – Home</span>
      </CustomLink>
      <button
        type="button"
        className={classNames(styles.menuIcon, { [styles.menuOpen]: isOpen })}
        aria-expanded={isOpen}
        aria-controls="site-nav"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span />
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
      </button>
      <nav id="site-nav" className={classNames(styles.nav, { [styles.open]: isOpen })}>
        {LINKS.map((link) => (
          <CustomLink key={link.to} to={link.to}>
            {link.label}
          </CustomLink>
        ))}
      </nav>
    </header>
  );
};

export default Header;
