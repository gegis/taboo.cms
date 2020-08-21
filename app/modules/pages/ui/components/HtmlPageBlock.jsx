import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const locationOrigin = window.location.origin;

class HtmlPageBlock extends React.Component {
  constructor(props) {
    super(props);
    this.onHtmlPageBlockClick = this.onHtmlPageBlockClick.bind(this);
    this.goToLocalNavLink = this.goToLocalNavLink.bind(this);
  }

  isLocalNavLink(url) {
    if (
      url.indexOf('#') !== -1 ||
      url.indexOf('javascript') !== -1 ||
      url.indexOf('mailto') !== -1 ||
      url.indexOf('tel') !== -1
    ) {
      return false;
    } else if (url && url.indexOf(locationOrigin) !== -1) {
      return true;
    } else if (url && url.indexOf('http') === -1) {
      return true;
    }
    return false;
  }

  goToLocalNavLink(href, event) {
    const { history } = this.props;
    event.preventDefault();
    event.stopPropagation();
    return history.push(this.parseHref(href));
  }

  parseHref(href = '') {
    return href.replace(locationOrigin, '');
  }

  onHtmlPageBlockClick(event) {
    const { target = null } = event;
    if (target && target.href && this.isLocalNavLink(target.href)) {
      this.goToLocalNavLink(target.href, event);
    }
  }

  render() {
    const { html } = this.props;
    return (
      <div className="html-page-block" onClick={this.onHtmlPageBlockClick} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
}

HtmlPageBlock.propTypes = {
  html: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(HtmlPageBlock);
