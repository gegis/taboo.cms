import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import NavigationList from './NavigationList';
import CreateModal from './CreateNavigationModal';
import EditModal from './EditNavigationModal';

class UserNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.navigationStore;
    this.entityStore.setFilter({ type: 'user' });
  }

  render() {
    return (
      <ListPage
        name="User Navigation"
        entityStore={this.entityStore}
        ItemsListComponent={NavigationList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

UserNavigation.propTypes = {
  navigationStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationStore'), observer);

export default enhance(UserNavigation);
