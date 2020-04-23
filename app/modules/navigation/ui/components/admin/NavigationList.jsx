import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';
import Translation from 'modules/core/ui/components/Translation';

class NavigationList extends React.Component {
  constructor(props) {
    super(props);
    this.navigationStore = props.navigationStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getCopyValue(item) {
    return item.name;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th className="rs-hidden-sm">Name</th>
            <th className="rs-hidden-sm">Language</th>
            <th className="rs-hidden-sm">Enabled</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.navigationStore.items.map(item => (
            <tr key={item._id}>
              <td>
                <div>{item.title}</div>
                <div className="rs-visible-sm">
                  <span className="subject md">
                    <Translation message="Name" />:
                  </span>{' '}
                  {item.name}
                </div>
                <div className="rs-visible-sm">
                  <span className="subject md">
                    <Translation message="Language" />:
                  </span>{' '}
                  {item.language}
                </div>
                <div className="rs-visible-sm">
                  <span className="subject md">
                    <Translation message="Enabled" />:
                  </span>{' '}
                  <BooleanIcon value={item.enabled} />
                </div>
              </td>
              <td className="rs-hidden-sm">{item.name}</td>
              <td className="rs-hidden-sm">{item.language}</td>
              <td className="rs-hidden-sm">
                <BooleanIcon value={item.enabled} />
              </td>
              <td>
                <ActionButtons
                  value={item._id}
                  onEdit={this.openEditModal}
                  onDelete={this.handleDelete}
                  copyValue={this.getCopyValue(item)}
                  onCopy={this.handleCopy}
                  copyTitle="Copy value"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

NavigationList.propTypes = {
  navigationStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('navigationStore'), observer);

export default enhance(NavigationList);
