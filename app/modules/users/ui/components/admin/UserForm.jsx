import React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  HelpBlock,
  MultiCascader,
  SelectPicker,
  Icon,
} from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Translation from 'app/modules/core/ui/components/Translation';

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.usersStore = props.usersStore;
    this.rolesStore = props.rolesStore;
    this.countriesAdminStore = props.countriesAdminStore;
    this.getUserDocumentsPreview = this.getUserDocumentsPreview.bind(this);
  }

  componentDidMount() {
    this.countriesAdminStore.loadAllCountriesOptions();
  }

  getFilePreview(item) {
    let preview = null;
    if (item.type && item.type.indexOf('image') === 0) {
      preview = (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <img className="upload-preview upload-image" src={item.url} />
          <br />
          {item.name}
        </a>
      );
    } else {
      preview = (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <Icon icon="file-text" /> {item.name}
        </a>
      );
    }
    return preview;
  }

  getUserDocumentsPreview() {
    const { item, userDocumentNames, toggleUserDocumentVerified } = this.usersStore;
    let preview = [];
    userDocumentNames.map(docName => {
      if (item[docName]) {
        preview.push(
          <div key={item[docName]._id} className="user-document-wrapper">
            <div className="user-document">
              <div>
                <Translation message={docName} />
              </div>
              <div className="document-file-preview">{this.getFilePreview(item[docName])}</div>
              <div className="document-verified">
                Verified:{' '}
                <Checkbox checked={item[docName].verified} onChange={toggleUserDocumentVerified.bind(null, docName)} />
              </div>
            </div>
          </div>
        );
      }
    });
    return preview;
  }

  render() {
    const { item, setItem, setCheckboxItemValue, allVerificationStatuses } = this.usersStore;
    const { allRolesForSelection } = this.rolesStore;
    return (
      <Form layout="horizontal" fluid onChange={setItem} formValue={item} autoComplete="off">
        {item.id && (
          <FormGroup controlId="id" className="inline">
            <ControlLabel>
              <Translation message="ID" />
            </ControlLabel>
            <FormControl name="id" disabled />
          </FormGroup>
        )}
        {item.id && (
          <FormGroup controlId="createdAt" className="inline">
            <ControlLabel>
              <Translation message="Created At" />
            </ControlLabel>
            <FormControl name="createdAt" disabled />
          </FormGroup>
        )}
        {item.id && <div className="clearfix" />}
        <FormGroup controlId="firstName" className="inline">
          <ControlLabel>
            <Translation message="First Name" />
          </ControlLabel>
          <FormControl name="firstName" />
        </FormGroup>
        <FormGroup controlId="lastName" className="inline">
          <ControlLabel>
            <Translation message="Last Name" />
          </ControlLabel>
          <FormControl name="lastName" />
        </FormGroup>
        <FormGroup controlId="email" className="inline">
          <ControlLabel>
            <Translation message="Email" />
          </ControlLabel>
          <FormControl name="email" />
        </FormGroup>
        {/*<FormGroup controlId="username" className="inline">*/}
        {/*  <ControlLabel>*/}
        {/*    <Translation message="Username" />*/}
        {/*  </ControlLabel>*/}
        {/*  <FormControl name="username" />*/}
        {/*</FormGroup>*/}
        <FormGroup controlId="password" className="inline">
          <ControlLabel>
            <Translation message="Password" />
          </ControlLabel>
          <FormControl name="password" type="password" autoComplete="new-password" />
          {item.id && (
            <HelpBlock tooltip>
              <Translation message="Leave it empty if you do not want to change it" />
            </HelpBlock>
          )}
        </FormGroup>
        <FormGroup controlId="country" className="inline">
          <ControlLabel>
            <Translation message="Country" />
          </ControlLabel>
          <FormControl name="country" accepter={SelectPicker} data={this.countriesAdminStore.allCountriesOptions} />
        </FormGroup>
        <FormGroup controlId="active" className="inline">
          <ControlLabel>
            <Translation message="Active" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.active} onChange={setCheckboxItemValue.bind(null, 'active')} />
          </div>
        </FormGroup>
        <FormGroup controlId="admin" className="inline">
          <ControlLabel>
            <Translation message="Admin" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.admin} onChange={setCheckboxItemValue.bind(null, 'admin')} />
          </div>
        </FormGroup>
        <FormGroup controlId="loginAttempts" className="inline">
          <ControlLabel>
            <Translation message="Bad Login Attempts" />
          </ControlLabel>
          <FormControl name="loginAttempts" />
        </FormGroup>
        {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.acl.view') && (
          <FormGroup controlId="roles" className="inline">
            <ControlLabel>
              <Translation message="Roles" />
            </ControlLabel>
            <FormControl name="roles" accepter={MultiCascader} data={allRolesForSelection} />
          </FormGroup>
        )}
        {/*<FormGroup controlId="exported" className="inline">*/}
        {/*  <ControlLabel>*/}
        {/*    <Translation message="Exported" />*/}
        {/*  </ControlLabel>*/}
        {/*  <div className="rs-form-control-wrapper">*/}
        {/*    <Checkbox checked={item.exported} onChange={setCheckboxItemValue.bind(null, 'exported')} />*/}
        {/*  </div>*/}
        {/*</FormGroup>*/}
        <FormGroup controlId="userDocuments">
          <ControlLabel>
            <Translation message="User Documents" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">{this.getUserDocumentsPreview()}</div>
        </FormGroup>
        <FormGroup controlId="verified" className="inline">
          <ControlLabel>
            <Translation message="Account Verified" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.verified} onChange={setCheckboxItemValue.bind(null, 'verified')} />
          </div>
        </FormGroup>
        <FormGroup controlId="emailVerified" className="inline">
          <ControlLabel>
            <Translation message="Email Verified" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.emailVerified} onChange={setCheckboxItemValue.bind(null, 'emailVerified')} />
          </div>
        </FormGroup>
        <FormGroup controlId="verificationStatus" className="inline">
          <ControlLabel>
            <Translation message="Verification Status" />
          </ControlLabel>
          <FormControl name="verificationStatus" accepter={SelectPicker} data={allVerificationStatuses} />
        </FormGroup>
        <FormGroup controlId="verificationNote" className="inline">
          <ControlLabel>
            <Translation message="Verification Note" />
          </ControlLabel>
          <FormControl name="verificationNote" componentClass="textarea" />
        </FormGroup>
        <FormGroup controlId="agreeToTerms" className="inline">
          <ControlLabel>
            <Translation message="Agree To Terms & Conditions" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.agreeToTerms} onChange={setCheckboxItemValue.bind(null, 'agreeToTerms')} disabled />
          </div>
        </FormGroup>
      </Form>
    );
  }
}

UserForm.propTypes = {
  aclStore: PropTypes.object.isRequired,
  usersStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
  countriesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('aclStore', 'usersStore', 'rolesStore', 'countriesAdminStore'), observer);

export default enhance(UserForm);
