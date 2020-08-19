import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'modules/core/ui/components/admin/RichTextEditor';

class HtmlPageBlockPreview extends React.Component {
  constructor(props) {
    super(props);
    this.onCodeEditorChange = this.onCodeEditorChange.bind(this);
  }

  onCodeEditorChange(value) {
    const { setProps } = this.props;
    setProps({ html: value });
  }

  render() {
    const { html } = this.props;
    return (
      <div className="html-page-block-preview">
        <RichTextEditor onChange={this.onCodeEditorChange} value={html} height="300" enterMode={1} />
      </div>
    );
  }
}

HtmlPageBlockPreview.propTypes = {
  html: PropTypes.string.isRequired,
  setProps: PropTypes.func.isRequired,
};

export default HtmlPageBlockPreview;
