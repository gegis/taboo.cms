import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Layout from 'app/modules/core/client/components/Layout';
import { withRouter } from 'react-router-dom';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.settingsStore.loadAll();
  }

  render() {
    const { items } = this.props.settingsStore;
    return (
      <Layout className="settings">
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

Settings.propTypes = {
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('settingsStore'), observer);

export default enhance(Settings);
