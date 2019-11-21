import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import CreateGalleryModal from './CreateGalleryModal';
import EditGalleryModal from './EditGalleryModal';
import ListPage from 'modules/core/client/components/admin/ListPage';
import GalleriesList from './GalleriesList';

class Galleries extends React.Component {
  constructor(props) {
    super(props);
    this.galleriesStore = props.galleriesStore;
  }

  render() {
    return (
      <ListPage
        name="Galleries"
        entityStore={this.galleriesStore}
        ItemsListComponent={GalleriesList}
        CreateModalComponent={CreateGalleryModal}
        EditModalComponent={EditGalleryModal}
      />
    );
  }
}

Galleries.propTypes = {
  galleriesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('galleriesStore'), observer);

export default enhance(Galleries);
