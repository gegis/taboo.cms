import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import NotFound from 'modules/core/ui/components/NotFound';
import ConfigHelper from 'modules/core/ui/helpers/ConfigHelper';

class Page extends Component {
  componentDidMount() {
    const { pagesStore, match: { url = {} } = {} } = this.props;
    pagesStore.resetPage();
    this.loadPage(url);
  }

  componentWillUnmount() {
    const { pagesStore } = this.props;
    pagesStore.resetPage();
  }

  componentDidUpdate(prevProps) {
    const { match: { url: newUrl = {} } = {} } = this.props;
    const { match: { url: prevUrl = {} } = {} } = prevProps;
    if (newUrl !== prevUrl) {
      this.loadPage(newUrl);
    }
  }

  loadPage(url) {
    const { pagesStore, uiStore } = this.props;
    uiStore.setLoading(true);
    pagesStore
      .load(url)
      .then(() => {
        uiStore.setLoading(false);
      })
      .catch(() => {
        uiStore.setLoading(false);
      });
  }

  getPageBlocks() {
    const blocksMap = ConfigHelper.getPageBlocksMap();
    const { page = {} } = this.props.pagesStore;
    const { blocks = [] } = page;
    const pageBlocks = [];
    let pageBlock;
    let PageBlockComponent;
    blocks.map((block, index) => {
      pageBlock = Object.assign({}, toJS(block));
      if (blocksMap[pageBlock.name] && blocksMap[pageBlock.name].displayComponent) {
        PageBlockComponent = blocksMap[pageBlock.name].displayComponent;
        pageBlocks.push(<PageBlockComponent key={index} {...pageBlock.props} />);
      }
    });
    return pageBlocks;
  }

  getHeaderStyle() {
    const { page = {} } = this.props.pagesStore;
    const style = {};
    if (page.background) {
      style.backgroundColor = 'transparent';
    }
    if (page.headerBackground) {
      style.background = `transparent url('${page.headerBackground}') no-repeat 50% 50%`;
      style.backgroundSize = 'cover';
    }
    return style;
  }

  getContentStyle() {
    const { page = {} } = this.props.pagesStore;
    if (page.background) {
      return {
        background: `transparent url('${page.background}') no-repeat 50% 50%`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      };
    }
    return null;
  }

  getPageTitle() {
    const { pagesStore } = this.props;
    if (!pagesStore.pageNotFound && pagesStore.page && pagesStore.page.title) {
      return pagesStore.page.title;
    }
    return null;
  }

  getMetaTitle(title) {
    const { pagesStore } = this.props;
    const { page: { metaTitle = null } = {} } = pagesStore;
    if (metaTitle) {
      return metaTitle;
    }
    return title;
  }

  render() {
    const { pagesStore } = this.props;
    const { page = {}, pageNotFound } = pagesStore;
    const { fullWidth = false, metaKeywords, metaDescription } = page;
    const title = this.getPageTitle();
    const metaTitle = this.getMetaTitle(title);
    if (pageNotFound) {
      return <NotFound />;
    } else {
      const Template = TemplatesHelper.getTemplate(page.template, { templatesStore: this.props.templatesStore });
      return (
        <Template
          title={title}
          metaTitle={metaTitle}
          metaKeywords={metaKeywords}
          metaDescription={metaDescription}
          headerStyle={this.getHeaderStyle()}
          contentStyle={this.getContentStyle()}
          fluid={fullWidth}
          className="page"
        >
          {this.getPageBlocks()}
        </Template>
      );
    }
  }
}

Page.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('pagesStore', 'uiStore', 'templatesStore'), observer);

export default enhance(Page);
