import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { computed, get } from 'mobx';
import {
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DraggableRubric,
} from 'react-beautiful-dnd';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import { ColumnProps } from './Column';
import { ElementProps } from '../core/ViewComponent';
import TableHeaderCell, { TableHeaderCellProps } from './TableHeaderCell';
import TableContext from './TableContext';
import { ColumnLock ,DragColumnAlign} from './enum';
import DataSet from '../data-set/DataSet';
import { getColumnKey } from './utils';
import ColumnGroup from './ColumnGroup';
import autobind from '../_util/autobind';
import {instance} from './Table';
import { DRAG_KEY } from './TableStore';

export interface TableHeaderProps extends ElementProps {
  dataSet: DataSet;
  lock?: ColumnLock | boolean;
  dragColumnAlign?:DragColumnAlign;
}

@observer
export default class TableHeader extends Component<TableHeaderProps, any> {
  static displayName = 'TableHeader';

  static propTypes = {
    prefixCls: PropTypes.string,
    lock: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf([ColumnLock.right, ColumnLock.left]),
    ]),
    dragColumnAlign:PropTypes.oneOf([DragColumnAlign.right, DragColumnAlign.left]),
  };

  static contextType = TableContext;

  node: HTMLTableSectionElement | null;

  @autobind
  saveRef(node) {
    this.node = node;
  }

  @autobind
  getHeaderNode() {
    return this.node;
  }

  render() {
    const { prefixCls, lock, dataSet } = this.props;
    const { groupedColumns } = this;
    const {
      tableStore: { overflowY, columnResizable },
    } = this.context;
    const rows = this.getTableHeaderRows(groupedColumns);

    const trs = rows.map((row, rowIndex) => {
      if (row.length) {
        let prevColumn: ColumnProps | undefined;
        const tds = row.map(({ hidden, column, rowSpan, colSpan, lastLeaf },index) => {
          if (!hidden) {
            const props: TableHeaderCellProps = {
              key: getColumnKey(column),
              prefixCls,
              dataSet,
              prevColumn,
              column,
              resizeColumn: lastLeaf,
              getHeaderNode: this.getHeaderNode,
            };
            if (rowSpan > 1) {
              props.rowSpan = rowSpan;
            }
            if (colSpan > 1) {
              props.colSpan = colSpan;
            }
            prevColumn = lastLeaf;

            return (
            <Draggable
              draggableId={getColumnKey(column)}
              index={index}
              key={getColumnKey(column)}
            >
              {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot,
              ) => (
                <TableHeaderCell 
                  provided={provided}
                  snapshot={snapshot}
                  {...props} />
                )}
            </Draggable>
            )
            ;
          }
          return undefined;
        });
        if (overflowY && lock !== ColumnLock.left && rowIndex === 0) {
          tds.push(
            <th key="fixed-column" className={`${prefixCls}-cell`} rowSpan={rows.length}>
              &nbsp;
            </th>,
          );
        }
        return (
        <Droppable
        droppableId="tableHeader"
        key="tableHeader"
        direction="horizontal"
        renderClone={(
          provided: DraggableProvided,
          snapshot: DraggableStateSnapshot,
          rubric: DraggableRubric,
        ) => {
          const rowProps = row[rubric.source.index]
          const {  column, rowSpan, colSpan, lastLeaf } = rowProps;
          const props: TableHeaderCellProps = {
            key: getColumnKey(column),
            prefixCls,
            dataSet,
            prevColumn,
            column,
            resizeColumn: lastLeaf,
            getHeaderNode: this.getHeaderNode,
          };
          if (rowSpan > 1) {
            props.rowSpan = rowSpan;
          }
          if (colSpan > 1) {
            props.colSpan = colSpan;
          }
          return (
            <TableHeaderCell
              provided={provided}
              snapshot={snapshot}
             {...props} />
          );
        }}
        getContainerForClone={() => instance.headtr}
      >
        {(droppableProvided: DroppableProvided) => (
          <tr
            key={String(rowIndex)}
            style={{
              height: lock ? this.getHeaderRowStyle(rows, rowIndex, columnResizable) : undefined,
            }}
            ref={(ref:HTMLElement) => {
              if(ref){
                this.saveRef(ref)
                droppableProvided.innerRef(ref);
              }
            }}
            {...droppableProvided.droppableProps}
          >
            {tds}
            {droppableProvided.placeholder}
          </tr>
           )}
          </Droppable>
        );
      }
      return undefined;
    });
    const classString = classNames(`${prefixCls}-thead`, {
      [`${prefixCls}-column-resizable`]: columnResizable,
    });
    return (
      <thead ref={this.saveRef} className={classString}>
        {trs}
      </thead>
    );
  }

  getTableHeaderRows(
    columns: ColumnGroup[],
    currentRow: number = 0,
    rows: ColumnGroup[][] = [],
  ): ColumnGroup[][] {
    rows[currentRow] = rows[currentRow] || [];
    columns.forEach(column => {
      const { hidden, rowSpan, colSpan, children } = column;
      if (!hidden) {
        if (rowSpan && rows.length < rowSpan) {
          while (rows.length < rowSpan) {
            rows.push([]);
          }
        }
        if (children) {
          this.getTableHeaderRows(children.columns, currentRow + rowSpan, rows);
        }
        if (colSpan !== 0) {
          rows[currentRow].push(column);
        }
      }
    });
    return rows;
  }

  getHeaderRowStyle(
    rows: ColumnGroup[][],
    rowIndex: number,
    columnResizable: boolean,
  ): string | number | undefined {
    const {
      tableStore: { rowHeight },
    } = this.context;
    const height = rowHeight === 'auto' ? this.getRowHeight(rowIndex++) : rowHeight;
    return pxToRem(
      rows
        .slice(rowIndex)
        .reduce(
          (total, r, index) =>
            r.length
              ? total
              : total +
                (rowHeight === 'auto'
                  ? this.getRowHeight(index + rowIndex)
                  : rowHeight + (columnResizable ? 4 : 3)),
          height,
        ),
    );
  }

  getRowHeight(index): number {
    const { tableStore } = this.context;
    return get(tableStore.lockColumnsHeadRowsHeight, index) || 0;
  }

  @computed
  get groupedColumns(): ColumnGroup[] {
    const { tableStore } = this.context;
    const { lock } = this.props;
    switch (lock) {
      case ColumnLock.left:
      case true:
        return tableStore.leftGroupedColumns;
      case ColumnLock.right:
        return tableStore.rightGroupedColumns;
      default:
        return tableStore.groupedColumns;
    }
  }
}
