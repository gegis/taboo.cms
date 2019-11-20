import React from 'react';
import { Button, Notification } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { html as htmlBeautify } from 'js-beautify';

import Modal from 'app/modules/core/client/components/admin/Modal';
import PageForm from './PageForm';
import Translation from 'app/modules/core/client/components/Translation';

class EditPage extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.pagesStore = props.pagesStore;
    this.localeStore = props.localeStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
    this.loadPreviousVersion = this.loadPreviousVersion.bind(this);
  }

  open(id) {
    this.pagesStore.loadOne(id);
    this.modal.current.open();
  }

  close() {
    this.pagesStore.resetPage();
    this.modal.current.close();
  }

  getSuccessMessage(data) {
    return {
      __html: this.localeStore.getTranslation('Successfully updated {item}', { item: data.title }),
    };
  }

  onSave() {
    const page = Object.assign({}, this.pagesStore.page);
    page.body = htmlBeautify(page.body);
    this.pagesStore.updatePage(page).then(() => {
      Notification.open({
        title: 'Message',
        description: <span dangerouslySetInnerHTML={this.getSuccessMessage(page)} />,
        duration: 5000,
      });
      this.close();
    });
  }

  loadPreviousVersion() {
    this.pagesStore.loadPreviousVersion();
  }

  getCustomButton() {
    return (
      <Button appearance="ghost" onClick={this.loadPreviousVersion}>
        <Translation message="Restore Previous Version" />
      </Button>
    );
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        className="use-max-width"
        title="Edit Page"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
        customButtons={this.getCustomButton()}
      >
        <PageForm />
      </Modal>
    );
  }
}

EditPage.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('pagesStore', 'localeStore'),
  observer
);

export default enhance(EditPage);
