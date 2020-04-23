import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

class ModuleName extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.moduleNameStore.loadAll();
  }

  render() {
    const {
      moduleNameStore: { items },
      templatesStore: { templateComponents = {}, defaultTemplateName = '' } = {},
    } = this.props;
    const Template = templateComponents[defaultTemplateName];
    return (
      <Template className="moduleName">
        <div className="items-list">
          {items.map(item => (
            <div key={item._id}>
              <span>{item._id}</span>
              {' - '}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </Template>
    );
  }
}

ModuleName.propTypes = {
  moduleNameStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('moduleNameStore', 'templatesStore'), observer);

export default enhance(ModuleName);
