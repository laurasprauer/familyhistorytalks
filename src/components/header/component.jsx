import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@components/Link';
import SVG from '@components/svg';

import * as styles from './styles.module.scss';

const Header = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className={`${styles.header}`}>
      <Link to="/" className={`${styles.logo}`}>
        <SVG name="logo" />
      </Link>
      <div
        className={`${styles.menuIcon}  ${isOpen ? styles.menuOpen : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span></span>
      </div>
      <div className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
        <Link to="/surnames">Surnames</Link>
        <Link to="/search">Search</Link>
        <Link to="/about">About</Link>
      </div>
    </header>
  );
};

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
