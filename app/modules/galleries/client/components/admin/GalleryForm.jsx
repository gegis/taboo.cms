import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, CheckboxGroup, Icon, IconButton } from 'rsuite';
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
  children: PropTypes.node.isRequired,
};

observer(CustomDroppable);

class GalleryForm extends React.Component {
  constructor(props) {
    super(props);
    this.uploadSelect = React.createRef();
    this.galleriesStore = props.galleriesStore;
    this.notificationsStore = props.notificationsStore;
    this.localeStore = props.localeStore;
    this.addImages = this.addImages.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
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
        html: this.localeStore.getTranslation('Successfully added {item}', { item: item.name }),
      });
    } else {
      this.notificationsStore.push({
        html: this.localeStore.getTranslation('Only image type files allowed'),
        type: 'error',
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

  onDelete(item) {
    this.galleriesStore.removeImageById(item._id);
    this.notificationsStore.push({
      html: this.localeStore.getTranslation('Successfully removed {item}', { item: item.name }),
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
    const { images } = this.galleriesStore.gallery;
    // Workaround to get images observed on add and remove for Droppable component
    images.map(() => {
      return true;
    });
    return images;
  }

  render() {
    const { gallery } = this.galleriesStore;
    const images = this.getImages();
    return (
      <Form layout="horizontal" fluid onChange={this.galleriesStore.setGallery} formValue={gallery}>
        {gallery.id && (
          <FormGroup controlId="id" className="inline">
            <ControlLabel>
              <Translation message="ID" />
            </ControlLabel>
            <FormControl name="id" disabled />
          </FormGroup>
        )}
        {gallery.id && <div className="clearfix" />}
        <FormGroup controlId="title" className="inline">
          <ControlLabel>
            <Translation message="Title" />
          </ControlLabel>
          <FormControl name="title" />
        </FormGroup>
        <FormGroup controlId="published" className="inline">
          <ControlLabel>
            <Translation message="Published" />
          </ControlLabel>
          <FormControl name="publishedGroup" accepter={CheckboxGroup}>
            <Checkbox value="published" />
          </FormControl>
        </FormGroup>
        <FormGroup controlId="images">
          <ControlLabel>
            <Translation message="Images" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
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
                      {images.map((item, i) => (
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
                              <td className="rs-hidden-xs upload-preview-wrapper">{this.getUploadPreview(item)}</td>
                              <td className="mobile-view-td">
                                <div className="rs-hidden-xs">{item.name}</div>
                                <div className="rs-visible-xs" style={{ textAlign: 'center' }}>
                                  <div>{item.name}</div>
                                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    {this.getUploadPreview(item, { height: '100px' })}
                                  </a>
                                </div>
                              </td>
                              <td className="rs-hidden-xs">{item.type}</td>
                              <td className="rs-hidden-xs">{UnitsHelper.parseSizeAuto(item.size)}</td>
                              <td>
                                <ActionButtons value={item} onDelete={this.onDelete} />
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
          </div>
        </FormGroup>
        <UploadSelect
          ref={this.uploadSelect}
          onAdd={this.onAdd}
          filter={{ type: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'] }}
        />
      </Form>
    );
  }
}

GalleryForm.propTypes = {
  notificationsStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  galleriesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('notificationsStore', 'localeStore', 'galleriesStore'), observer);

export default enhance(GalleryForm);
