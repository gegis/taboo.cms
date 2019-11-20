import React from 'react';
import PropTypes from 'prop-types';

class ProfilePicture extends React.Component {
  constructor(props) {
    super(props);
    this.notFoundImageUrl = '/images/profile-picture.png';
    this.errorCount = 0;
    this.onImageError = this.onImageError.bind(this);
  }

  onImageError(event) {
    // If picture is missing, prevent from infinitive loop.
    if (this.errorCount < 5) {
      event.target.src = this.notFoundImageUrl;
    }
    this.errorCount++;
    return false;
  }

  render() {
    const { url = {}, className = '', size = '' } = this.props;
    let imageUrl = url;
    let wrapperClassName = 'profile-picture';

    if (className) {
      wrapperClassName += ` ${className}`;
    }

    if (!imageUrl) {
      imageUrl = this.notFoundImageUrl;
    }

    if (size) {
      imageUrl += `?size=${size}`;
      wrapperClassName += ` ${size}`;
    }

    return (
      <span className={wrapperClassName}>
        <img src={imageUrl} alt="Profile Picture" onError={this.onImageError} />
      </span>
    );
  }
}

ProfilePicture.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
};

export default ProfilePicture;
