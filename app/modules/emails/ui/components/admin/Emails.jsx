import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import EmailsList from './EmailsList';
import CreateModal from './CreateEmailModal';
import EditModal from './EditEmailModal';

class Emails extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.emailsAdminStore;
  }

  render() {
    return (
      <ListPage
        name="Emails"
        entityStore={this.entityStore}
        ItemsListComponent={EmailsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Emails.propTypes = {
  emailsAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('emailsAdminStore'), observer);

export default enhance(Emails);
