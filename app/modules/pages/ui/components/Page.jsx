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
    } else if (page.headerBackground) {
      style.backgroundImage = `url('${page.headerBackground}')`;
    }
    return style;
  }

  getContentStyle() {
    const { page = {} } = this.props.pagesStore;
    if (page.background) {
      return {
        background: `transparent url('${page.background}') no-repeat 50% 0`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      };
    }
    return null;
  }

  render() {
    const { pagesStore } = this.props;
    const { page = {}, pageNotFound } = pagesStore;
    const { fullWidth = false } = page;
    const title = this.getPageTitle();
    if (pageNotFound) {
      return <NotFound />;
    } else {
      const Template = TemplatesHelper.getTemplate(page.template, { templatesStore: this.props.templatesStore });
      return (
        <Template
          metaTitle={title}
          title={title}
          containerStyle={this.getContentStyle()}
          headerStyle={this.getHeaderStyle()}
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
