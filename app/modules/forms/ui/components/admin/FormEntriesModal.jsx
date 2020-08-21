import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import StringHelper from 'modules/core/ui/helpers/StringHelper';
import DateTime from 'modules/core/ui/components/DateTime';

class FormEntriesModal extends React.Component {
  constructor(props) {
    super(props);
    this.formsAdminStore = props.formsAdminStore;
    this.modal = React.createRef();
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.modal.current.open();
  }

  close() {
    this.formsAdminStore.resetEntries();
    this.modal.current.close();
  }

  render() {
    const { entries } = this.formsAdminStore;
    return (
      <Modal full keyboard={false} backdrop="static" className="use-max-width" title="Form Records" ref={this.modal}>
        {entries.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(entries[0].data).map(key => (
                  <th key={key}>{StringHelper.firstUpper(key)}</th>
                ))}
                <th>Create At</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry._id}>
                  {Object.keys(entry.data).map(key => (
                    <td key={key}>{entry.data[key]}</td>
                  ))}
                  <td>
                    <DateTime value={entry.createdAt} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    );
  }
}

FormEntriesModal.propTypes = {
  formsAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('formsAdminStore', 'notificationsStore'), observer);

export default enhance(FormEntriesModal);
