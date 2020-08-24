import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import PagesList from './PagesList';
import CreateModal from './CreatePageModal';
import EditModal from './EditPageModal';

class Pages extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.pagesAdminStore;
    this.entityStore.setFilter(null);
  }

  render() {
    return (
      <ListPage
        name="Pages"
        entityStore={this.entityStore}
        ItemsListComponent={PagesList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Pages.propTypes = {
  pagesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesAdminStore'), observer);

export default enhance(Pages);
