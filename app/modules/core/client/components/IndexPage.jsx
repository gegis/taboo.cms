import React, { Component } from 'react';
import Layout from 'app/modules/core/client/components/Layout';
import { Col, Grid, Row } from 'rsuite';

class IndexPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <Grid>
          <Row>
            <Col md={12} mdOffset={6}>
              HOME PAGE
            </Col>
          </Row>
        </Grid>
      </Layout>
    );
  }
}



export default IndexPage;
