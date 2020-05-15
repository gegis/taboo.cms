import React from 'react';
import { IconButton, Icon, Popover, Whisper } from 'rsuite';
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
  }

  hideBlocksPopover() {
    this.blocksPopover.hide();
  }

  addBlock(block) {
    this.pagesStore.addBlock(block);
    this.hideBlocksPopover();
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

  getPageBlocks() {
    const blocksMap = AdminConfigHelper.getPageBlocksMap();
    const { item } = this.props.pagesStore;
    const pageBlocks = [];
    let BlockComponent;
    item.blocks.map((block, index) => {
      if (blocksMap[block.name] && blocksMap[block.name].configComponent) {
        BlockComponent = blocksMap[block.name].configComponent;
        pageBlocks.push(
          <div key={index} className="page-block">
            <div className="page-block-name">{block.name}</div>
            <div className="page-block-component">
              <BlockComponent {...block.props} setProps={this.setBlockProps.bind(this, index)} />
            </div>
            <div className="page-block-settings">delete, move</div>
          </div>
        );
      }
    });
    return pageBlocks;
  }

  render() {
    return (
      <div className="page-blocks-wrapper">
        <div className="page-blocks">{this.getPageBlocks()}</div>
        <div className="page-blocks-add-wrapper">
          <Whisper
            trigger="click"
            placement="bottomStart"
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
