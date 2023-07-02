import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';

import { isGatsbyLink } from './helpers';

import * as styles from './styles.module.scss';

const Link = ({
  children,
  className,
  target,
  to,
  onClick,
  setInnerHTML,
  download,
  id,
}) => {
  const classes = `
    ${styles.link}
    ${className ? className : ''}
  `;
  // [[styles.is_external]]: !isGatsbyLink(to) // add above if you need specific styling for external links

  let linkComponent;

  if (isGatsbyLink(to)) {
    // internal link
    linkComponent = (
      <GatsbyLink
        {...(to && { to: to })}
        {...(onClick && { onClick: onClick.bind(this) })}
        target={target}
        className={classes}
        {...(download && { download: true })}
        {...(id && { id: id })}
      >
        {setInnerHTML && (
          <span dangerouslySetInnerHTML={{ __html: children }}></span>
        )}
        {!setInnerHTML && children}
      </GatsbyLink>
    );
  } else {
    // external link
    linkComponent = (
      <a
        {...(to && { href: to })}
        target={target}
        rel={target === '_blank' ? 'noopener' : ''}
        className={classes}
        {...(onClick && { onClick: onClick.bind(this) })}
        {...(download && { download: true })}
        {...(id && { id: id })}
      >
        {setInnerHTML && (
          <span dangerouslySetInnerHTML={{ __html: children }}></span>
        )}
        {!setInnerHTML && children}
      </a>
    );
  }

  return linkComponent;
};

Link.propTypes = {
  setInnerHTML: PropTypes.bool,
  download: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  target: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string,
};

Link.defaultProps = {
  target: '_self',
  setInnerHTML: false,
};

export default Link;
