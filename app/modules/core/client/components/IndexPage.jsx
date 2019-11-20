import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Layout from 'app/modules/core/client/components/Layout';
import { Col, Grid, Row } from 'rsuite';
import ButtonLink from 'app/modules/core/client/components/ButtonLink';

class IndexPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authStore } = this.props;
    return (
      <Layout>
        <Grid>
          <Row>
            <Col md={15} mdOffset={4}>
              {!authStore.authenticated && (
                <div className="rs-visible-xs rs-visible-sm text-center margin-top">
                  <div className="v-spacer-2" />
                  <div>
                    <ButtonLink appearance="primary" to="/sign-up">
                      Sign up
                    </ButtonLink>
                  </div>
                  <div className="v-spacer-3" />
                  <Link className="rs-nav-item-content" to="/sign-in">
                    Sign In
                  </Link>
                </div>
              )}
            </Col>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  aclStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('aclStore', 'authStore'),
  observer
);

export default enhance(IndexPage);
