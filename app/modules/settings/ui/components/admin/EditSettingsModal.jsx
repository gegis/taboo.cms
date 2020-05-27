import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import SettingsForm from './SettingsForm';

class EditSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.settingsStore = props.settingsStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.settingsStore.resetItem();
    this.settingsStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.settingsStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.settingsStore;
    this.settingsStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data.key },
        translate: true,
      });
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        className="use-max-width"
        title="Edit Settings"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <SettingsForm />
      </Modal>
    );
  }
}

EditSettingsModal.propTypes = {
  settingsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('settingsStore', 'notificationsStore'), observer);

export default enhance(EditSettingsModal);
