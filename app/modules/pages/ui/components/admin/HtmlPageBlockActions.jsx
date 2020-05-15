import React from 'react';
import { IconButton, Icon } from 'rsuite';
import PropTypes from 'prop-types';
import Translation from 'modules/core/ui/components/Translation';
import HtmlCodeModal from 'modules/pages/ui/components/admin/HtmlCodeModal';

class HtmlPageBlockActions extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.openCodeEditor = this.openCodeEditor.bind(this);
    this.setProps = this.setProps.bind(this);
  }

  openCodeEditor() {
    const { current } = this.modal;
    if (current) {
      current.open();
    }
  }

  setProps(key, value) {
    const { setProps } = this.props;
    const props = {};
    props[key] = value;
    setProps(props);
  }

  render() {
    const { html, setProps } = this.props;
    return (
      <span className="gallery-page-block-actions inline">
        <IconButton size="sm" icon={<Icon icon="code" />} appearance="default" onClick={this.openCodeEditor}>
          <Translation message="HTML Code Editor" />
        </IconButton>
        <HtmlCodeModal ref={this.modal} html={html} setProps={setProps} />
      </span>
    );
  }
}

HtmlPageBlockActions.propTypes = {
  setProps: PropTypes.func.isRequired,
  html: PropTypes.string.isRequired,
};

export default HtmlPageBlockActions;
