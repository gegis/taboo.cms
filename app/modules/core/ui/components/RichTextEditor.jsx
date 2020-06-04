import React from 'react';
import PropTypes from 'prop-types';
import CKEditor4 from 'ckeditor4-react';
import UploadSelect from 'modules/uploads/ui/components/admin/UploadSelect';

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    const { enterMode = 2, height = '60vh' } = props;
    const { contentsCss = ['/css/_shared/lib.css', '/css/_shared/index.css'] } = props;
    const plugins = this.getPlugins();
    this.uploadSelectModal = React.createRef();
    this.defultConfig = {
      allowedContent: true,
      removeFormatAttributes: '',
      contentsCss: contentsCss,
      enterMode: enterMode, // P-1, BR-2, DIV-3
      height: height,
      removePlugins: ['about'],
    };
    if (plugins) {
      let pluginsArray = plugins.map(plugin => plugin.name);
      this.defultConfig.extraPlugins = pluginsArray.join(',');
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
  getEditorInstance() {
    if (window.CKEDITOR && window.CKEDITOR.currentInstance) {
      return window.CKEDITOR.currentInstance;
    }
    return null;
  }

  componentWillUnmount() {
    let instance = this.getEditorInstance();
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
        <UploadSelect ref={this.uploadSelectModal} closeOnSelect={true} onFileSelect={this.onUploadSelect} />
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
  height: PropTypes.string,
};

export default RichTextEditor;
