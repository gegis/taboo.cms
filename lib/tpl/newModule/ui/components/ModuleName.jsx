import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Layout from 'app/modules/core/ui/components/Layout';
import { withRouter } from 'react-router-dom';

class ModuleName extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.moduleNameStore.loadAll();
  }

  render() {
    const { items } = this.props.moduleNameStore;
    return (
      <Layout className="moduleName">
        <div className="items-list">
          {items.map(item => (
            <div key={item._id}>
              <span>{item._id}</span>
              {' - '}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </Layout>
    );
  }
}

ModuleName.propTypes = {
  moduleNameStore: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('moduleNameStore'), observer);

export default enhance(ModuleName);
