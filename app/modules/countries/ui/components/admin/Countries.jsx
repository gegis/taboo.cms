import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import CountriesList from './CountriesList';
import CreateModal from './CreateCountryModal';
import EditModal from './EditCountryModal';

class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.countriesAdminStore;
  }

  render() {
    return (
      <ListPage
        name="Countries"
        entityStore={this.entityStore}
        ItemsListComponent={CountriesList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Countries.propTypes = {
  countriesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('countriesAdminStore'), observer);

export default enhance(Countries);
