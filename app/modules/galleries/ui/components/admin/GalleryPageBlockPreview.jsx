import React from 'react';
import PropTypes from 'prop-types';
import GalleryPageBlock from 'modules/galleries/ui/components/GalleryPageBlock';

class GalleryPageBlockPreview extends React.Component {
  render() {
    const { id } = this.props;
    return (
      <div className="gallery-page-block-preview" style={{ padding: '20px' }}>
        {id && <GalleryPageBlock id={id} />}
      </div>
    );
  }
}

GalleryPageBlockPreview.propTypes = {
  id: PropTypes.string.isRequired,
};

export default GalleryPageBlockPreview;
