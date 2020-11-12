import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import NavigationList from './NavigationList';
import CreateModal from './CreateNavigationModal';
import EditModal from './EditNavigationModal';
import ListPage from 'modules/core/ui/components/admin/ListPage';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.navigationAdminStore;
    this.createModal = React.createRef();
    this.editModal = React.createRef();
  }

  render() {
    return (
      <ListPage
        name="Navigation"
        entityStore={this.entityStore}
        ItemsListComponent={NavigationList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Navigation.propTypes = {
  navigationAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationAdminStore'), observer);

export default enhance(Navigation);
