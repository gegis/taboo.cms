import React, { Component } from 'react';
import Modal from 'modules/core/ui/components/Modal';

class GalleryModal extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = {
      item: {},
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {}

  open(item) {
    this.setState({ item });
    this.modal.current.open();
  }

  close() {
    this.setState({ item: {} });
    this.modal.current.close();
  }

  render() {
    const { item } = this.state;
    return (
      <Modal full ref={this.modal} cancelName="" title=" " className="gallery-image-modal use-max-width">
        <div className="gallery-image-wrapper">
          <img src={item.url} alt={item.name} />
        </div>
        <div className="gallery-image-name">{item.name}</div>
      </Modal>
    );
  }
}

export default GalleryModal;
