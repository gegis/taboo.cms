import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { html as htmlBeautify } from 'js-beautify';

import Modal from 'app/modules/core/client/components/admin/Modal';

import PageForm from './PageForm';

class CreatePageModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.pagesStore = props.pagesStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.pagesStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.pagesStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.pagesStore;
    const page = Object.assign({}, item);
    page.body = htmlBeautify(page.body);
    this.pagesStore.create(page).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data.title },
        translate: true,
      });
      this.pagesStore.resetItem();
      this.pagesStore.loadAll();
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
        title="Create New Page"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <PageForm />
      </Modal>
    );
  }
}

CreatePageModal.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesStore', 'notificationsStore'), observer);

export default enhance(CreatePageModal);
