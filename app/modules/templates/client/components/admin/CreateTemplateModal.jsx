import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';

import TemplateForm from './TemplateForm';

class CreateTemplateModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.templatesStore = props.templatesStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.templatesStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.templatesStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.templatesStore;
    this.templatesStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.templatesStore.resetItem();
      this.templatesStore.loadAll();
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
        title="Create New Template"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <TemplateForm />
      </Modal>
    );
  }
}

CreateTemplateModal.propTypes = {
  templatesStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesStore', 'notificationsStore'), observer);

export default enhance(CreateTemplateModal);
