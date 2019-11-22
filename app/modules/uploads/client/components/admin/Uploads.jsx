import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import CreateModal from './CreateUploadModal';
import EditModal from './EditUploadModal';
import ListPage from 'modules/core/client/components/admin/ListPage';
import UploadsList from './UploadsList';

class Uploads extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.uploadsStore;
    this.notificationsStore = props.notificationsStore;
    this.localeStore = props.localeStore;
    this.settingsStore = props.settingsStore;
  }

  render() {
    return (
      <ListPage
        name="Uploads"
        entityStore={this.entityStore}
        ItemsListComponent={UploadsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Uploads.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('uploadsStore', 'notificationsStore', 'localeStore', 'settingsStore'), observer);

export default enhance(Uploads);
