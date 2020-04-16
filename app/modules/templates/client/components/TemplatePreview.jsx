import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Panel } from 'rsuite';
import NotFound from 'app/modules/core/client/components/NotFound';
import { withRouter } from 'react-router-dom';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';
import ActionButtons from 'modules/core/client/components/admin/ActionButtons';

class TemplatePreview extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  getTemplateName() {
    const { match: { params: { template = null } = {} } = {} } = this.props;
    return template;
  }

  getTemplate() {
    const { templates } = this.props.templatesStore;
    const tplName = this.getTemplateName();
    if (tplName && templates && templates[tplName]) {
      return templates[tplName];
    } else {
      return NotFound;
    }
  }

  render() {
    const Template = this.getTemplate();
    return (
      <Template>
        <div>
          <h1>Paragraph (H1)</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <h2>Bordered Panel (H2)</h2>
          <Panel bordered={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Panel>
          <h3>Panel (H3)</h3>
          <Panel>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Panel>
          <h4>Table (H4)</h4>
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
                <td>ID</td>
                <td>Title</td>
                <td>Description</td>
              </tr>
              <tr>
                <td>ID</td>
                <td>Title</td>
                <td>Description</td>
              </tr>
              <tr>
                <td>ID</td>
                <td>Title</td>
                <td>Description</td>
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
  match: PropTypes.object.isRequired,
};

const enhance = compose(withRouter, inject('templatesStore'), observer);

export default enhance(TemplatePreview);
