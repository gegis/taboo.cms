import React from 'react';
import { Form, FormGroup, FormControl, Panel, IconButton, Icon, Notification, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Layout from 'modules/core/client/components/admin/Layout';
import Translation from 'app/modules/core/client/components/Translation';

class ListPage extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.entityStore;
    this.localeStore = props.localeStore;
    this.notificationsStore = props.notificationsStore;
    this.settingsStore = props.settingsStore;
    this.createModal = React.createRef();
    this.editModal = React.createRef();
    this.searchTimeout = null;
    this.openCreateModal = this.openCreateModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidMount() {
    this.entityStore.loadAll();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.settingsStore.setLoading(true);
      this.entityStore.loadAll({ search: value }).then(() => {
        this.settingsStore.setLoading(false);
      });
    }, 700);
  }

  getHeaderNav() {
    const { name } = this.props;
    return (
      <Form layout="inline">
        <FormGroup>
          <FormControl
            name={name}
            placeholder={`Search ${name}`}
            style={{ width: '40vw' }}
            onChange={this.onSearchChange}
            value={this.entityStore.search}
          />
        </FormGroup>
      </Form>
    );
  }

  getPageActions() {
    return (
      <IconButton icon={<Icon icon="file" />} appearance="primary" onClick={this.openCreateModal}>
        <Translation message="Create New" />
      </IconButton>
    );
  }

  openCreateModal() {
    const { wrappedInstance } = this.createModal.current;
    if (wrappedInstance) {
      wrappedInstance.open();
    }
  }

  openEditModal(id) {
    const { wrappedInstance } = this.editModal.current;
    if (wrappedInstance) {
      wrappedInstance.open(id);
    }
  }

  handleDelete(id) {
    this.entityStore.deleteById(id).then(() => {
      Notification.open({
        title: 'Message',
        description: this.localeStore.getTranslation('Successfully deleted'),
        duration: 5000,
      });
    });
  }

  handleCopy() {
    this.notificationsStore.push({
      title: this.localeStore.getTranslation('Success'),
      message: this.localeStore.getTranslation('Successfully copied'),
    });
  }

  handleSort(field, direction) {
    this.entityStore.sort(field, direction);
  }

  onLoadMore() {
    this.settingsStore.setLoading(true);
    this.entityStore.loadNextPage().then(() => {
      this.settingsStore.setLoading(false);
    });
  }

  getLoadMoreButton() {
    return (
      <div className="load-more-wrapper">
        <Button appearance="primary" onClick={this.onLoadMore}>
          <Translation message="Load More" />
          ...
        </Button>
      </div>
    );
  }

  render() {
    const { name, CreateModalComponent, EditModalComponent, ItemsListComponent } = this.props;
    return (
      <Layout
        className={name.toLowerCase()}
        headerNav={this.getHeaderNav()}
        pageTitle={name}
        pageActions={this.getPageActions()}
      >
        <Panel className="shadow">
          {this.entityStore.items.length > 0 && (
            <ItemsListComponent
              openEditModal={this.openEditModal}
              handleDelete={this.handleDelete}
              handleCopy={this.handleCopy}
            />
          )}
          {this.entityStore.items.length > 0 && this.entityStore.hasMoreResults && this.getLoadMoreButton()}
          {this.entityStore.items.length === 0 && (
            <div className="">
              <Translation message="No results found" />
            </div>
          )}
        </Panel>
        <CreateModalComponent ref={this.createModal} />
        <EditModalComponent ref={this.editModal} />
      </Layout>
    );
  }
}

ListPage.propTypes = {
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  settingsStore: PropTypes.object.isRequired,
  entityStore: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  CreateModalComponent: PropTypes.func.isRequired,
  EditModalComponent: PropTypes.func.isRequired,
  ItemsListComponent: PropTypes.func.isRequired,
};

const enhance = compose(
  inject('localeStore', 'notificationsStore', 'settingsStore'),
  observer
);

export default enhance(ListPage);
