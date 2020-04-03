import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import SettingsList from './SettingsList';
import CreateModal from './CreateSettingsModal';
import EditModal from './EditSettingsModal';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.settingsStore;
  }

  render() {
    return (
      <ListPage
        name="Settings"
        entityStore={this.entityStore}
        ItemsListComponent={SettingsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Settings.propTypes = {
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('settingsStore'), observer);

export default enhance(Settings);
