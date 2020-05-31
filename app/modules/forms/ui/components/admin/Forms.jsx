import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import FormsList from './FormsList';
import CreateModal from './CreateFormModal';
import EditModal from './EditFormModal';

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.formsAdminStore;
  }

  render() {
    return (
      <ListPage
        name="Forms"
        entityStore={this.entityStore}
        ItemsListComponent={FormsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Forms.propTypes = {
  formsAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('formsAdminStore'), observer);

export default enhance(Forms);
