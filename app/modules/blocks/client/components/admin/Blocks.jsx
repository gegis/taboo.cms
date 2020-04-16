import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import BlocksList from './BlocksList';
import CreateModal from './CreateBlockModal';
import EditModal from './EditBlockModal';

class Blocks extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.blocksStore;
  }

  render() {
    return (
      <ListPage
        name="Blocks"
        entityStore={this.entityStore}
        ItemsListComponent={BlocksList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Blocks.propTypes = {
  blocksStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('blocksStore'), observer);

export default enhance(Blocks);
