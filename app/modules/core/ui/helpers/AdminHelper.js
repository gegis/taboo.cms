class AdminHelper {
  getAdminAccessUrlPrefix() {
    return 'admin';
  }

  getCreatedAtFilterForStore(store, dates) {
    const { filter = null } = store;
    let createdAtFilter = {};
    let from, to;
    if (filter) {
      createdAtFilter = Object.assign({}, filter);
    }
    if (createdAtFilter && createdAtFilter.createdAt) {
      delete createdAtFilter.createdAt;
    }
    if (Object.keys(dates).length > 1) {
      from = new Date(dates[0]);
      from.setHours(0, 0, 0);
      to = new Date(dates[1]);
      to.setHours(23, 59, 59);
      Object.assign(createdAtFilter, {
        createdAt: {
          $gte: from,
          $lte: to,
        },
      });
    }
    return createdAtFilter;
  }
}

// To support server and client side;
module.exports = new AdminHelper();
// export default new AdminHelper();
