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
import Translation from 'app/modules/core/client/components/Translation';

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.usersStore = props.usersStore;
    this.rolesStore = props.rolesStore;
    this.getUserDocumentsPreview = this.getUserDocumentsPreview.bind(this);
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
    const { item, userDocumentTypes, toggleUserDocumentVerified } = this.usersStore;
    let preview = [];
    userDocumentTypes.map(docType => {
      if (item[docType]) {
        preview.push(
          <div key={item[docType]._id} className="user-document-wrapper">
            <div className="user-document">
              <div>
                <Translation message={docType} />
              </div>
              <div className="document-file-preview">{this.getFilePreview(item[docType])}</div>
              <div className="document-verified">
                Verified:{' '}
                <Checkbox checked={item[docType].verified} onChange={toggleUserDocumentVerified.bind(null, docType)} />
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
        <FormGroup controlId="password" className="inline">
          <ControlLabel>
            <Translation message="Password" />
          </ControlLabel>
          <FormControl name="password" type="password" autoComplete="off" />
          {item.id && (
            <HelpBlock tooltip>
              <Translation message="Leave it empty if you do not want to change it" />
            </HelpBlock>
          )}
        </FormGroup>
        <FormGroup controlId="admin" className="inline">
          <ControlLabel>
            <Translation message="Admin" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.admin} onChange={setCheckboxItemValue.bind(null, 'admin')} />
          </div>
        </FormGroup>
        <FormGroup controlId="active" className="inline">
          <ControlLabel>
            <Translation message="Active" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.active} onChange={setCheckboxItemValue.bind(null, 'active')} />
          </div>
        </FormGroup>
        <FormGroup controlId="loginAttempts" className="inline">
          <ControlLabel>
            <Translation message="Login Attempts" />
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
        <FormGroup controlId="userDocuments">
          <ControlLabel>
            <Translation message="User Documents" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">{this.getUserDocumentsPreview()}</div>
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
        <FormGroup controlId="verified" className="inline">
          <ControlLabel>
            <Translation message="Account Verified" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.verified} onChange={setCheckboxItemValue.bind(null, 'verified')} />
          </div>
        </FormGroup>
        <FormGroup controlId="businessAccount" className="inline">
          <ControlLabel>
            <Translation message="Business Account" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.businessAccount} onChange={setCheckboxItemValue.bind(null, 'businessAccount')} />
          </div>
        </FormGroup>
        <FormGroup controlId="companyName" className="inline">
          <ControlLabel>
            <Translation message="Company Name" />
          </ControlLabel>
          <FormControl name="companyName" />
        </FormGroup>

        <FormGroup controlId="street" className="inline">
          <ControlLabel>
            <Translation message="Street" />
          </ControlLabel>
          <FormControl name="street" />
        </FormGroup>

        <FormGroup controlId="city" className="inline">
          <ControlLabel>
            <Translation message="City" />
          </ControlLabel>
          <FormControl name="city" />
        </FormGroup>

        <FormGroup controlId="state" className="inline">
          <ControlLabel>
            <Translation message="State" />
          </ControlLabel>
          <FormControl name="state" />
        </FormGroup>

        <FormGroup controlId="country" className="inline">
          <ControlLabel>
            <Translation message="Country" />
          </ControlLabel>
          <FormControl name="country" />
        </FormGroup>

        <FormGroup controlId="postCode" className="inline">
          <ControlLabel>
            <Translation message="Postcode" />
          </ControlLabel>
          <FormControl name="postCode" />
        </FormGroup>

        <FormGroup controlId="phone" className="inline">
          <ControlLabel>
            <Translation message="Phone" />
          </ControlLabel>
          <FormControl name="phone" />
        </FormGroup>

        <FormGroup controlId="website" className="inline">
          <ControlLabel>
            <Translation message="Website" />
          </ControlLabel>
          <FormControl name="website" />
        </FormGroup>

        <FormGroup controlId="description">
          <ControlLabel>
            <Translation message="Description" />
          </ControlLabel>
          <FormControl name="description" componentClass="textarea" />
        </FormGroup>
      </Form>
    );
  }
}

UserForm.propTypes = {
  aclStore: PropTypes.object.isRequired,
  usersStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('aclStore', 'usersStore', 'rolesStore'),
  observer
);

export default enhance(UserForm);
