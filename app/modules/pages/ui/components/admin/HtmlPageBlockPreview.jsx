import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'modules/core/ui/components/RichTextEditor';

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
        <RichTextEditor onChange={this.onCodeEditorChange} value={html} height="300px" enterMode={2} />
      </div>
    );
  }
}

HtmlPageBlockPreview.propTypes = {
  html: PropTypes.string.isRequired,
  setProps: PropTypes.func.isRequired,
};

export default HtmlPageBlockPreview;
