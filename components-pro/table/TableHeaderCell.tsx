import React, { cloneElement, Component, CSSProperties, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { action, set } from 'mobx';
import { observer } from 'mobx-react';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import defaultTo from 'lodash/defaultTo';
import isString from 'lodash/isString';
import classes from 'component-classes';
import {
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import { ColumnProps, minColumnWidth } from './Column';
import TableContext from './TableContext';
import { ElementProps } from '../core/ViewComponent';
import Icon from '../icon';
import DataSet from '../data-set/DataSet';
import EventManager from '../_util/EventManager';
import { getAlignByField, getColumnKey, getHeader } from './utils';
import { ColumnAlign } from './enum';
import { ShowHelp } from '../field/enum';
import Tooltip from '../tooltip';
import autobind from '../_util/autobind';
import {SELECTION_KEY} from './TableStore'

export interface TableHeaderCellProps extends ElementProps {
  dataSet: DataSet;
  prevColumn?: ColumnProps;
  column: ColumnProps;
  resizeColumn?: ColumnProps;
  rowSpan?: number;
  colSpan?: number;
  getHeaderNode: () => HTMLTableSectionElement | null;
  snapshot: DraggableStateSnapshot,
  provided: DraggableProvided;
}

@observer
export default class TableHeaderCell extends Component<TableHeaderCellProps, any> {
  static displayName = 'TableHeaderCell';

  static propTypes = {
    column: PropTypes.object.isRequired,
  };

  static contextType = TableContext;

  resizeEvent: EventManager = new EventManager(typeof window !== 'undefined' && document);

  resizeBoundary: number = 0;

  resizePosition?: number;

  resizeColumn?: ColumnProps;

  @autobind
  handleClick() {
    const { column, dataSet } = this.props;
    const { name } = column;
    if (name) {
      dataSet.sort(name);
    }
  }

  getNode(column) {
    const { getHeaderNode } = this.props;
    const headerDom: Element | null = getHeaderNode();
    if (headerDom) {
      return headerDom.querySelector(`[data-index="${getColumnKey(column)}"]`);
    }
  }

  setResizeColumn(column) {
    this.resizeColumn = column;
    const node = this.getNode(column);
    if (node) {
      this.resizeBoundary = node.getBoundingClientRect().left;
    }
  }

  @autobind
  handleLeftResize(e) {
    const { prevColumn } = this.props;
    this.setResizeColumn(prevColumn);
    e.persist()
    this.setresizeStart(e);
  }

  @autobind
  handleRightResize(e) {
    const { resizeColumn } = this.props;
    this.setResizeColumn(resizeColumn);
    e.persist()
    this.setresizeStart(e);
  }

  private setresizeStart = debounce(
    (e) => {
      this.resizeStart(e)
    },
    300,
  );

  @autobind
  handleLeftDoubleClick(_e) {
    if(this.setresizeStart){
      this.setresizeStart.cancel()
      this.resizeDoubleClick()
    }
  }

  @autobind
  handleRightDoubleClick(_e) {
    if(this.setresizeStart){
      this.setresizeStart.cancel()
      this.resizeDoubleClick()
    }
  }

  @autobind
  @action
  resizeDoubleClick(): void {
    const column = this.resizeColumn;
    const {tableStore:{props:{autoMaxWidth}}} = this.context
    if (autoMaxWidth && column && column.innerMaxWidth) {
      if (column.innerMaxWidth !== column.width) {
        set(column, 'width', column.innerMaxWidth);
      }else if(column.minWidth){
          set(column, 'width', column.minWidth);
      }
    }
  }

  @action
  resizeStart(e): void {
    const { prefixCls } = this.props;
    const {
      tableStore: {
        node: { element },
      },
    } = this.context;
    classes(element).add(`${prefixCls}-resizing`);
    delete this.resizePosition;
    this.setSplitLinePosition(e.pageX);
    this.resizeEvent
      .addEventListener('mousemove', this.resize)
      .addEventListener('mouseup', this.resizeEnd);
  }

  @autobind
  resize(e): void {
    const column = this.resizeColumn;
    const limit = this.resizeBoundary + minColumnWidth(column);
    let left = e.pageX;
    if (left < limit) {
      left = limit;
    }
    this.resizePosition = this.setSplitLinePosition(left);
  }

  @autobind
  @action
  resizeEnd(): void {
    const { prefixCls } = this.props;
    const {
      tableStore: {
        node: { element },
      },
    } = this.context;
    classes(element).remove(`${prefixCls}-resizing`);
    this.resizeEvent.removeEventListener('mousemove').removeEventListener('mouseup');
    const column = this.resizeColumn;
    if (this.resizePosition && column) {
      const newWidth = Math.max(this.resizePosition - this.resizeBoundary, minColumnWidth(column));
      if (newWidth !== column.width) {
        set(column, 'width', newWidth);
      }
    }
  }

  @action
  setSplitLinePosition(left: number): number | undefined {
    const {
      tableStore: {
        node: { resizeLine },
      },
    } = this.context;
    const { left: rectLeft, width } = resizeLine.offsetParent.getBoundingClientRect();
    left -= rectLeft;
    if (left < 0) {
      left = 0;
    } else if (left >= width) {
      left = width - 1;
    }
    resizeLine.style.left = pxToRem(left) || null;
    return left + rectLeft;
  }

  renderResizer() {
    const { prevColumn, column, prefixCls } = this.props;
    const resizerPrefixCls = `${prefixCls}-resizer`;
    const pre = prevColumn && prevColumn.resizable && (
      <div
        key="pre"
        className={`${resizerPrefixCls} ${resizerPrefixCls}-left`}
        onDoubleClick={this.handleLeftDoubleClick}
        onMouseDown={this.handleLeftResize}
      />
    );
    const next = column.resizable && (
      <div
        key="next"
        className={`${resizerPrefixCls} ${resizerPrefixCls}-right`}
        onDoubleClick={this.handleRightDoubleClick}
        onMouseDown={this.handleRightResize}
      />
    );

    return [pre, next];
  }

  render() {
    const { column, prefixCls, dataSet, rowSpan, colSpan, provided  } = this.props;
    const {
      tableStore: { rowHeight, columnResizable,props:{dragColumn} },
    } = this.context;
    const sortPrefixCls = `${prefixCls}-sort`;
    const {
      headerClassName,
      headerStyle = {},
      sortable,
      name,
      align,
      help,
      showHelp,
      children,
      command,
    } = column;
    const classList: string[] = [`${prefixCls}-cell`];
    const field = dataSet.getField(name);
    if (headerClassName) {
      classList.push(headerClassName);
    }
    const headerNode = getHeader(column, dataSet);
    const innerProps: any = {
      className: `${prefixCls}-cell-inner`,
      children: [
        isValidElement(headerNode) ? (
          cloneElement(headerNode, { key: 'text' })
        ) : isString(headerNode) ? (
          <span key="text">{headerNode}</span>
        ) : (
          headerNode
        ),
      ],
    };
    const cellStyle: CSSProperties = {
      textAlign:
        align ||
        (command || (children && children.length) ? ColumnAlign.center : getAlignByField(field)),
      ...headerStyle,
    };
    if (rowHeight !== 'auto') {
      innerProps.style = {
        height: pxToRem(rowHeight),
      };
    }
    const dragIcon = (
        <Icon key="DragId" type="swap_horiz" className={`${prefixCls}-header-drag-icon`} />
    );
    if(column.key !== SELECTION_KEY && dragColumn){
      innerProps.children.push(dragIcon)
    }
    
    if (showHelp !== ShowHelp.none) {
      const fieldHelp = defaultTo(field && field.get('help'), help);
      if (fieldHelp) {
        const helpIcon = (
          <Tooltip title={fieldHelp} placement="bottom" key="help">
            <Icon type="help_outline" className={`${prefixCls}-help-icon`} />
          </Tooltip>
        );
        if (cellStyle.textAlign === ColumnAlign.right) {
          innerProps.children.unshift(helpIcon);
        } else {
          innerProps.children.push(helpIcon);
        }

      }
    }
    if (sortable && name) {
      if (field) {
        const { order } = field;
        if (order) {
          classList.push(`${sortPrefixCls}-${order}`);
        }
      }
      innerProps.onClick = this.handleClick;
      const icon = <Icon key="sort" type="arrow_upward" className={`${sortPrefixCls}-icon`} />;
      if (cellStyle.textAlign === ColumnAlign.right) {
        innerProps.children.unshift(icon);
      } else {
        innerProps.children.push(icon);
      }
    }
    return (
      <th
        className={classList.join(' ')}
        style={omit(cellStyle, ['width', 'height'])}
        rowSpan={rowSpan}
        ref= {(ref)=>{
          if(ref){
            provided.innerRef(ref)
          }
        }}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        colSpan={colSpan}
        data-index={getColumnKey(column)}
      >
        <div {...innerProps} />
        {columnResizable && this.renderResizer()}
      </th>
    );
  }

  componentWillUnmount() {
    this.resizeEvent.clear();
    this.setresizeStart.cancel();
  }
}
