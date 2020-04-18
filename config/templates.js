module.exports = {
  socketsEvents: {
    templatePreviewEmit: 'template-preview-emit',
    templatePreviewReceive: 'template-preview-receive-{userId}',
  },
  defaultTemplate: 'standard',
  previewRoute: '/:language?/templates/preview/:template',
  tplPath: 'app/modules/templates/client/tpl',
};
