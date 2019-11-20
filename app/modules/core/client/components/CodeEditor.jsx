import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import 'brace/mode/html';
import 'brace/theme/chrome';
import 'brace/ext/language_tools';
// import 'brace/ext/beautify'; // Does not seem to work

class CodeEditor extends React.Component {
  render() {
    const {
      onChange,
      value,
      id = 'code-editor',
      tabSize = 2,
      enableBasicAutocompletion = true,
      enableLiveAutocompletion = true,
      ...rest
    } = this.props;
    return (
      <AceEditor
        mode="html"
        theme="chrome"
        onChange={onChange}
        name={id}
        value={value}
        editorProps={{ $blockScrolling: Infinity }}
        enableBasicAutocompletion={enableBasicAutocompletion}
        enableLiveAutocompletion={enableLiveAutocompletion}
        tabSize={tabSize}
        {...rest}
      />
    );
  }
}

CodeEditor.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  tabSize: PropTypes.number,
  enableBasicAutocompletion: PropTypes.bool,
  enableLiveAutocompletion: PropTypes.bool,
};

export default CodeEditor;
