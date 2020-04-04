import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import NavigationList from './NavigationList';
import CreateModal from './CreateNavigationModal';
import EditModal from './EditNavigationModal';
import StringHelper from 'modules/core/client/helpers/StringHelper';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params: { type = 'website' } = {} } = {} } = props;
    this.state = { type };
    this.entityStore = props.navigationStore;
    this.entityStore.setFilter({ type });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match: { params: { type = 'website' } = {} } = {} } = nextProps;
    if (type !== prevState.type) {
      nextProps.navigationStore.setFilter({ type });
      nextProps.navigationStore.loadAll();
      return { type };
    }
    return null;
  }

  getName() {
    const { match: { params: { type = 'website' } = {} } = {} } = this.props;
    return `${StringHelper.firstUpper(type)} Navigation`;
  }

  render() {
    return (
      <ListPage
        name={this.getName()}
        entityStore={this.entityStore}
        ItemsListComponent={NavigationList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Navigation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  navigationStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationStore'), observer);

export default enhance(Navigation);
