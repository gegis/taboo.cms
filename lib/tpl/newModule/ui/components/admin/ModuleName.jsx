import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import ModuleNameList from './ModuleNameList';
import ModelNameModal from './ModelNameModal';

class ModuleName extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.moduleNameAdminStore;
  }

  render() {
    return (
      <ListPage
        name="ModuleName"
        entityStore={this.entityStore}
        ItemsListComponent={ModuleNameList}
        CreateModalComponent={ModelNameModal}
        EditModalComponent={ModelNameModal}
      />
    );
  }
}

ModuleName.propTypes = {
  moduleNameAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('moduleNameAdminStore'), observer);

export default enhance(ModuleName);
