import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import Translation from 'modules/core/ui/components/Translation';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';

class PagesList extends React.Component {
  constructor(props) {
    super(props);
    this.pagesStore = props.pagesStore;
    this.templatesAdminStore = props.templatesAdminStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  componentDidMount() {
    this.templatesAdminStore.loadAll();
  }

  getCopyValue(item) {
    let escapedUrl = item.url.replace(/\//, '');
    let anchor;
    if (!escapedUrl) {
      escapedUrl = 'home';
    }
    escapedUrl = escapedUrl.replace(/\//g, '-');
    anchor = `<a id="section-${escapedUrl}" className="anchor"></a>`;
    return `<section class="section-${escapedUrl}">\n\t${anchor}\n\t{{Page:${item._id}}}\n</section>`;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-sm">ID</th>
            <th>Title</th>
            <th className="rs-hidden-sm">URL</th>
            <th className="rs-hidden-sm">Language</th>
            <th className="rs-hidden-sm">Published</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.pagesStore.items.map(item => (
            <tr key={item._id}>
              <td className="id rs-hidden-sm">{item._id}</td>
              <td className="mobile-view-td">
                <div>{item.title}</div>
                <div className="rs-visible-sm">
                  <a href={item.url}>{item.url}</a>
                </div>
                <div className="rs-visible-sm">
                  <span className="subject md">
                    <Translation message="Language" />:
                  </span>{' '}
                  {item.language}
                </div>
                <div className="rs-visible-sm subject sm">{item._id}</div>
              </td>
              <td className="rs-hidden-sm">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              </td>
              <td className="rs-hidden-sm">{item.language}</td>
              <td className="rs-hidden-sm">
                <BooleanIcon value={item.published} />
              </td>
              <td>
                <ActionButtons
                  value={item._id}
                  onEdit={this.openEditModal}
                  onDelete={this.handleDelete}
                  copyValue={this.getCopyValue(item)}
                  onCopy={this.handleCopy}
                  copyTitle="Copy page value as section snippet"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

PagesList.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  templatesAdminStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('pagesStore', 'templatesAdminStore'), observer);

export default enhance(PagesList);
