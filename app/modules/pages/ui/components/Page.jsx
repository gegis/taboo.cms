import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import NotFound from 'modules/core/ui/components/NotFound';
import ConfigHelper from 'modules/core/ui/helpers/ConfigHelper';

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
      window.scrollTo(0, 0); // TODO - find a way for smoother scroll
    });
  }

  getPageTitle() {
    const { pagesStore } = this.props;
    if (!pagesStore.pageNotFound && pagesStore.page && pagesStore.page.title) {
      return pagesStore.page.title;
    }
    return null;
  }

  getPageBlocks() {
    const blocksMap = ConfigHelper.getPageBlocksMap();
    const { page = {} } = this.props.pagesStore;
    const { blocks = [] } = page;
    const pageBlocks = [];
    let PageBlockComponent;
    blocks.map((block, index) => {
      if (blocksMap[block.name] && blocksMap[block.name].displayComponent) {
        PageBlockComponent = blocksMap[block.name].displayComponent;
        pageBlocks.push(<PageBlockComponent key={index} {...block.props} />);
      }
    });
    return pageBlocks;
  }

  render() {
    const { pagesStore: { page = {}, pageNotFound } = {} } = this.props;
    const title = this.getPageTitle();
    if (pageNotFound) {
      return <NotFound />;
    } else {
      const Template = TemplatesHelper.getTemplate(page.template, { templatesStore: this.props.templatesStore });
      return (
        <Template metaTitle={title} title={title} className="page">
          {this.getPageBlocks()}
        </Template>
      );
    }
  }
}

Page.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('pagesStore', 'templatesStore'), observer);

export default enhance(Page);
