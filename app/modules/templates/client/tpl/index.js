import standard from './standard';
import fluid from './fluid';

const templates = {
  standard: standard.template,
  fluid: fluid.template,
};

const settingsComponents = {
  standard: standard.settingsComponent,
  fluid: fluid.settingsComponent,
};

export { templates, settingsComponents };
