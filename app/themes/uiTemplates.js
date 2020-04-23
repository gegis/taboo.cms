// It uses babel-plugin-bulk-import to discover all theme folders names in current dir
import * as themeTemplates from './**/Template.jsx';
const uiTemplates = {};

Object.keys(themeTemplates).map(theme => {
  uiTemplates[theme] = require(`./${theme}/ui/components/Template`).default;
});

export default uiTemplates;
