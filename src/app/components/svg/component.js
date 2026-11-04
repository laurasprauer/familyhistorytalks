import PropTypes from "prop-types";
import svgs from "./svgs.js";

export const SVG = ({ name }) => svgs[name] || null;

SVG.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SVG;
