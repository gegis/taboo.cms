import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Icon } from 'rsuite';
import CKEditor4 from 'ckeditor4-react';
import UploadSelect from 'modules/uploads/ui/components/UploadSelect';

class CKEditor extends React.Component {
  constructor(props) {
    super(props);
    this.uploadSelectModal = React.createRef();
    const { enterMode = 1, height = '', minHeight = 0, maxHeight = 0, startupFocus = 'end' } = props;
    const { contentsCss = ['/css/_shared/lib.css', '/css/_shared/index.css', '/css/_shared/editor.css'] } = props;
    this.defultConfig = {
      startupFocus: startupFocus,
      allowedContent: true,
      removeFormatAttributes: '',
      contentsCss: contentsCss,
      enterMode: enterMode, // P-1, BR-2, DIV-3
      height: height,
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Subscript,Superscript,Anchor,Font,Outdent,Indent',
      fontSize_sizes: '10/10px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;',
      removePlugins: ['about'],
      extraPlugins: 'imageSelect',
    };
    if (minHeight > 0) {
      this.defultConfig.autoGrow_minHeight = minHeight;
    }
    if (maxHeight > 0) {
      this.defultConfig.autoGrow_maxHeight = maxHeight;
    }
    if (height) {
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
    this.openUpload = this.openUpload.bind(this);
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

  openUpload() {
    const { current: uploadsModal = null } = this.uploadSelectModal;
    if (uploadsModal) {
      uploadsModal.open();
    }
  }

  onUploadSelect(file) {
    let instance = this.getFirstEditorInstance();
    if (instance && file && file.url) {
      instance.insertHtml(`<img src="${file.url}" class="browse-and-upload"/>`);
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
                this.openUpload();
              },
            });
            editor.ui.addButton('select-image', {
              label: 'Browse and Upload Images',
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
        <div className="ckeditor-extra-actions">
          <IconButton icon={<Icon icon="upload" />} appearance="link" className="btn-upload" onClick={this.openUpload}>
            Browse & Upload Images
          </IconButton>
        </div>
        <UploadSelect ref={this.uploadSelectModal} closeOnSelect={true} onFileSelect={this.onUploadSelect} />
      </div>
    );
  }
}

CKEditor.propTypes = {
  onChange: PropTypes.func,
  config: PropTypes.object,
  value: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  contentsCss: PropTypes.array,
  enterMode: PropTypes.number,
  height: PropTypes.string,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  startupFocus: PropTypes.string,
};

export default CKEditor;
