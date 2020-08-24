import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ListPage from 'modules/core/ui/components/admin/ListPage';
import SettingsList from './SettingsList';
import CreateModal from './CreateSettingsModal';
import EditModal from './EditSettingsModal';
import StringHelper from 'modules/core/ui/helpers/StringHelper';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params: { category = 'generic' } = {} } = {} } = props;
    this.state = { category };
    this.entityStore = props.settingsAdminStore;
    this.entityStore.setFilter({ category });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match: { params: { category = 'generic' } = {} } = {} } = nextProps;
    if (category !== prevState.category) {
      nextProps.settingsAdminStore.setFilter({ category });
      nextProps.settingsAdminStore.loadAll();
      return { category };
    }
    return null;
  }

  getName() {
    const { match: { params: { category = 'generic' } = {} } = {} } = this.props;
    return `${StringHelper.firstUpper(category)} Settings`;
  }

  render() {
    return (
      <ListPage
        name={this.getName()}
        entityStore={this.entityStore}
        ItemsListComponent={SettingsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Settings.propTypes = {
  match: PropTypes.object,
  settingsAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('settingsAdminStore'), observer);

export default enhance(Settings);
