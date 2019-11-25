import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
import ModuleNameList from './ModuleNameList';
import CreateModal from './CreateModelNameModal';
import EditModal from './EditModelNameModal';

class ModuleName extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.moduleNameStore;
  }

  render() {
    return (
      <ListPage
        name="ModuleName"
        entityStore={this.entityStore}
        ItemsListComponent={ModuleNameList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

ModuleName.propTypes = {
  moduleNameStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('moduleNameStore'),
  observer
);

export default enhance(ModuleName);
