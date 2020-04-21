import React from 'react';
import { Form, FormGroup, Panel, IconButton, Icon, Button, InputGroup, Input } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Layout from 'app/themes/admin/client/components/Layout';
import Translation from 'app/modules/core/client/components/Translation';

class ListPage extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.entityStore;
    this.localeStore = props.localeStore;
    this.notificationsStore = props.notificationsStore;
    this.uiAdminStore = props.uiAdminStore;
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
    this.onClearSearch = this.onClearSearch.bind(this);
  }

  componentDidMount() {
    this.entityStore.setSearch('');
    this.entityStore.loadAll();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.entityStore.setSearch(value);
    this.searchTimeout = setTimeout(() => {
      this.uiAdminStore.setLoading(true);
      const { search = '' } = this.entityStore;
      this.entityStore.loadAll({ search }).then(() => {
        this.uiAdminStore.setLoading(false);
      });
    }, 500);
  }

  onClearSearch() {
    const value = '';
    this.entityStore.setSearch(value);
    this.uiAdminStore.setLoading(true);
    this.entityStore.loadAll({ value }).then(() => {
      this.uiAdminStore.setLoading(false);
    });
  }

  getHeaderNav() {
    const { search } = this.entityStore;
    const { name } = this.props;
    return (
      <Form layout="inline">
        <FormGroup>
          <InputGroup inside>
            <Input
              name={name}
              placeholder={`Search ${name}`}
              style={{ width: '40vw' }}
              onChange={this.onSearchChange}
              value={search}
            />
            <InputGroup.Button onClick={this.onClearSearch}>
              <Icon icon="times-circle" />
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Form>
    );
  }

  getPageActions() {
    const { current: createModal = null } = this.createModal;
    const { pageActionButtons = [] } = this.props;
    if (createModal) {
      pageActionButtons.push(
        <IconButton key="add-btn" icon={<Icon icon="file" />} appearance="primary" onClick={this.openCreateModal}>
          <Translation message="Create New" />
        </IconButton>
      );
    }
    return pageActionButtons;
  }

  openCreateModal() {
    const { current } = this.createModal;
    if (current) {
      current.open();
    }
  }

  openEditModal(id) {
    const { current } = this.editModal;
    if (current) {
      current.open(id);
    }
  }

  handleDelete(id) {
    this.entityStore.deleteById(id).then(() => {
      this.notificationsStore.push({
        title: 'Success',
        message: 'Successfully deleted',
        translate: true,
      });
    });
  }

  handleCopy() {
    this.notificationsStore.push({
      title: 'Success',
      message: 'Successfully copied',
      translate: true,
    });
  }

  handleSort(field, direction) {
    this.entityStore.sort(field, direction);
  }

  onLoadMore() {
    this.uiAdminStore.setLoading(true);
    this.entityStore.loadNextPage().then(() => {
      this.uiAdminStore.setLoading(false);
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
        {CreateModalComponent && <CreateModalComponent ref={this.createModal} />}
        {EditModalComponent && <EditModalComponent ref={this.editModal} />}
      </Layout>
    );
  }
}

ListPage.propTypes = {
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
  entityStore: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  CreateModalComponent: PropTypes.object,
  EditModalComponent: PropTypes.object,
  pageActionButtons: PropTypes.array,
  ItemsListComponent: PropTypes.object.isRequired,
};

const enhance = compose(inject('localeStore', 'notificationsStore', 'uiAdminStore'), observer);

export default enhance(ListPage);
