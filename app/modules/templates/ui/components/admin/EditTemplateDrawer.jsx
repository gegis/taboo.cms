import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Drawer from 'modules/core/ui/components/admin/Drawer';
import Translation from 'modules/core/ui/components/Translation';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';

class EditTemplateDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.drawer = React.createRef();
    this.templatesAdminStore = props.templatesAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onIframeLoad = this.onIframeLoad.bind(this);
  }

  open(id) {
    this.templatesAdminStore.resetItem();
    this.templatesAdminStore.loadById(id).then(data => {
      this.drawer.current.open();
      setTimeout(() => {
        this.templatesAdminStore.setPreviewPath(data.name);
      }, 150);
    });
  }

  close() {
    this.templatesAdminStore.resetItem();
    this.templatesAdminStore.unsetPreviewPath();
    this.drawer.current.close();
  }

  onSave() {
    const { item } = this.templatesAdminStore;
    this.templatesAdminStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data.title },
        translate: true,
      });
      this.templatesAdminStore.resetItem();
      this.templatesAdminStore.loadAll();
      this.close();
    });
  }

  getDrawerTitle() {
    const { item } = this.templatesAdminStore;
    return <Translation message="{title} Template" values={{ title: item.title }} />;
  }

  getSettingsComponent() {
    const { item, templatesSettings } = this.templatesAdminStore;
    if (item && item.name && templatesSettings[item.name]) {
      return templatesSettings[item.name];
    }
    return null;
  }

  onIframeLoad() {
    const { authStore, templatesAdminStore } = this.props;
    TemplatesHelper.emitTemplateChanges({ authStore, templatesAdminStore });
  }

  render() {
    const { previewPath } = this.templatesAdminStore;
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
              <iframe className="template-preview-iframe" src={previewPath} onLoad={this.onIframeLoad} />
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

EditTemplateDrawer.propTypes = {
  templatesAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesAdminStore', 'notificationsStore', 'authStore'), observer);

export default enhance(EditTemplateDrawer);
