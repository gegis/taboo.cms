module.exports = {
  socketsEvents: {
    templatePreviewEmit: 'template-preview-emit',
    templatePreviewReceive: 'template-preview-receive-{userId}',
  },
  defaultTemplate: 'standard',
  previewRoute: '/:language?/templates/preview/:template',
  themesPath: 'app/modules/templates/client/themes',
};
