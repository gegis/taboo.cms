// It uses babel-plugin-bulk-import to discover all theme folders names in current dir
import * as themeTemplates from './**/Template.jsx';
const templates = {};

Object.keys(themeTemplates).map(theme => {
  templates[theme] = require(`./${theme}/components/Template`).default;
});

export default templates;
