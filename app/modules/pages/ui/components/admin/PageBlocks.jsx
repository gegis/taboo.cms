import React from 'react';
import { IconButton, Icon, Popover, Whisper, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import Translation from 'app/modules/core/ui/components/Translation';
import AdminConfigHelper from 'modules/core/ui/helpers/AdminConfigHelper';

const SortableHandle = sortableHandle(({ children }) => <span>{children}</span>);
const SortableItem = sortableElement(({ item }) => <div className="sortable-item">{item}</div>);
const SortableContainer = sortableContainer(({ children }) => <div className="sortable-container">{children}</div>);

class PageBlocks extends React.Component {
  constructor(props) {
    super(props);
    this.pagesStore = props.pagesStore;
    this.blocksPopover = null;
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  hideBlocksPopover() {
    this.blocksPopover.hide();
  }

  addBlock(block) {
    this.pagesStore.addBlock(block);
    this.hideBlocksPopover();
  }

  deleteBlock(index) {
    this.pagesStore.deleteBlock(index);
  }

  getBlocksPopover() {
    const blocks = AdminConfigHelper.getPageBlocks();
    return (
      <Popover className="page-blocks-select-popover">
        {blocks.map((block, i) => (
          <IconButton key={i} icon={block.icon} appearance="default" onClick={this.addBlock.bind(this, block)}>
            {block.name}
          </IconButton>
        ))}
      </Popover>
    );
  }

  setBlockProps(index, blockProps) {
    this.pagesStore.setBlockProps(index, blockProps);
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.pagesStore.reorderBlocks(oldIndex, newIndex);
  }

  getPageBlock(block, index) {
    const blocksMap = AdminConfigHelper.getPageBlocksMap();
    const PreviewComponent = blocksMap[block.name].previewComponent;
    let ActionsComponent = null;
    if (blocksMap[block.name].actionsComponent) {
      ActionsComponent = blocksMap[block.name].actionsComponent;
    }
    return (
      <div key={index} className="page-block">
        <div className="page-block-header">
          <div className="page-block-name">{block.name}</div>
          <div className="page-block-actions">
            {ActionsComponent && <ActionsComponent {...block.props} setProps={this.setBlockProps.bind(this, index)} />}
            <Button size="sm" color="red" title="Delete" onClick={this.deleteBlock.bind(this, index)}>
              <Icon icon="trash-o" />
            </Button>
            <SortableHandle>
              <span className="rs-btn rs-btn-subtle rs-btn-sm" title="Change sort order">
                <Icon icon="sequence" />
              </span>
            </SortableHandle>
          </div>
          <div className="clearfix" />
        </div>
        <div className="page-block-preview">
          <PreviewComponent {...block.props} setProps={this.setBlockProps.bind(this, index)} />
        </div>
      </div>
    );
  }

  getPageBlocks() {
    const blocksMap = AdminConfigHelper.getPageBlocksMap();
    const { item } = this.props.pagesStore;
    const pageBlocks = [];
    item.blocks.map((block, index) => {
      if (blocksMap[block.name] && blocksMap[block.name].previewComponent) {
        pageBlocks.push(<SortableItem key={index} item={this.getPageBlock(block, index)} index={index} />);
      }
    });
    return pageBlocks;
  }

  render() {
    return (
      <div className="page-blocks-wrapper">
        <div className="page-blocks">
          <SortableContainer onSortEnd={this.onSortEnd} useDragHandle helperClass="sortable-helper">
            {this.getPageBlocks()}
          </SortableContainer>
        </div>
        <div className="page-blocks-add-wrapper pull-right">
          <Whisper
            trigger="click"
            placement="bottomEnd"
            speaker={this.getBlocksPopover()}
            triggerRef={ref => {
              this.blocksPopover = ref;
            }}
          >
            <IconButton icon={<Icon icon="plus-square" />} appearance="default">
              <Translation message="Add Block" />
            </IconButton>
          </Whisper>
        </div>
      </div>
    );
  }
}

PageBlocks.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesStore', 'localeStore', 'templatesStore'), observer);

export default enhance(PageBlocks);
