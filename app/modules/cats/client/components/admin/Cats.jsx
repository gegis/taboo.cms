import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import CatsList from './CatsList';
import CreateModal from './CreateCatModal';
import EditModal from './EditCatModal';

class Cats extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.catsStore;
  }

  render() {
    return (
      <ListPage
        name="Cats"
        entityStore={this.entityStore}
        ItemsListComponent={CatsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Cats.propTypes = {
  catsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('catsStore'), observer);

export default enhance(Cats);
