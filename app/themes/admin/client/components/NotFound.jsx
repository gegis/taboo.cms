import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from 'rsuite';
import Layout from './Layout';
import Translation from 'app/modules/core/client/components/Translation';

class NotFound extends React.Component {
  render() {
    return (
      <Layout pageTitle="Not Found" className="not-found">
        <Panel header={<Translation message="Page was not found" />} className="shadow">
          <Link to={'/admin'}>
            <Translation message="Go back home" />
          </Link>
        </Panel>
      </Layout>
    );
  }
}

export default NotFound;
