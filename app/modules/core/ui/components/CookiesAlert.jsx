import React from 'react';
import { Button } from 'rsuite';

import Cookies from 'app/modules/core/ui/helpers/Cookies';

class CookiesAlert extends React.Component {
  constructor(props) {
    super(props);
    this.cookieName = 'cookiesAccepted';
    const showAlert = !Cookies.get(this.cookieName);
    this.state = { showAlert };
    this.acceptCookies = this.acceptCookies.bind(this);
  }

  acceptCookies() {
    Cookies.set(this.cookieName, true, 365);
    this.setState({
      showAlert: false,
    });
  }

  render() {
    const { showAlert } = this.state;
    const {
      app: { config: { cookiesAlert: { text = 'We use Cookies', learnMoreLink = '' } = {} } = {} } = {},
    } = window;
    if (showAlert) {
      return (
        <div className="cookies-alert" role="alert">
          {text}
          {learnMoreLink && (
            <a className="cookies-alert-learn-more" href={learnMoreLink} target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          )}
          <Button appearance="primary" className="cookies-alert-accept" onClick={this.acceptCookies}>
            I Agree
          </Button>
        </div>
      );
    }
    return null;
  }
}

export default CookiesAlert;
