import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import LogsApiList from './LogsApiList';

class LogsApi extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.logsApiStore;
  }

  render() {
    return <ListPage name="API Logs" entityStore={this.entityStore} ItemsListComponent={LogsApiList} />;
  }
}

LogsApi.propTypes = {
  logsApiStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('logsApiStore'), observer);

export default enhance(LogsApi);
