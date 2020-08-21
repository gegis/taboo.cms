import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'rsuite';

import CreateModal from './CreateUploadModal';
import EditModal from './EditUploadModal';
import ListPage from 'modules/core/ui/components/admin/ListPage';
import UploadsList from './UploadsList';
import AdminHelper from 'modules/core/ui/helpers/AdminHelper';

const { dateFormat } = window.app.config;

class Uploads extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.uploadsStore;
    this.uiAdminStore = props.uiAdminStore;
    this.entityStore.setFilter(null);
    this.filterByDateRange = this.filterByDateRange.bind(this);
  }

  filterByDateRange(dates) {
    const { search = '' } = this.entityStore;
    const filter = AdminHelper.getCreatedAtFilterForStore(this.entityStore, dates);
    this.uiAdminStore.setLoading(true);
    this.entityStore.loadAll({ search, filter: filter }).then(() => {
      this.uiAdminStore.setLoading(false);
    });
  }

  getActionButtons() {
    const buttons = [];
    buttons.push(
      <DateRangePicker
        key="date-range-filter"
        isoWeek={true}
        placement="bottomEnd"
        appearance="default"
        placeholder="Filter by Date Created"
        style={{ width: 230 }}
        format={dateFormat}
        onChange={this.filterByDateRange}
      />
    );
    return buttons;
  }

  render() {
    return (
      <ListPage
        name="Uploads"
        entityStore={this.entityStore}
        pageActionCreateTitle="Upload"
        ItemsListComponent={UploadsList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
        pageActionButtons={this.getActionButtons()}
      />
    );
  }
}

Uploads.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('uploadsStore', 'uiAdminStore'), observer);

export default enhance(Uploads);
