import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import GalleryModal from 'modules/galleries/ui/components/GalleryModal';

class GalleryPageBlock extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
  }
  componentDidMount() {
    const { galleriesStore, id } = this.props;
    galleriesStore.loadById(id);
  }

  componentDidUpdate() {
    const { galleriesStore, id } = this.props;
    if (!galleriesStore.galleries[id]) {
      galleriesStore.loadById(id);
    }
  }

  showModal(item, event) {
    const { current } = this.modal;
    event.preventDefault();
    if (current) {
      current.open(item);
    }
  }

  render() {
    const { id, galleriesStore } = this.props;
    const images = [];

    if (galleriesStore.galleries[id]) {
      galleriesStore.galleries[id].images.map((image, index) => {
        images.push(
          <div className="gallery-item" key={index}>
            <a className="gallery-image-link" href="#" onClick={this.showModal.bind(this, image)}>
              <img src={image.url} className="gallery-image" alt={image.name} />
            </a>
          </div>
        );
      });
    }

    return (
      <div className="gallery-image-wrapper">
        <div className="gallery">{images}</div>
        <GalleryModal ref={this.modal} />
      </div>
    );
  }
}

GalleryPageBlock.propTypes = {
  id: PropTypes.string.isRequired,
  galleriesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('galleriesStore'), observer);

export default enhance(GalleryPageBlock);
