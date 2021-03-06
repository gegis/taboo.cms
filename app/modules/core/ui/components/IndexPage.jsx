import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Panel } from 'rsuite';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';

class IndexPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore: this.props.templatesStore });
    return (
      <Template>
        <Grid>
          <Row>
            <Col>
              <h1>Welcome to Taboo CMS</h1>
              <Panel bordered>
                <h3>A node.js and React Content Management System.</h3>
                <p>React CMS, Classic CMS, Headless CMS in one.</p>
              </Panel>
              <div className="v-spacer-3" />
              <Panel bordered>
                <h3>Create New Module</h3>
                <p>From your application root folder run this command:</p>
                <p>
                  <code>npx taboo-cms-cli module create</code>
                </p>
                <p>
                  It will prompt for module name and model name (model name in singular without &apos;Model&apos; word
                  in it).
                </p>
                <p>
                  You can find newly installed module in <code>./app/modules/yourModuleName</code>. It creates new
                  module with ACL resources for admin access, so make sure to enable those resources for required Roles
                  in the Admin panel.
                </p>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Template>
    );
  }
}

IndexPage.propTypes = {
  templatesStore: PropTypes.object,
};

const enhance = compose(inject('templatesStore'), observer);

export default enhance(IndexPage);
