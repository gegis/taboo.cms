import React from 'react';
import { Notification } from 'rsuite';
import axios from 'axios';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { html as htmlBeautify } from 'js-beautify';

import Modal from 'app/modules/core/client/components/admin/Modal';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

import PageForm from './PageForm';

class CreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.pagesStore = props.pagesStore;
    this.localeStore = props.localeStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.pagesStore.resetPage();
    this.modal.current.open();
  }

  close() {
    this.pagesStore.resetPage();
    this.modal.current.close();
  }

  getSuccessMessage(data) {
    return {
      __html: this.localeStore.getTranslation('Successfully created {item}', { item: data.title }),
    };
  }

  onSave() {
    const page = Object.assign({}, this.pagesStore.page);
    page.body = htmlBeautify(page.body);
    axios
      .post('/api/admin/pages', page)
      .then(response => {
        if (response && response.data) {
          Notification.open({
            title: 'Message',
            description: <span dangerouslySetInnerHTML={this.getSuccessMessage(this.pagesStore.page)} />,
            duration: 5000,
          });
          this.pagesStore.resetPage();
          this.pagesStore.loadAll();
          this.close();
        }
      })
      .catch(ResponseHelper.handleError);
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

CreatePage.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('pagesStore', 'localeStore'),
  observer
);

export default enhance(CreatePage);
