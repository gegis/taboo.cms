import React, { Component } from 'react';
import Modal from 'modules/core/client/components/Modal';

class GalleryModal extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = {
      name: '',
      url: '',
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {}

  open(url, name) {
    this.setState({ url, name });
    this.modal.current.open();
  }

  close() {
    this.setState({ url: '', name: '' });
    this.modal.current.close();
  }

  render() {
    const { name, url } = this.state;
    return (
      <Modal full ref={this.modal} cancelName="" title=" " className="gallery-image-modal">
        <div className="gallery-image-wrapper">
          <img src={url} alt={name} />
        </div>
        <div className="gallery-image-name">
          {name}
        </div>
      </Modal>
    );
  }
}

export default GalleryModal;
