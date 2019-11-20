import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Icon, Table } from 'rsuite';

const BooleanCell = ({ rowData, dataKey, className, ...props }) => {
  let icon = 'square-o';
  if (rowData[dataKey]) {
    icon = 'check-square-o';
  }
  return (
    <Table.Cell {...props} className={classNames(className, 'table-cell-boolean')}>
      <Icon size="lg" icon={icon} />
    </Table.Cell>
  );
};

BooleanCell.propTypes = {
  rowData: PropTypes.object,
  dataKey: PropTypes.string,
  className: PropTypes.string,
};

export default BooleanCell;
