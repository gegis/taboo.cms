import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { InputPicker } from 'rsuite';
import PropTypes from 'prop-types';

class FormPageBlockActions extends React.Component {
  constructor(props) {
    super(props);
    this.setProps = this.setProps.bind(this);
  }

  componentDidMount() {
    const { formsAdminStore } = this.props;
    formsAdminStore.loadAll();
  }

  setProps(key, value) {
    const { setProps } = this.props;
    const props = {};
    props[key] = value;
    setProps(props);
  }

  render() {
    const { formsAdminStore, formId } = this.props;
    const { formOptions } = formsAdminStore;
    return (
      <span>
        <span className="form-page-block-actions inline">
          <InputPicker
            size="sm"
            placeholder="Please Select Form"
            value={formId}
            data={formOptions}
            onChange={this.setProps.bind(this, 'formId')}
          />
        </span>
      </span>
    );
  }
}

FormPageBlockActions.propTypes = {
  formsAdminStore: PropTypes.object.isRequired,
  setProps: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
};

const enhance = compose(inject('formsAdminStore'), observer);

export default enhance(FormPageBlockActions);
