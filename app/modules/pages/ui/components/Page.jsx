import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import GalleryModal from 'modules/galleries/ui/components/GalleryModal';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import NotFound from 'modules/core/ui/components/NotFound';

const locationOrigin = window.location.origin;

class Page extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.registerLinks = this.registerLinks.bind(this);
    this.registerGalleryImageLinks = this.registerGalleryImageLinks.bind(this);
    this.showGalleryImage = this.showGalleryImage.bind(this);
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
      this.registerLinks();
      this.registerGalleryImageLinks();
    });
  }

  getPageTitle() {
    const { pagesStore } = this.props;
    let title = null;
    if (!pagesStore.pageNotFound && pagesStore.page && pagesStore.page.title) {
      title = pagesStore.page.title;
    }
    return title;
  }

  getPageBody() {
    const { pagesStore } = this.props;
    let body = null;
    if (!pagesStore.pageNotFound && pagesStore.page && pagesStore.page.body) {
      body = <div dangerouslySetInnerHTML={{ __html: pagesStore.page.body }} />;
    }
    return body;
  }

  parseHref(href = '') {
    return href.replace(locationOrigin, '');
  }

  navigateToPage(href, event) {
    const { history } = this.props;
    event.preventDefault();
    event.stopPropagation();
    return history.push(this.parseHref(href));
  }

  registerLinks() {
    const links = document.querySelectorAll('.page a.nav');
    Array.from(links).forEach(link => {
      link.addEventListener('click', this.navigateToPage.bind(this, link.href));
    });
  }

  registerGalleryImageLinks() {
    const links = document.getElementsByClassName('gallery-image-link');
    // TODO - build a list of next and prev images for gallery preview;
    Array.from(links).forEach(link => {
      link.addEventListener('click', this.showGalleryImage);
    });
  }

  showGalleryImage(event) {
    const { target: { dataset: { name = '', url = '' } = {} } = {} } = event;
    const { current: currentModal = {} } = this.modal;
    event.preventDefault();
    event.stopPropagation();
    currentModal.open(url, name);
  }

  render() {
    const { pagesStore: { page = {}, pageNotFound } = {} } = this.props;
    const title = this.getPageTitle();
    if (pageNotFound) {
      return <NotFound />;
    } else {
      const Template = TemplatesHelper.getTemplate(page.template, { templatesStore: this.props.templatesStore });
      return (
        <Template metaTitle={title} title={title}>
          <div className="page">
            <div className="body">{this.getPageBody()}</div>
          </div>
          <GalleryModal ref={this.modal} />
        </Template>
      );
    }
  }
}

Page.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('pagesStore', 'templatesStore'), observer);

export default enhance(Page);
