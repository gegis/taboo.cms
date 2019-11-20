import React from 'react';
import { Form, FormGroup, FormControl, Panel, IconButton, Icon, Notification, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Layout from 'modules/core/client/components/admin/Layout';
import Translation from 'app/modules/core/client/components/Translation';
import CreatePage from './CreatePage';
import EditPage from './EditPage';
import RichTextModal from './RichTextModal';
import BooleanIcon from 'app/modules/core/client/components/admin/BooleanIcon';
import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';

class Pages extends React.Component {
  constructor(props) {
    super(props);
    this.pagesStore = props.pagesStore;
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
    this.pagesStore.loadAll();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.settingsStore.setLoading(true);
      this.pagesStore.loadAll({ search: value }).then(() => {
        this.settingsStore.setLoading(false);
      });
    }, 700);
  }

  getHeaderNav() {
    return (
      <Form layout="inline">
        <FormGroup>
          <FormControl
            name="page"
            placeholder="Search Pages"
            style={{ width: '40vw' }}
            onChange={this.onSearchChange}
            value={this.pagesStore.search}
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
    this.pagesStore.deleteById(id).then(() => {
      Notification.open({
        title: 'Message',
        description: this.localeStore.getTranslation('Successfully deleted'),
        duration: 5000,
      });
    });
  }

  handleSort(field, direction) {
    this.pagesStore.sortPages(field, direction);
  }

  handleCopy() {
    this.notificationsStore.push({
      title: this.localeStore.getTranslation('Success'),
      message: this.localeStore.getTranslation('Successfully copied'),
    });
  }

  getPageCopyValue(item) {
    let escapedUrl = item.url.replace(/\//, '');
    if (!escapedUrl) {
      escapedUrl = 'home';
    }
    escapedUrl = escapedUrl.replace(/\//g, '-');
    return `<section class="section-${escapedUrl}">\n\t<a id="section-${escapedUrl}" class="anchor"></a>\n\t<h1>${
      item.title
    }</h1>\n\t{{Page:${item._id}}}\n</section>`;
  }

  onLoadMore() {
    this.settingsStore.setLoading(true);
    this.pagesStore.loadNextPage().then(() => {
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
      <Layout className="pages" headerNav={this.getHeaderNav()} pageTitle="Pages" pageActions={this.getPageActions()}>
        <Panel className="shadow">
          {this.pagesStore.pages.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th className="rs-hidden-xs">ID</th>
                  <th>Title</th>
                  <th className="rs-hidden-sm rs-hidden-xs">URL</th>
                  <th className="rs-hidden-xs">Language</th>
                  <th className="rs-hidden-xs">Published</th>
                  <th className="action-buttons-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.pagesStore.pages.map(item => (
                  <tr key={item._id}>
                    <td className="id rs-hidden-xs">{item._id}</td>
                    <td className="mobile-view-td">
                      <div>{item.title}</div>
                      <div className="rs-visible-xs">
                        <a href={item.url}>{item.url}</a>
                      </div>
                      <div className="rs-visible-xs">
                        <span className="subject md">
                          <Translation message="Language" />:
                        </span>{' '}
                        {item.language}
                      </div>
                      <div className="rs-visible-xs subject sm">{item._id}</div>
                    </td>
                    <td className="rs-hidden-sm rs-hidden-xs">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.url}
                      </a>
                    </td>
                    <td className="rs-hidden-xs">{item.language}</td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.published} />
                    </td>
                    <td>
                      <ActionButtons
                        value={item._id}
                        onEdit={this.openEdit}
                        onDelete={this.handleDelete}
                        copyValue={this.getPageCopyValue(item)}
                        onCopy={this.handleCopy}
                        copyTitle="Copy page value as section snippet"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {this.pagesStore.pages.length > 0 && this.pagesStore.hasMoreResults && this.getLoadMoreButton()}
          {this.pagesStore.pages.length === 0 && (
            <div className="">
              <Translation message="No results found" />
            </div>
          )}
        </Panel>
        <CreatePage ref={this.createModal} />
        <EditPage ref={this.editModal} />
        <RichTextModal />
      </Layout>
    );
  }
}

Pages.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('pagesStore', 'localeStore', 'notificationsStore', 'settingsStore'),
  observer
);

export default enhance(Pages);
