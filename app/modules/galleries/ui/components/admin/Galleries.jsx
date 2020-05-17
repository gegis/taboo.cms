import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import CreateGalleryModal from './CreateGalleryModal';
import EditGalleryModal from './EditGalleryModal';
import ListPage from 'modules/core/ui/components/admin/ListPage';
import GalleriesList from './GalleriesList';

class Galleries extends React.Component {
  constructor(props) {
    super(props);
    this.galleriesAdminStore = props.galleriesAdminStore;
  }

  render() {
    return (
      <ListPage
        name="Galleries"
        entityStore={this.galleriesAdminStore}
        ItemsListComponent={GalleriesList}
        CreateModalComponent={CreateGalleryModal}
        EditModalComponent={EditGalleryModal}
      />
    );
  }
}

Galleries.propTypes = {
  galleriesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('galleriesAdminStore'), observer);

export default enhance(Galleries);
