import React from 'react';
import { compose } from 'recompose';
import { Icon, DateRangePicker } from 'rsuite';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import UsersList from './UsersList';
import CreateModal from './CreateUserModal';
import EditModal from './EditUserModal';
import Filter from 'modules/core/ui/components/admin/Filter';
import AdminHelper from 'modules/core/ui/helpers/AdminHelper';

const { dateFormat } = window.app.config;

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.usersStore;
    this.uiAdminStore = props.uiAdminStore;
    this.filter = this.filter.bind(this);
    this.filterByDateRange = this.filterByDateRange.bind(this);
  }

  filter(property, value) {
    const { filter = {}, search = '' } = this.entityStore;
    let usersFilter = {};
    if (filter) {
      usersFilter = Object.assign({}, filter);
    }
    if (value !== null && value !== 'undefined') {
      usersFilter[property] = value;
    } else if (Object.keys(usersFilter).indexOf(property) !== -1) {
      delete usersFilter[property];
    }
    this.entityStore.loadAll({ search, filter: usersFilter });
  }

  filterByDateRange(dates) {
    const { search = '' } = this.entityStore;
    const filter = AdminHelper.getCreatedAtFilterForStore(this.entityStore, dates);
    this.uiAdminStore.setLoading(true);
    this.entityStore.loadAll({ search, filter: filter }).then(() => {
      this.uiAdminStore.setLoading(false);
    });
  }

  getFilterQuery() {
    const filter = this.entityStore.filter || {};
    let query = '';
    if (filter && Object.keys(filter).length > 0) {
      query = `?filter=${JSON.stringify(filter)}`;
    }
    return query;
  }

  getPageActionButtons() {
    const filter = this.entityStore.filter || {};
    const { verified = null, agreeToRewards = null } = filter;
    const buttons = [];
    buttons.push(
      <DateRangePicker
        key="date-range-filter"
        isoWeek={true}
        placement="bottomStart"
        appearance="default"
        placeholder="Filter by Date Created"
        style={{ width: 230 }}
        format={dateFormat}
        onChange={this.filterByDateRange}
      />,
      <Filter
        key="verified-filter"
        title="Filter Verified"
        filterKey="verified"
        options={[
          { label: 'Verified', value: true },
          { label: 'Not Verified', value: false },
        ]}
        onChange={this.filter}
        value={verified}
      />
    );
    buttons.push(
      <Filter
        key="subscribed-filter"
        title="Filter Subscribed"
        filterKey="agreeToRewards"
        options={[
          { label: 'Subscribed', value: true },
          { label: 'Not Subscribed', value: false },
        ]}
        onChange={this.filter}
        value={agreeToRewards}
      />
    );
    buttons.push(
      <a
        className="rs-btn rs-btn-default rs-btn-icon rs-btn-icon-placement-left rs-btn-icon-with-text"
        href={`/api/admin/users/export${this.getFilterQuery()}`}
        key="export-all"
      >
        <Icon icon="share-square-o" /> Export Users
      </a>
    );
    return buttons;
  }

  getPageSubtitle() {
    const { total = '' } = this.entityStore;
    return (
      <div style={{ textAlign: 'right' }}>
        <b>Total: {total}</b>
      </div>
    );
  }

  render() {
    return (
      <ListPage
        name="Users"
        subtitle={this.getPageSubtitle()}
        entityStore={this.entityStore}
        ItemsListComponent={UsersList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
        pageActionButtons={this.getPageActionButtons()}
      />
    );
  }
}

Users.propTypes = {
  usersStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('usersStore', 'uiAdminStore'), observer);

export default enhance(Users);
