import React from 'react';
import axios from 'axios';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'rsuite';
import { withRouter } from 'react-router-dom';
import Translation from 'app/modules/core/ui/components/Translation';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';

class LogoutButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { authStore, history } = this.props;
    axios
      .get('/api/logout')
      .then(response => {
        if (response && response.data && response.data.success) {
          authStore.loadUserAuth().then(() => {
            return history.push('/');
          });
        } else {
          throw new Error('Error logging out');
        }
      })
      .catch(ResponseHelper.handleError);
  }

  render() {
    const { appearance = 'link', children = <Translation message="Logout" /> } = this.props;
    if (appearance === 'dropdownItem') {
      return (
        <Dropdown.Item key="logout" onSelect={this.handleLogout}>
          {children}
        </Dropdown.Item>
      );
    } else {
      return (
        <Button key="logout" appearance={appearance} onClick={this.handleLogout}>
          {children}
        </Button>
      );
    }
  }
}

LogoutButton.propTypes = {
  appearance: PropTypes.string,
  children: PropTypes.node,
  authStore: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore'), observer);

export default enhance(LogoutButton);
