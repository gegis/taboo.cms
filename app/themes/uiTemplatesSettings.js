// It uses babel-plugin-bulk-import to discover all theme folders names in current dir
import * as themeTemplates from './**/Settings.jsx';
const uiTemplatesSettings = {};

Object.keys(themeTemplates).map(theme => {
  uiTemplatesSettings[theme] = require(`./${theme}/ui/components/admin/Settings`).default;
});

export default uiTemplatesSettings;
