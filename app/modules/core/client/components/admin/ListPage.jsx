import React from 'react';
import { Form, FormGroup, FormControl, Panel, IconButton, Icon, Button } from 'rsuite';
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
    this.uiAdminStore = props.uiAdminStore;
    this.createModal = React.createRef();
    this.editModal = React.createRef();
    this.searchTimeout = null;
    this.state = {
      search: '',
    };
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
    this.setState({ search: value });
    this.searchTimeout = setTimeout(() => {
      this.uiAdminStore.setLoading(true);
      this.entityStore.loadAll({ search: this.state.search }).then(() => {
        this.uiAdminStore.setLoading(false);
      });
    }, 500);
  }

  getHeaderNav() {
    const { search } = this.state;
    const { name } = this.props;
    return (
      <Form layout="inline">
        <FormGroup>
          <FormControl
            name={name}
            placeholder={`Search ${name}`}
            style={{ width: '40vw' }}
            onChange={this.onSearchChange}
            value={search}
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
        <CreateModalComponent ref={this.createModal} />
        <EditModalComponent ref={this.editModal} />
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
  CreateModalComponent: PropTypes.object.isRequired,
  EditModalComponent: PropTypes.object.isRequired,
  ItemsListComponent: PropTypes.object.isRequired,
};

const enhance = compose(inject('localeStore', 'notificationsStore', 'uiAdminStore'), observer);

export default enhance(ListPage);
