import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

class GalleryPageBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>gGalleryPageBlock.jsx</div>;
  }
}

GalleryPageBlock.propTypes = {
  notificationsStore: PropTypes.object.isRequired,
  galleriesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('notificationsStore', 'galleriesStore'), observer);

export default enhance(GalleryPageBlock);
