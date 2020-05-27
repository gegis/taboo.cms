import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import TemplatesList from './TemplatesList';
import EditDrawer from './EditTemplateDrawer';

class Templates extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.templatesAdminStore;
  }

  render() {
    return (
      <ListPage
        name="Templates"
        entityStore={this.entityStore}
        ItemsListComponent={TemplatesList}
        EditModalComponent={EditDrawer}
      />
    );
  }
}

Templates.propTypes = {
  templatesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesAdminStore'), observer);

export default enhance(Templates);
