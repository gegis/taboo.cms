import React from 'react';
import { Icon, Table, ButtonToolbar, IconButton, Whisper, Popover } from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';
import PropTypes from 'prop-types';

const ActionsCell = ({ rowData, dataKey, onEdit, onDelete, ...props }) => {
  const buttons = [];
  let deleteConfirmRef;

  const handleEdit = () => {
    onEdit(rowData[dataKey]);
  };

  const handleDelete = () => {
    deleteConfirmRef.hide();
    onDelete(rowData[dataKey]);
  };

  const deleteConfirmation = (
    <Popover title={<Translation message="Do you want to delete?" />}>
      <ButtonToolbar style={{ textAlign: 'center' }}>
        <IconButton
          icon={<Icon icon="close" />}
          appearance="ghost"
          size="sm"
          style={{ paddingRight: 10 }}
          onClick={() => {
            deleteConfirmRef.hide();
          }}
        />
        <IconButton appearance="primary" icon={<Icon icon="check" />} size="sm" onClick={handleDelete} />
      </ButtonToolbar>
    </Popover>
  );

  if (onEdit) {
    buttons.push(
      <IconButton
        className="edit-btn"
        key="edit"
        appearance="default"
        onClick={handleEdit}
        icon={<Icon icon="edit2" />}
      />
    );
  }

  if (onDelete) {
    buttons.push(
      <Whisper
        key="delete"
        placement="left"
        trigger="click"
        speaker={deleteConfirmation}
        triggerRef={ref => {
          deleteConfirmRef = ref;
        }}
      >
        <IconButton appearance="default" className="delete-btn" color="red" icon={<Icon icon="trash-o" />} />
      </Whisper>
    );
  }

  return (
    <Table.Cell {...props} className="table-cell-actions">
      <ButtonToolbar>{buttons}</ButtonToolbar>
    </Table.Cell>
  );
};

ActionsCell.propTypes = {
  rowData: PropTypes.object,
  dataKey: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ActionsCell;
