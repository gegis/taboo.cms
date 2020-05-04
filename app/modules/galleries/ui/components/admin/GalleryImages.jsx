import React from 'react';
import { Icon, IconButton, Panel } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import UnitsHelper from 'app/modules/core/ui/helpers/UnitsHelper';
import UploadSelect from 'app/modules/uploads/ui/components/admin/UploadSelect';
import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import TableSortDnD from 'modules/core/ui/components/admin/TableSortDnD';

class GalleryImages extends React.Component {
  constructor(props) {
    super(props);
    this.uploadSelect = React.createRef();
    this.galleriesStore = props.galleriesStore;
    this.notificationsStore = props.notificationsStore;
    this.addImages = this.addImages.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onImageRemove = this.onImageRemove.bind(this);
    this.getRowCells = this.getRowCells.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  addImages() {
    const { current } = this.uploadSelect;
    if (current) {
      current.open();
    }
  }

  onFileSelect(item) {
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

  applyDraggableStyle(style) {
    return {
      left: '8%',
      top: `${parseInt(style.top) - 30}px`,
    };
  }

  getTableHeader() {
    return (
      <thead>
        <tr>
          <th className="rs-hidden-sm" style={{ width: '150px' }}>
            Preview
          </th>
          <th>File</th>
          <th className="rs-hidden-sm">Type</th>
          <th className="rs-hidden-sm">Size</th>
          <th className="action-buttons-1">Actions</th>
        </tr>
      </thead>
    );
  }

  getRowCells(item, i) {
    return [
      <td key="preview" className="rs-hidden-sm upload-preview-wrapper">
        {this.getUploadPreview(item)}
      </td>,
      <td key="name" className="mobile-view-td" width="80%">
        <div className="rs-hidden-sm">{item.name}</div>
        <div className="rs-visible-sm" style={{ textAlign: 'center' }}>
          <div>{item.name}</div>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {this.getUploadPreview(item, { height: '100px' })}
          </a>
        </div>
      </td>,
      <td key="type" className="rs-hidden-sm">
        {item.type}
      </td>,
      <td key="size" className="rs-hidden-sm">
        {UnitsHelper.parseSizeAuto(item.size)}
      </td>,
      <td key="actions">
        <ActionButtons value={{ image: item, index: i }} onDelete={this.onImageRemove} />
      </td>,
    ];
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
    return (
      <div className="gallery-images panel-wrapper">
        <div className="header">
          <div className="pull-left">
            <h5>
              <Translation message="Images" />
            </h5>
          </div>
          <div className="pull-right">
            <IconButton icon={<Icon icon="plus-square" />} appearance="primary" onClick={this.addImages}>
              <Translation message="Add Images" />
            </IconButton>
          </div>
          <div className="clearfix" />
        </div>
        <Panel bordered={true}>
          <TableSortDnD
            items={this.getImages()}
            idKey="_id"
            onDragEnd={this.onDragEnd}
            renderTableHead={this.getTableHeader}
            renderRowCells={this.getRowCells}
            applyDefaultDraggableStyle={true}
            applyDraggableStyle={this.applyDraggableStyle}
          />
        </Panel>
        <UploadSelect
          ref={this.uploadSelect}
          onFileSelect={this.onFileSelect}
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
