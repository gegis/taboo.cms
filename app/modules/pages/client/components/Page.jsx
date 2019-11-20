import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Layout from 'app/modules/core/client/components/Layout';
import { withRouter } from 'react-router-dom';
import Translation from 'app/modules/core/client/components/Translation';

class Page extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { pagesStore, match: { url = {} } = {} } = this.props;
    pagesStore.resetPage();
    this.loadPage(url);
  }

  componentDidUpdate(prevProps) {
    const { match: { url: newUrl = {} } = {} } = this.props;
    const { match: { url: prevUrl = {} } = {} } = prevProps;
    if (newUrl !== prevUrl) {
      this.loadPage(newUrl);
    }
  }

  loadPage(url) {
    const { pagesStore } = this.props;
    pagesStore.load(url).then(() => {
      window.scrollTo(0, 0);
    });
  }

  getPage() {
    const { pagesStore } = this.props;
    let title = '404';
    let body = <Translation message="Not Found" />;
    if (pagesStore.page && !pagesStore.pageNotFound) {
      title = pagesStore.page.title;
      body = <div dangerouslySetInnerHTML={{ __html: pagesStore.page.body }} />;
    }

    return (
      <div className="page">
        <h1 className="title">{title}</h1>
        <div className="body">{body}</div>
      </div>
    );
  }

  render() {
    return <Layout>{this.getPage()}</Layout>;
  }
}

Page.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const enhance = compose(
  withRouter,
  inject('pagesStore'),
  observer
);

export default enhance(Page);
