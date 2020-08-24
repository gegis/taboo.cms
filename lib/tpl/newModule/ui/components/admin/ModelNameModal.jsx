import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import ModelNameForm from './ModelNameForm';

class ModelNameModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.moduleNameAdminStore = props.moduleNameAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id = null) {
    this.moduleNameAdminStore.resetItem();
    if (id) {
      this.moduleNameAdminStore.loadById(id).then(() => {
        this.modal.current.open();
      });
    } else {
      this.modal.current.open();
    }
  }

  close() {
    this.moduleNameAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.moduleNameAdminStore;
    if (item.id || item._id) {
      this.moduleNameAdminStore.update(item).then(data => {
        this.notificationsStore.push({
          title: 'Success',
          html: 'Successfully updated {item}',
          translationVars: { item: data.name },
          translate: true,
        });
        this.moduleNameAdminStore.resetItem();
        this.close();
      });
    } else {
      this.moduleNameAdminStore.create(item).then(data => {
        this.notificationsStore.push({
          title: 'Success',
          html: 'Successfully created {item}',
          translationVars: { item: data.name },
          translate: true,
        });
        this.moduleNameAdminStore.resetItem();
        this.moduleNameAdminStore.loadAll();
        this.close();
      });
    }
  }

  getTitle() {
    const { item } = this.moduleNameAdminStore;
    if (item.id || item._id) {
      return 'Edit ModelName';
    }
    return 'Create New ModelName';
  }

  getSubmitName() {
    const { item } = this.moduleNameAdminStore;
    if (item.id || item._id) {
      return 'Update';
    }
    return 'Create';
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        className="use-max-width"
        title={this.getTitle()}
        ref={this.modal}
        onSubmit={this.onSave}
        submitName={this.getSubmitName()}
      >
        <ModelNameForm />
      </Modal>
    );
  }
}

ModelNameModal.propTypes = {
  moduleNameAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('moduleNameAdminStore', 'notificationsStore'), observer);

export default enhance(ModelNameModal);
