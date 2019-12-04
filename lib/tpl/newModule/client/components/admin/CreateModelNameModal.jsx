import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';

import ModelNameForm from './ModelNameForm';

class CreateModelNameModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.moduleNameStore = props.moduleNameStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.moduleNameStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.moduleNameStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.moduleNameStore;
    this.moduleNameStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.moduleNameStore.resetItem();
      this.moduleNameStore.loadAll();
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
        title="Create New ModelName"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <ModelNameForm />
      </Modal>
    );
  }
}

CreateModelNameModal.propTypes = {
  moduleNameStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('moduleNameStore', 'notificationsStore'), observer);

export default enhance(CreateModelNameModal);
