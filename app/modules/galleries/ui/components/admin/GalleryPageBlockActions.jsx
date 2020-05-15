import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { InputPicker } from 'rsuite';
import PropTypes from 'prop-types';

class GalleryPageBlockActions extends React.Component {
  constructor(props) {
    super(props);
    this.setProps = this.setProps.bind(this);
  }

  componentDidMount() {
    this.props.galleriesAdminStore.loadAll();
  }

  setProps(key, value) {
    const { setProps } = this.props;
    const props = {};
    props[key] = value;
    setProps(props);
  }

  render() {
    const { galleriesAdminStore, id } = this.props;
    const { galleryOptions = [] } = galleriesAdminStore;
    return (
      <span className="gallery-page-block-actions inline">
        <InputPicker
          size="sm"
          placeholder="Please Select Gallery"
          value={id}
          data={galleryOptions}
          onChange={this.setProps.bind(this, 'id')}
        />
      </span>
    );
  }
}

GalleryPageBlockActions.propTypes = {
  galleriesAdminStore: PropTypes.object.isRequired,
  setProps: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

const enhance = compose(inject('galleriesAdminStore'), observer);

export default enhance(GalleryPageBlockActions);
