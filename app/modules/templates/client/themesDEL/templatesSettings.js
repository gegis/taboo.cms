// It uses babel-plugin-bulk-import to discover all theme folders names in current dir
import * as themeTemplates from './**/Settings.jsx';
const templatesSettings = {};

Object.keys(themeTemplates).map(theme => {
  templatesSettings[theme] = require(`./${theme}/components/admin/Settings`).default;
});

export default templatesSettings;
