import React from 'react';
import PropTypes from 'prop-types';
import CKEditor4 from 'ckeditor4-react';
import UploadSelect from 'modules/uploads/ui/components/admin/UploadSelect';

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    const { enterMode = 2, height = 300, minHeight = 0, maxHeight = 0 } = props;
    const { contentsCss = ['/css/_shared/lib.css', '/css/_shared/index.css'] } = props;
    this.uploadSelectModal = React.createRef();
    this.defultConfig = {
      allowedContent: true,
      removeFormatAttributes: '',
      contentsCss: contentsCss,
      enterMode: enterMode, // P-1, BR-2, DIV-3
      height: height,
      removePlugins: ['about'],
      extraPlugins: 'imageSelect',
      autoGrow_onStartup: true,
      embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
    };
    if (minHeight && minHeight > 0) {
      this.defultConfig.autoGrow_minHeight = minHeight;
    } else if (height) {
      this.defultConfig.autoGrow_minHeight = height;
    }
    if (maxHeight && maxHeight > 0) {
      this.defultConfig.autoGrow_maxHeight = maxHeight;
    } else if (height) {
      this.defultConfig.autoGrow_maxHeight = height;
    }
    // Load ckeditor locally:
    // CKEditor.editorUrl = '/ckeditor/ckeditor.js';
    // Example to prevent ckeditor manipulation:
    // this.defultConfig.protectedSource.push(/<i[^>]*><\/i>/g);
    // this.defultConfig.protectedSource.push(/<span[^>]*><\/span>/g);
    this.onChange = this.onChange.bind(this);
    this.onBeforeLoad = this.onBeforeLoad.bind(this);
    this.onUploadSelect = this.onUploadSelect.bind(this);
  }

  // This is a workaround... because if modal is opened second time, editor ref is lost.
  getCurrentEditorInstance() {
    if (window.CKEDITOR && window.CKEDITOR.currentInstance) {
      return window.CKEDITOR.currentInstance;
    }
    return null;
  }

  getFirstEditorInstance() {
    let instance = null;
    if (window.CKEDITOR && window.CKEDITOR.instances) {
      for (let key in window.CKEDITOR.instances) {
        instance = window.CKEDITOR.instances[key];
        break;
      }
    }
    return instance;
  }

  getEditorInstance() {
    let instance = this.getCurrentEditorInstance();
    if (!instance) {
      instance = this.getFirstEditorInstance();
    }
    return instance;
  }

  componentWillUnmount() {
    const instance = this.getEditorInstance();
    if (instance) {
      instance.destroy();
    }
  }

  onUploadSelect(file) {
    let instance = this.getEditorInstance();
    if (instance && file && file.url) {
      instance.insertHtml(`<img src="${file.url}" style="width: 100%;" />`);
    }
  }

  getPlugins() {
    return [
      {
        name: 'imageSelect',
        config: {
          icons: 'imageSelect',
          init: editor => {
            editor.addCommand('addImageSelect', {
              exec: () => {
                const { current: uploadsModal = null } = this.uploadSelectModal;
                if (uploadsModal) {
                  uploadsModal.open();
                }
              },
            });
            editor.ui.addButton('select-image', {
              label: 'Select Or Upload Image',
              command: 'addImageSelect',
              toolbar: 'insert',
            });
          },
        },
      },
    ];
  }

  registerPlugins(ckeditor) {
    let plugins = this.getPlugins();
    // This workaround need to make {this} scope work in getPlugins.... when the modal opened second time
    if (plugins && ckeditor.plugins.registered && ckeditor.plugins.registered.imageSelect) {
      delete ckeditor.plugins.registered.imageSelect;
    }
    if (plugins && ckeditor.plugins.registered && !ckeditor.plugins.registered.imageSelect) {
      plugins.map(plugin => {
        ckeditor.plugins.add(plugin.name, plugin.config);
      });
    }
  }

  onBeforeLoad(ckeditor) {
    if (ckeditor) {
      // to solve Error code: editor-element-conflict
      ckeditor.disableAutoInline = true;
      // This is the only one way to prevent removing empty tags like i or span...
      ckeditor.dtd.$removeEmpty = {
        kbd: 1,
        var: 1,
      };
      // window.CKEDITOR.dtd.$blockLimit.div = 0;
      ckeditor.dtd.a.div = 1;
      this.registerPlugins(ckeditor);
    }
  }

  onChange(event) {
    const { onChange } = this.props;
    onChange(event.editor.getData());
  }

  render() {
    const { value = '', config = this.defultConfig, type = 'classic' } = this.props;
    return (
      <div>
        <CKEditor4
          data={value}
          onChange={this.onChange}
          config={config}
          type={type} // you can have as 'inline'
          onBeforeLoad={this.onBeforeLoad}
        />
        <UploadSelect
          ref={this.uploadSelectModal}
          closeOnSelect={true}
          onFileSelect={this.onUploadSelect}
          filter={{ type: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'], isUserFile: false }}
        />
      </div>
    );
  }
}

RichTextEditor.propTypes = {
  onChange: PropTypes.func,
  config: PropTypes.object,
  value: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  contentsCss: PropTypes.array,
  enterMode: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default RichTextEditor;
