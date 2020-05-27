import React from 'react';
import { IconButton, Icon, Popover, Whisper, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Translation from 'app/modules/core/ui/components/Translation';
import AdminConfigHelper from 'modules/core/ui/helpers/AdminConfigHelper';

class PageBlocks extends React.Component {
  constructor(props) {
    super(props);
    this.pagesStore = props.pagesStore;
    this.blocksPopover = null;
    this.state = {
      pageBlockMoving: false,
    };
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

  moveUp(index) {
    if (index > 0) {
      this.setState({ pageBlockMoving: true });
      setTimeout(() => {
        this.pagesStore.reorderBlocks(index, index - 1);
      }, 50);
      setTimeout(() => {
        this.setState({ pageBlockMoving: false });
      }, 1000);
    }
  }

  moveDown(index) {
    const { item } = this.props.pagesStore;
    if (index < item.blocks.length - 1) {
      this.setState({ pageBlockMoving: true });
      setTimeout(() => {
        this.pagesStore.reorderBlocks(index, index + 1);
      }, 50);
      setTimeout(() => {
        this.setState({ pageBlockMoving: false });
      }, 1000);
    }
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
            <Button size="sm" title="Move Up" onClick={this.moveUp.bind(this, index)}>
              <Icon icon="arrow-up" />
            </Button>
            <Button size="sm" title="Move Down" onClick={this.moveDown.bind(this, index)}>
              <Icon icon="arrow-down" />
            </Button>
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
        pageBlocks.push(this.getPageBlock(block, index));
      }
    });
    return pageBlocks;
  }

  render() {
    const { pageBlockMoving = false } = this.state;
    return (
      <div className="page-blocks-wrapper">
        {pageBlockMoving && (
          <div className="page-block-moving">
            <div className="spinner-cubes">
              <div className="cube1" />
              <div className="cube2" />
            </div>
          </div>
        )}
        <div className="page-blocks">{this.getPageBlocks()}</div>
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
