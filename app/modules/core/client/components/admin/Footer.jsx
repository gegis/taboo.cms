import React from 'react';
import { Footer as RsFooter, Divider } from 'rsuite';
import Translation from 'app/modules/core/client/components/Translation';

class Footer extends React.Component {
  render() {
    return (
      <RsFooter className="footer">
        <Divider />
        <Translation message="Brand" /> <sup>&copy;</sup>
      </RsFooter>
    );
  }
}

export default Footer;
