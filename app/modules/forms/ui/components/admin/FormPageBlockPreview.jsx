import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';

import PageBlockFrame from 'modules/pages/ui/components/admin/PageBlockFrame';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import FormPageBlock from 'modules/forms/ui/components/FormPageBlock';

class FormPageBlockPreview extends React.Component {
  render() {
    const { templatesStore, formId, ...rest } = this.props;
    const Template = TemplatesHelper.getTemplate('blank', { templatesStore });
    return (
      <div className="form-page-block-preview">
        <PageBlockFrame style={{ height: '580px' }}>
          <Template fluid>
            <FormPageBlock formId={formId} {...rest} />
          </Template>
        </PageBlockFrame>
      </div>
    );
  }
}

FormPageBlockPreview.propTypes = {
  templatesStore: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
};

const enhance = compose(inject('templatesStore'), observer);

export default enhance(FormPageBlockPreview);
