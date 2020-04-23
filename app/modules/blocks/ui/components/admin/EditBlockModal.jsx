import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import BlockForm from './BlockForm';

class EditBlockModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.blocksStore = props.blocksStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.blocksStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.blocksStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.blocksStore;
    this.blocksStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data.name },
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
        title="Edit Block"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <BlockForm />
      </Modal>
    );
  }
}

EditBlockModal.propTypes = {
  blocksStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('blocksStore', 'notificationsStore'), observer);

export default enhance(EditBlockModal);
