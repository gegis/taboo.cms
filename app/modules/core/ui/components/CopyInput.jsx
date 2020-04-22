import React from 'react';

class CopyInput extends React.Component {
  render() {
    return (
      <textarea
        className="helper-copy-value-input"
        ref={el => {
          window.copyValueInput = el;
        }}
      />
    );
  }
}

export default CopyInput;
