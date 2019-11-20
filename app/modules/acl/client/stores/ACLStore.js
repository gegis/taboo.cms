import axios from 'axios';
import { action, decorate, observable, runInAction } from 'mobx';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

class ACLStore {
  constructor() {
    // To throttle requests for acl refreshing, single call no often than value in ms
    this.minTimeoutToRefreshACL = window.app.config.userACLRefreshThreshold || 60000;
    this.refreshTimeout = null;
    this.canRefreshACL = true;
    this.aclEnabled = true;
    this.allResources = [];
    this.userACL = [];
  }

  loadAllResources() {
    return new Promise(resolve => {
      axios
        .get('/api/acl/resources')
        .then(response => {
          runInAction(() => {
            let { data = [] } = response;
            if (data) {
              data.sort();
              this.allResources = data;
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadUserACL() {
    return new Promise(resolve => {
      axios
        .get('/api/acl/resources/user')
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            if (data) {
              this.userACL = data;
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadACLEnabled() {
    return new Promise(resolve => {
      axios
        .get('/api/acl/enabled')
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            if (data) {
              this.aclEnabled = data.enabled;
            }
            resolve(data.enabled);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  refreshACL(force = false) {
    if (force) {
      clearTimeout(this.refreshTimeout);
      this.canRefreshACL = true;
    }
    if (this.canRefreshACL) {
      this.loadACLEnabled().then(enabled => {
        if (enabled) {
          this.loadAllResources();
          this.loadUserACL();
        }
      });
      this.canRefreshACL = false;
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = setTimeout(() => {
        this.canRefreshACL = true;
      }, this.minTimeoutToRefreshACL);
    }
  }

  /**
   * Returns true is user is allowed or if acl is disabled
   * * IMPORTANT - we have same userACL in this.userACL, however, if 'isAllowed' function called from component
   * only with 'resource' - Mobx does not track this.userACL change and does not re-render component!
   *
   * @param resource - can be either single resource string value, or array of resources string values.
   * @returns {*|boolean}
   */
  isAllowed(userACL, resource) {
    let allowed = false;
    if (!resource || !this.aclEnabled) {
      allowed = true;
    } else {
      if (!Array.isArray(resource)) {
        resource = [resource];
      }
      allowed = resource.some(resourceItem => {
        return userACL.indexOf(resourceItem) !== -1;
      });
    }
    return allowed;
  }
}

decorate(ACLStore, {
  aclEnabled: observable,
  allResources: observable,
  userACL: observable,
  loadACLEnabled: action,
  loadAllResources: action,
  loadUserACL: action,
  refreshACL: action,
  isAllowed: action,
});

export default ACLStore;
