import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

class GalleryPageBlockConfig extends React.Component {
  constructor(props) {
    super(props);
    this.setProps = this.setProps.bind(this);
  }

  setProps(key = 'id', value = 'test') {
    const { setProps } = this.props;
    const props = {};
    props[key] = value;
    setProps(props);
  }

  render() {
    return (
      <div className="gallery-page-block-config">
        <a href="#" onClick={this.setProps.bind(this, 'id', 'test2')}>
          TEST
        </a>
      </div>
    );
  }
}

GalleryPageBlockConfig.propTypes = {
  galleriesStore: PropTypes.object.isRequired,
  setProps: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

const enhance = compose(inject('galleriesStore'), observer);

export default enhance(GalleryPageBlockConfig);
