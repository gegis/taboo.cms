import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import GalleryModal from 'modules/galleries/ui/components/GalleryModal';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';

class ImagePreview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Template = TemplatesHelper.getTemplate('blank', { templatesStore: this.props.templatesStore });
    return (
      <Template metaTitle="Image">
        <div className="image-preview">
          <img src={window.location.href} />
        </div>
        <GalleryModal ref={this.modal} />
      </Template>
    );
  }
}

ImagePreview.propTypes = {
  templatesStore: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('templatesStore'), observer);

export default enhance(ImagePreview);
