import React from 'react';
import PropTypes from 'prop-types';
import Frame from 'react-frame-component';

const defaultOnContainerClick = event => {
  event.preventDefault();
};

class PageBlockFrame extends React.Component {
  getHead() {
    const headItems = [];
    headItems.push(<link key="lib-styles" rel="stylesheet" type="text/css" href="/css/_shared/lib.css" />);
    headItems.push(<link key="app-styles" rel="stylesheet" type="text/css" href="/css/_shared/index.css" />);
    return headItems;
  }

  getStyle() {
    const { style = {} } = this.props;
    return Object.assign(
      {
        border: '0 none',
        width: '100%',
        height: '300px',
      },
      style
    );
  }

  // TODO find a way to prevent react router nav click to stop navigating away from edit page
  render() {
    const { children, onContainerClick = defaultOnContainerClick } = this.props;
    return (
      <Frame className="page-block-frame" style={this.getStyle()} ref={el => (this.iframe = el)} head={this.getHead()}>
        <div className="page-block-frame-inner" onClick={onContainerClick}>
          {children}
        </div>
      </Frame>
    );
  }
}

PageBlockFrame.propTypes = {
  onContainerClick: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default PageBlockFrame;
