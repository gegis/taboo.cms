import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Panel } from 'rsuite';
import NotFound from 'app/modules/core/client/components/NotFound';
import { withRouter } from 'react-router-dom';
import Translation from 'modules/core/client/components/Translation';

class TemplatePreview extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { localeStore, match: { params: { language = null } = {} } = {} } = this.props;
    if (language) {
      localeStore.setLanguage(language);
    }
  }

  getTemplateName() {
    const { match: { params: { template = null } = {} } = {} } = this.props;
    return template;
  }

  getTemplate() {
    const { templateComponents } = this.props.templatesStore;
    const tplName = this.getTemplateName();
    if (tplName && templateComponents && templateComponents[tplName]) {
      return templateComponents[tplName];
    } else {
      return NotFound;
    }
  }

  render() {
    const Template = this.getTemplate();
    return (
      <Template>
        <div>
          <h1>
            <Translation message="Header" /> 1
          </h1>
          <h2>
            <Translation message="Header" /> 2
          </h2>
          <h3>
            <Translation message="Header" /> 3
          </h3>
          <h4>
            <Translation message="Header" /> 4
          </h4>
          <h5>
            <Translation message="Header" /> 5
          </h5>
          <hr />
          <h4>Paragraph</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <hr />
          <h4>Bordered Panel</h4>
          <Panel bordered={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Panel>
          <hr />
          <h4>Panel</h4>
          <Panel>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Panel>
          <hr />
          <h4>Table</h4>
          <table className="rs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Foo</td>
                <td>Lorem ipsum dolor sit amet</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Bar</td>
                <td>Lorem ipsum dolor sit amet</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Foo Bar</td>
                <td>Lorem ipsum dolor sit amet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Template>
    );
  }
}

TemplatePreview.propTypes = {
  templatesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('templatesStore', 'localeStore'), observer);

export default enhance(TemplatePreview);
