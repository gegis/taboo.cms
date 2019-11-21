import React from 'react';
import { Icon, IconButton } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Translation from 'app/modules/core/client/components/Translation';
import UnitsHelper from 'app/modules/core/client/helpers/UnitsHelper';
import UploadSelect from 'app/modules/uploads/client/components/admin/UploadSelect';
import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';

const CustomDroppable = props => {
  const { children, ...rest } = props;
  return <Droppable {...rest}>{children}</Droppable>;
};

CustomDroppable.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

observer(CustomDroppable);

class GalleryImages extends React.Component {
  constructor(props) {
    super(props);
    this.uploadSelect = React.createRef();
    this.galleriesStore = props.galleriesStore;
    this.notificationsStore = props.notificationsStore;
    this.addImages = this.addImages.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onImageRemove = this.onImageRemove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  addImages() {
    const { current } = this.uploadSelect;
    if (current) {
      current.open();
    }
  }

  onAdd(item) {
    if (item && item.type && item.type.indexOf('image') === 0) {
      this.galleriesStore.addImage(item);
      this.notificationsStore.push({
        html: 'Successfully added {item}',
        translationVars: { item: item.name },
        translate: true,
      });
    } else {
      this.notificationsStore.push({
        html: 'Only image type files allowed',
        type: 'error',
        translate: true,
      });
    }
  }

  getUploadPreview(item, styles = {}) {
    let preview = null;
    if (item.type && item.type.indexOf('image') === 0) {
      preview = <img className="upload-preview upload-image" src={item.url} style={styles} />;
    }
    return preview;
  }

  onImageRemove(data) {
    const { image, index } = data;
    this.galleriesStore.removeImageByPosition(index);
    this.notificationsStore.push({
      html: 'Successfully removed {image}',
      translationVars: { image: image.name },
      translate: true,
    });
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    this.galleriesStore.reorderImages(result.source.index, result.destination.index);
  }

  getDraggableStyle(style, snapshot) {
    if (snapshot.isDropAnimating) {
      // Make dropping animation very short
      return {
        ...style,
        left: '26%',
        top: `${parseInt(style.top) - 30}px`,
        transitionDuration: '0.1s',
      };
    } else if (snapshot.isDragging) {
      return {
        ...style,
        left: '26%',
        top: `${parseInt(style.top) - 30}px`,
      };
    }
    return style;
  }

  getImages() {
    const { images } = this.galleriesStore.item;
    // Workaround to get images observed on add and remove for Droppable component
    images.map(() => {
      return true;
    });
    return images;
  }

  render() {
    const images = this.getImages();
    return (
      <div className="gallery-images">
        <div className="pull-right">
          <IconButton icon={<Icon icon="image" />} appearance="primary" onClick={this.addImages}>
            <Translation message="Add Images" />
          </IconButton>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <table className="table">
            <thead>
              <tr>
                <th className="rs-hidden-xs" style={{ width: '150px' }}>
                  Preview
                </th>
                <th>File</th>
                <th className="rs-hidden-xs">Type</th>
                <th className="rs-hidden-xs">Size</th>
                <th className="action-buttons-1">Actions</th>
              </tr>
            </thead>
            <CustomDroppable droppableId="droppable-gallery-images">
              {provided => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {images.map((image, i) => (
                    <Draggable key={image._id + i} draggableId={image._id + i} index={i}>
                      {(provided, snapshot) => (
                        <tr
                          key={image._id + i}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          className="draggable-tr"
                          style={this.getDraggableStyle(provided.draggableProps.style, snapshot)}
                        >
                          <td className="rs-hidden-xs upload-preview-wrapper">{this.getUploadPreview(image)}</td>
                          <td className="mobile-view-td">
                            <div className="rs-hidden-xs">{image.name}</div>
                            <div className="rs-visible-xs" style={{ textAlign: 'center' }}>
                              <div>{image.name}</div>
                              <a href={image.url} target="_blank" rel="noopener noreferrer">
                                {this.getUploadPreview(image, { height: '100px' })}
                              </a>
                            </div>
                          </td>
                          <td className="rs-hidden-xs">{image.type}</td>
                          <td className="rs-hidden-xs">{UnitsHelper.parseSizeAuto(image.size)}</td>
                          <td>
                            <ActionButtons value={{ image, index: i }} onDelete={this.onImageRemove} />
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
        <UploadSelect
          ref={this.uploadSelect}
          onAdd={this.onAdd}
          filter={{ type: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'] }}
        />
      </div>
    );
  }
}

GalleryImages.propTypes = {
  notificationsStore: PropTypes.object.isRequired,
  galleriesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('notificationsStore', 'galleriesStore'), observer);

export default enhance(GalleryImages);
