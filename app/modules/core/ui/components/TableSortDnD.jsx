import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class TableSortDnD extends React.Component {
  constructor(props) {
    super(props);
    this.getDefaultStyle = this.getDefaultStyle.bind(this);
    this.getDraggableStyle = this.getDraggableStyle.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  getDefaultStyle(dndStyle, snapshot) {
    const { applyDefaultDraggableStyle = false } = this.props;
    const style = {};

    if (applyDefaultDraggableStyle) {
      style.background = '#f5f5f5';
      style.border = '1px solid #76c9ef';
      style.boxShadow = '2px 2px 15px rgba(0, 0, 0, 0.4)';
      if (snapshot.isDropAnimating) {
        // Make dropping animation very short
        style.transition = 'transform 0.1s cubic-bezier(.2,1,.1,1), opacity 0.1s cubic-bezier(.2,1,.1,1)';
      } else if (snapshot.isDragging) {
        style.transition = 'opacity 0.1s cubic-bezier(0.2, 0, 0, 1)';
      }
    }

    return style;
  }

  getDraggableStyle(dndStyle, snapshot) {
    let { applyDraggableStyle = () => {} } = this.props;
    if (snapshot.isDropAnimating) {
      // Make dropping animation very short
      return Object.assign(
        {},
        dndStyle,
        this.getDefaultStyle(dndStyle, snapshot),
        applyDraggableStyle(dndStyle, snapshot)
      );
    } else if (snapshot.isDragging) {
      return Object.assign(
        {},
        dndStyle,
        this.getDefaultStyle(dndStyle, snapshot),
        applyDraggableStyle(dndStyle, snapshot)
      );
    }
    return dndStyle;
  }

  onDragEnd(result) {
    let { onDragEnd } = this.props;
    if (!result.destination) {
      return;
    }
    return onDragEnd(result);
  }

  render() {
    const { items = [], idKey, className, renderTableHead, renderRowCells } = this.props;
    return (
      <div className={classNames('table-sort-dnd', className)} style={{ position: 'relative' }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <table className="table">
            {renderTableHead()}
            <Droppable droppableId="table-sort-dnd">
              {provided => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, i) => (
                    <Draggable key={`${item[idKey]}-${i}`} draggableId={`${item[idKey]}-${i}`} index={i}>
                      {(provided, snapshot) => (
                        <tr
                          key={`${item[idKey]}-${i}`}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          className="draggable-tr"
                          style={this.getDraggableStyle(provided.draggableProps.style, snapshot)}
                        >
                          {renderRowCells(item, i)}
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>
    );
  }
}

TableSortDnD.propTypes = {
  items: PropTypes.array.isRequired,
  idKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  onDragEnd: PropTypes.func.isRequired,
  renderTableHead: PropTypes.func.isRequired,
  renderRowCells: PropTypes.func.isRequired,
  applyDraggableStyle: PropTypes.func,
  applyDefaultDraggableStyle: PropTypes.bool,
};

export default TableSortDnD;
