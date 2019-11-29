import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';

const CustomDroppable = props => {
  const { children, ...rest } = props;
  return <Droppable {...rest}>{children}</Droppable>;
};

CustomDroppable.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

class NavigationList extends React.Component {
  constructor(props) {
    super(props);
    this.navigationStore = props.navigationStore;
    this.notificationsStore = props.notificationsStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  getCopyValue(item) {
    return item._id;
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    this.navigationStore.reorderItems(result.source.index, result.destination.index).then(data => {
      console.log(data);
      if (data && data.success) {
        this.notificationsStore.push({
          title: 'Success',
          html: 'Sort order has been saved',
          translate: true,
        });
      }
    });
  }

  getDraggableStyle(style, snapshot) {
    if (snapshot.isDropAnimating) {
      // Make dropping animation very short
      return {
        ...style,
        left: '300px%',
        top: `${parseInt(style.top) - 10}px`,
        transitionDuration: '0.1s',
      };
    } else if (snapshot.isDragging) {
      return {
        ...style,
        left: '300px',
        top: `${parseInt(style.top) - 10}px`,
      };
    }
    return style;
  }

  render() {
    const { items } = this.navigationStore;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>URL</th>
              <th>Language</th>
              <th>Enabled</th>
              <th className="action-buttons-3">Actions</th>
            </tr>
          </thead>
          <CustomDroppable droppableId="droppable-navigation">
            {provided => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {items.map((item, i) => (
                  <Draggable key={item._id + i} draggableId={item._id + i} index={i}>
                    {(provided, snapshot) => (
                      <tr
                        key={item._id + i}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        className="draggable-tr"
                        style={this.getDraggableStyle(provided.draggableProps.style, snapshot)}
                      >
                        <td>{item.title}</td>
                        <td>{item.url}</td>
                        <td>{item.language}</td>
                        <td>
                          <BooleanIcon value={item.enabled} />
                        </td>
                        <td>
                          <ActionButtons
                            value={item._id}
                            onEdit={this.openEditModal}
                            onDelete={this.handleDelete}
                            copyValue={this.getCopyValue(item)}
                            onCopy={this.handleCopy}
                            copyTitle="Copy value"
                          />
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </CustomDroppable>
        </table>
      </DragDropContext>
    );
  }
}

NavigationList.propTypes = {
  navigationStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('navigationStore', 'notificationsStore'), observer);

export default enhance(NavigationList);
