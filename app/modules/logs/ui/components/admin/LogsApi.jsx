import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import LogsApiList from './LogsApiList';

class LogsApi extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.logsApiAdminStore;
  }

  render() {
    return <ListPage name="API Logs" entityStore={this.entityStore} ItemsListComponent={LogsApiList} />;
  }
}

LogsApi.propTypes = {
  logsApiAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('logsApiAdminStore'), observer);

export default enhance(LogsApi);
