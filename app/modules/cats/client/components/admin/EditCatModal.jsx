import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';
import CatForm from './CatForm';

class EditCatModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.catsStore = props.catsStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.catsStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.catsStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.catsStore;
    this.catsStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data._id },
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
        title="Edit Cat"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <CatForm />
      </Modal>
    );
  }
}

EditCatModal.propTypes = {
  catsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('catsStore', 'notificationsStore'), observer);

export default enhance(EditCatModal);
