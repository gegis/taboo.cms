import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/snippets/html';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/ext-spellcheck'; // Does not seem to work
// import 'ace-builds/src-min-noconflict/ext-beautify'; // Does not seem to work
// import 'ace-builds/src-min-noconflict/ext-searchbox';
// import 'ace-builds/src-min-noconflict/ext-prompt';
// import 'ace-builds/src-min-noconflict/ext-options';

class CodeEditor extends React.Component {
  render() {
    const {
      onChange,
      value,
      id = 'code-editor',
      mode = 'html',
      theme = 'chrome',
      tabSize = 2,
      fontSize = 12,
      enableBasicAutocompletion = true,
      enableLiveAutocompletion = true,
      focus = false,
      ...rest
    } = this.props;
    return (
      <AceEditor
        mode={mode}
        theme={theme}
        onChange={onChange}
        name={id}
        value={value}
        fontSize={fontSize}
        focus={focus}
        setOptions={{
          useWorker: false,
          tabSize: tabSize,
          useSoftTabs: false,
          enableBasicAutocompletion: enableBasicAutocompletion,
          enableLiveAutocompletion: enableLiveAutocompletion,
          enableSnippets: true,
          showLineNumbers: true,
          scrollPastEnd: true,
          vScrollBarAlwaysVisible: true,
          showGutter: true,
          showPrintMargin: true,
          printMargin: true,
          printMarginColumn: 100,
          showFoldWidgets: true,
          highlightActiveLine: true,
        }}
        {...rest}
      />
    );
  }
}

CodeEditor.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  mode: PropTypes.string,
  theme: PropTypes.string,
  tabSize: PropTypes.number,
  fontSize: PropTypes.number,
  focus: PropTypes.bool,
  enableBasicAutocompletion: PropTypes.bool,
  enableLiveAutocompletion: PropTypes.bool,
};

export default CodeEditor;
