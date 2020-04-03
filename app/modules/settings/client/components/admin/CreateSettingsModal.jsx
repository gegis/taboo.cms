import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';

import SettingsForm from './SettingsForm';

class CreateSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.settingsStore = props.settingsStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.settingsStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.settingsStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.settingsStore;
    this.settingsStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.settingsStore.resetItem();
      this.settingsStore.loadAll();
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
        title="Create New Settings"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <SettingsForm />
      </Modal>
    );
  }
}

CreateSettingsModal.propTypes = {
  settingsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('settingsStore', 'notificationsStore'), observer);

export default enhance(CreateSettingsModal);
