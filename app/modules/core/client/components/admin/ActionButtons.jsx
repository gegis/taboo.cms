import React from 'react';
import { Icon, ButtonToolbar, IconButton, Whisper, Popover } from 'rsuite';
import Translation from 'app/modules/core/client/components/Translation';
import PropTypes from 'prop-types';

const ActionButtons = ({
  value,
  copyValue,
  copyTitle = 'Copy value',
  onEdit,
  onDelete,
  onAdd,
  onCopy,
  onSelect,
  onArchive,
  archived = false,
  customButtons,
  ...props
}) => {
  let buttons = [];
  let archiveButtonOptions = {
    text: 'Do you want to archive?',
    title: 'Archive',
    icon: 'folder-o',
  };
  const refs = {
    deleteConfirm: null,
    archiveConfirm: null,
  };
  const getRef = name => {
    return refs[name];
  };

  const handleEdit = () => {
    onEdit(value);
  };

  const handleAdd = () => {
    onAdd(value);
  };

  const handleSelect = () => {
    onSelect(value);
  };

  const handleDelete = () => {
    refs.deleteConfirm.hide();
    onDelete(value);
  };

  const handleArchive = () => {
    refs.archiveConfirm.hide();
    onArchive(value);
  };

  const handleCopy = () => {
    window.copyValueInput.value = copyValue;
    window.copyValueInput.select();
    document.execCommand('copy');
    window.copyValueInput.blur();
    if (onCopy) {
      onCopy(copyValue);
    }
  };

  const actionConfirmation = (title, handler, refName) => (
    <Popover title={<Translation message={title} />}>
      <ButtonToolbar style={{ textAlign: 'center' }}>
        <IconButton
          icon={<Icon icon="close" />}
          appearance="ghost"
          size="sm"
          style={{ paddingRight: 10 }}
          onClick={() => {
            getRef(refName).hide();
          }}
        />
        <IconButton appearance="primary" icon={<Icon icon="check" />} size="sm" onClick={handler} />
      </ButtonToolbar>
    </Popover>
  );

  if (customButtons) {
    buttons = customButtons;
  }

  if (onEdit) {
    buttons.push(
      <IconButton
        className="edit-btn"
        key="edit"
        appearance="default"
        onClick={handleEdit}
        title="Edit"
        icon={<Icon icon="edit2" />}
      />
    );
  }

  if (onAdd) {
    buttons.push(
      <IconButton
        className="add-btn"
        key="add"
        appearance="primary"
        title="Add"
        onClick={handleAdd}
        icon={<Icon icon="plus" />}
      />
    );
  }

  if (onSelect) {
    buttons.push(
      <IconButton
        className="select-btn"
        key="select"
        appearance="primary"
        title="Select"
        onClick={handleSelect}
        icon={<Icon icon="check" />}
      />
    );
  }

  if (copyValue) {
    buttons.push(
      <IconButton
        className="copy-btn"
        key="copy"
        appearance="default"
        onClick={handleCopy}
        icon={<Icon icon="copy" />}
        title={copyTitle}
      />
    );
  }

  if (onArchive) {
    if (archived) {
      archiveButtonOptions.text = 'Do you want to unarchive?';
      archiveButtonOptions.title = 'Unarchive';
      archiveButtonOptions.icon = 'folder-open-o';
    }
    buttons.push(
      <Whisper
        key="archive"
        placement="left"
        trigger="click"
        triggerRef={ref => {
          refs.archiveConfirm = ref;
        }}
        speaker={actionConfirmation(archiveButtonOptions.text, handleArchive, 'archiveConfirm')}
      >
        <IconButton
          color="orange"
          className="archive-btn"
          title={archiveButtonOptions.title}
          icon={<Icon icon={archiveButtonOptions.icon} />}
        />
      </Whisper>
    );
  }

  if (onDelete) {
    buttons.push(
      <Whisper
        key="delete"
        placement="left"
        trigger="click"
        triggerRef={ref => {
          refs.deleteConfirm = ref;
        }}
        speaker={actionConfirmation('Do you want to delete?', handleDelete, 'deleteConfirm')}
      >
        <IconButton
          appearance="default"
          className="delete-btn"
          color="red"
          title="Delete"
          icon={<Icon icon="trash-o" />}
        />
      </Whisper>
    );
  }

  return (
    <ButtonToolbar {...props} className="action-buttons">
      {buttons}
    </ButtonToolbar>
  );
};

ActionButtons.propTypes = {
  value: PropTypes.string,
  copyValue: PropTypes.string,
  copyTitle: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  onCopy: PropTypes.func,
  onArchive: PropTypes.func,
  onSelect: PropTypes.func,
  archived: PropTypes.bool,
  customButtons: PropTypes.node,
};

export default ActionButtons;
