import React from 'react';
import { Form, FormGroup, FormControl, Panel, IconButton, Icon, Notification, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Layout from 'modules/core/client/components/admin/Layout';
import Translation from 'app/modules/core/client/components/Translation';
import CreateGallery from './CreateGallery';
import EditGallery from './EditGallery';
import BooleanIcon from 'app/modules/core/client/components/admin/BooleanIcon';
import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';

class Galleries extends React.Component {
  constructor(props) {
    super(props);
    this.galleriesStore = props.galleriesStore;
    this.localeStore = props.localeStore;
    this.notificationsStore = props.notificationsStore;
    this.settingsStore = props.settingsStore;
    this.createModal = React.createRef();
    this.editModal = React.createRef();
    this.searchTimeout = null;
    this.openCreate = this.openCreate.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidMount() {
    this.galleriesStore.loadAll();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.settingsStore.setLoading(true);
      this.galleriesStore.loadAll({ search: value }).then(() => {
        this.settingsStore.setLoading(false);
      });
    }, 700);
  }

  getHeaderNav() {
    return (
      <Form layout="inline">
        <FormGroup>
          <FormControl
            name="gallery"
            placeholder="Search Galleries"
            style={{ width: '40vw' }}
            onChange={this.onSearchChange}
            value={this.galleriesStore.search}
          />
        </FormGroup>
      </Form>
    );
  }

  getPageActions() {
    return (
      <IconButton icon={<Icon icon="file" />} appearance="primary" onClick={this.openCreate}>
        <Translation message="Create New" />
      </IconButton>
    );
  }

  openCreate() {
    const { wrappedInstance } = this.createModal.current;
    if (wrappedInstance) {
      wrappedInstance.open();
    }
  }

  openEdit(id) {
    const { wrappedInstance } = this.editModal.current;
    if (wrappedInstance) {
      wrappedInstance.open(id);
    }
  }

  handleDelete(id) {
    this.galleriesStore.deleteById(id).then(() => {
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
    this.galleriesStore.sortGalleries(field, direction);
  }

  onLoadMore() {
    this.settingsStore.setLoading(true);
    this.galleriesStore.loadNextPage().then(() => {
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
    return (
      <Layout
        className="galleries"
        headerNav={this.getHeaderNav()}
        pageTitle="Galleries"
        pageActions={this.getPageActions()}
      >
        <Panel className="shadow">
          {this.galleriesStore.galleries.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th className="rs-hidden-xs">ID</th>
                  <th>Title</th>
                  <th className="rs-hidden-xs">Images</th>
                  <th className="rs-hidden-xs">Published</th>
                  <th className="action-buttons-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.galleriesStore.galleries.map(item => (
                  <tr key={item._id}>
                    <td className="id rs-hidden-xs">{item._id}</td>
                    <td className="mobile-view-td">
                      <div>{item.title}</div>
                      <div className="rs-visible-xs">
                        <span className="subject sm">
                          <Translation message="Images" />:
                        </span>{' '}
                        {item.images.length}
                      </div>
                      <div className="rs-visible-xs subject sm">{item._id}</div>
                    </td>
                    <td className="rs-hidden-xs">{item.images.length}</td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.published} />
                    </td>
                    <td>
                      <ActionButtons
                        value={item._id}
                        copyValue={`<section class="gallery inverted">\n<h1 class="text-center mb-5 first">${
                          item.title
                        }</h1>\n{{Gallery:${item._id}}}\n</section>`}
                        onEdit={this.openEdit}
                        onDelete={this.handleDelete}
                        onCopy={this.handleCopy}
                        copyTitle="Copy gallery value as snippet"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {this.galleriesStore.galleries.length > 0 && this.galleriesStore.hasMoreResults && this.getLoadMoreButton()}
          {this.galleriesStore.galleries.length === 0 && (
            <div className="">
              <Translation message="No results found" />
            </div>
          )}
        </Panel>
        <CreateGallery ref={this.createModal} />
        <EditGallery ref={this.editModal} />
      </Layout>
    );
  }
}

Galleries.propTypes = {
  galleriesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('galleriesStore', 'localeStore', 'notificationsStore', 'settingsStore'),
  observer
);

export default enhance(Galleries);
