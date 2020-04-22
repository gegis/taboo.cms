import React from 'react';
import { Footer as RsFooter } from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';

class Footer extends React.Component {
  render() {
    return (
      <RsFooter className="footer">
        <Translation message="Brand" /> <sup>&copy;</sup>
      </RsFooter>
    );
  }
}

export default Footer;
