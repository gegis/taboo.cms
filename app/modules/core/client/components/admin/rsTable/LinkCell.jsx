import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Table } from 'rsuite';

const LinkCell = ({ rowData, dataKey, className, linkProps, ...props }) => {
  return (
    <Table.Cell {...props} className={classNames(className, 'table-cell-link')}>
      <Link {...linkProps} to={rowData[dataKey]}>
        {rowData[dataKey]}
      </Link>
    </Table.Cell>
  );
};

LinkCell.propTypes = {
  rowData: PropTypes.object,
  dataKey: PropTypes.string,
  className: PropTypes.string,
  linkProps: PropTypes.object,
};

export default LinkCell;
