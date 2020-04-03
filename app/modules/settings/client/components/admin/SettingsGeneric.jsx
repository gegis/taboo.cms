import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import SettingsList from './SettingsList';
import CreateModal from './CreateSettingsModal';
import EditModal from './EditSettingsModal';

class SettingsGeneric extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.settingsStore;
    this.entityStore.setFilter({ category: 'generic' });
  }

  render() {
    return (
      <ListPage
        name="Generic Settings"
        entityStore={this.entityStore}
        ItemsListComponent={SettingsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

SettingsGeneric.propTypes = {
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('settingsStore'), observer);

export default enhance(SettingsGeneric);
