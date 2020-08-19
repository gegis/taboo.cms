import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import CountryForm from './CountryForm';

class EditCountryModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.countriesAdminStore = props.countriesAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.countriesAdminStore.resetItem();
    this.countriesAdminStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.countriesAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.countriesAdminStore;
    this.countriesAdminStore.update(item).then(data => {
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
        title="Edit Country"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <CountryForm />
      </Modal>
    );
  }
}

EditCountryModal.propTypes = {
  countriesAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('countriesAdminStore', 'notificationsStore'), observer);

export default enhance(EditCountryModal);
