import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import TemplateForm from './TemplateForm';
import Drawer from 'modules/core/client/components/admin/Drawer';
import Translation from 'modules/core/client/components/Translation';

class EditTemplateDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.drawer = React.createRef();
    this.templatesStore = props.templatesStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.templatesStore.loadById(id).then(data => {
      this.drawer.current.open();
      setTimeout(() => {
        this.templatesStore.setPreviewPath(data.name);
      }, 150);
    });
  }

  close() {
    this.templatesStore.resetItem();
    this.templatesStore.unsetPreviewPath();
    this.drawer.current.close();
  }

  onSave() {
    const { item } = this.templatesStore;
    this.templatesStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data.title },
        translate: true,
      });
      this.close();
    });
  }

  getDrawerTitle() {
    const { item } = this.templatesStore;
    return <Translation message="{title} Template" values={{ title: item.title }} />;
  }

  getSettingsComponent() {
    const { item, settingsComponents } = this.templatesStore;
    if (item && item.name) {
      return settingsComponents[item.name];
    }
    return null;
  }

  render() {
    const { previewPath } = this.templatesStore;
    const Settings = this.getSettingsComponent();
    return (
      <Drawer
        full={true}
        keyboard={false}
        backdrop="static"
        title={this.getDrawerTitle()}
        ref={this.drawer}
        onSubmit={this.onSave}
        submitName="Update"
        className="template-edit-drawer"
      >
        <div className="template-edit">
          <div className="template-settings-wrapper">{Settings && <Settings />}</div>
          <div className="template-preview-wrapper">
            <div className="template-preview-body">
              <iframe className="template-preview-iframe" src={previewPath} />
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

EditTemplateDrawer.propTypes = {
  templatesStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesStore', 'notificationsStore'), observer);

export default enhance(EditTemplateDrawer);
