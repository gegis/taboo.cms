import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from 'ckeditor4-react';

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.state = {
      data: '',
    };
    this.defultConfig = {
      allowedContent: true,
      removeFormatAttributes: '',
      contentsCss: ['/css/lib.css', '/css/app.css'],
      enterMode: 2, // P-1, BR-2, DIV-3
      height: '50vh',
    };
    // this.defultConfig.protectedSource.push(/<i[^>]*><\/i>/g);
    // this.defultConfig.protectedSource.push(/<span[^>]*><\/span>/g);
    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.checkLoaded = this.checkLoaded.bind(this);
  }

  componentDidMount() {
    this.checkLoaded();
  }

  checkLoaded() {
    // There is no proper on window.CKEDITOR created and loaded event
    if (window.CKEDITOR) {
      this.onLoad();
    } else {
      setTimeout(() => {
        this.checkLoaded();
      }, 5);
    }
  }

  onLoad() {
    const { value } = this.props;
    if (window.CKEDITOR) {
      // This is the only one way to prevent removing empty tags like i or span...
      window.CKEDITOR.dtd.$removeEmpty = {
        kbd: 1,
        var: 1,
      };
      // window.CKEDITOR.dtd.$blockLimit.div = 0;
      window.CKEDITOR.dtd.a.div = 1;
    }
    // Load content only after dtd manipulation
    this.setState({
      data: value,
    });
  }

  onChange(event) {
    const { onChange } = this.props;
    onChange(event.editor.getData());
  }

  render() {
    const { data } = this.state;
    const { config = this.defultConfig } = this.props;
    return (
      <CKEditor
        ref={ref => (this.editor = ref)}
        data={data}
        onChange={this.onChange}
        config={config}
        type="classic"
        onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)} // to solve Error code: editor-element-conflict
      />
    );
  }
}

RichTextEditor.propTypes = {
  onChange: PropTypes.func,
  config: PropTypes.object,
  value: PropTypes.string,
  id: PropTypes.string,
};

export default RichTextEditor;
