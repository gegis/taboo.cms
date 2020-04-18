import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import Translation from 'app/modules/core/client/components/Translation';
import GalleryModal from 'modules/galleries/client/components/GalleryModal';

class Page extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
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
      window.scrollTo(0, 0);
      this.registerGalleryImageLinks();
    });
  }

  getPageTitle() {
    const { pagesStore } = this.props;
    let title = '404';
    if (pagesStore.page && !pagesStore.pageNotFound) {
      title = pagesStore.page.title;
    }
    return title;
  }

  getPageBody() {
    const { pagesStore } = this.props;
    let body = <Translation message="Not Found" />;
    if (pagesStore.page && !pagesStore.pageNotFound) {
      body = <div dangerouslySetInnerHTML={{ __html: pagesStore.page.body }} />;
    }
    return body;
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

  getTemplateName() {
    const { pagesStore, templatesStore: { templateComponents = {}, defaultTemplateName = '' } = {} } = this.props;
    let template = defaultTemplateName;
    if (pagesStore.page && !pagesStore.pageNotFound && templateComponents[pagesStore.page.template]) {
      template = pagesStore.page.template;
    }
    return template;
  }

  getTemplateComponent() {
    const { templatesStore: { templateComponents = {} } = {} } = this.props;
    const templateName = this.getTemplateName();
    return templateComponents[templateName];
  }

  render() {
    const Template = this.getTemplateComponent();
    return (
      <Template metaTitle={this.getPageTitle()}>
        <div className="page">
          <h1 className="title">{this.getPageTitle()}</h1>
          <div className="body">{this.getPageBody()}</div>
        </div>
        <GalleryModal ref={this.modal} />
      </Template>
    );
  }
}

Page.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('pagesStore', 'templatesStore'), observer);

export default enhance(Page);
