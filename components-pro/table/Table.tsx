import React, { MouseEventHandler, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import raf from 'raf';
import { observer } from 'mobx-react';
import omit from 'lodash/omit';
import isNumber from 'lodash/isNumber';
import isUndefined from 'lodash/isUndefined';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import noop from 'lodash/noop';
import classes from 'component-classes';
import { action } from 'mobx';
import { 
  DragDropContext,
  DropResult,
  ResponderProvided,
  DroppableProps, 
  DraggableProps,
  DraggableRubric,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { getConfig, getProPrefixCls } from 'choerodon-ui/lib/configure';
import warning from 'choerodon-ui/lib/_util/warning';
import { pxToRem, toPx } from 'choerodon-ui/lib/_util/UnitConvertor';
import measureScrollbar from 'choerodon-ui/lib/_util/measureScrollbar';
import KeyCode from 'choerodon-ui/lib/_util/KeyCode';
import ReactResizeObserver from 'choerodon-ui/lib/_util/resizeObserver';
import Column, { ColumnProps, defaultMinWidth } from './Column';
import TableRow,{TableRowProps} from './TableRow';
import TableHeaderCell,{TableHeaderCellProps} from './TableHeaderCell';
import DataSet from '../data-set/DataSet';
import Record from '../data-set/Record';
import TableStore,{DRAG_KEY} from './TableStore';
import TableHeader from './TableHeader';
import autobind from '../_util/autobind';
import Pagination, { PaginationProps } from '../pagination/Pagination';
import Spin, { SpinProps } from '../spin';
import DataSetComponent, { DataSetComponentProps } from '../data-set/DataSetComponent';
import TableContext from './TableContext';
import TableWrapper from './TableWrapper';
import TableTBody from './TableTBody';
import TableFooter from './TableFooter';
import {
  ColumnLock,
  ScrollPosition,
  SelectionMode,
  TableButtonType,
  TableCommandType,
  TableEditMode,
  TableMode,
  TablePaginationPosition,
  TableQueryBarType,
  TableAutoHeightType,
  DragColumnAlign,
} from './enum';
import Switch from '../switch/Switch';
import Tooltip from '../tooltip/Tooltip';
import { $l } from '../locale-context';
import TableQueryBar from './query-bar';
import FilterBar from './query-bar/TableFilterBar';
import AdvancedQueryBar from './query-bar/TableAdvancedQueryBar';
import ToolBar from './query-bar/TableToolBar';
import { findIndexedSibling, getHeight, getPaginationPosition } from './utils';
import { ButtonProps } from '../button/Button';
import TableBody from './TableBody';

export type TableButtonProps = ButtonProps & { afterClick?: MouseEventHandler<any>; };

export type Buttons =
  | TableButtonType
  | [TableButtonType, TableButtonProps]
  | ReactElement<TableButtonProps>;

export interface TableQueryBarHookProps {
  dataSet: DataSet;
  queryDataSet?: DataSet;
  buttons: ReactElement<ButtonProps>[];
  queryFields: ReactElement<any>[];
  queryFieldsLimit: number;
  pagination?: ReactElement<PaginationProps>;
}

export interface expandedRowRendererProps {
  dataSet: DataSet;
  record: Record;
}

export interface expandIconProps {
  prefixCls?: string;
  expanded: boolean;
  onExpand: Function;
  record: Record;
  expandable: boolean;
  needIndentSpaced: boolean;
}

export interface onRowProps {
  dataSet: DataSet;
  record: Record;
  index: number;
  expandedRow: boolean;
}

export type TableQueryBarHook = (props: TableQueryBarHookProps) => ReactNode;
export type Commands =
  | TableCommandType
  | [TableCommandType, TableButtonProps]
  | ReactElement<TableButtonProps>;

export const buttonsEnumType = PropTypes.oneOf([
  TableButtonType.add,
  TableButtonType.save,
  TableButtonType.remove,
  TableButtonType.delete,
  TableButtonType.reset,
  TableButtonType.query,
  TableButtonType.export,
  TableButtonType.expandAll,
  TableButtonType.collapseAll,
]);

export interface TablePaginationConfig extends PaginationProps {
  position?: TablePaginationPosition;
}

export type SpinIndicator = ReactElement<any>;

export interface TableSpinConfig extends SpinProps {
  spinning?: boolean;
  indicator?: SpinIndicator;
}

export interface Instance {
  tbody:React.ReactElement;
  headtr:React.ReactElement;
}

export interface DragTableHeaderCellProps extends TableHeaderCellProps{
  rubric: DraggableRubric
}
export interface DragTableRowProps extends TableRowProps {
  rubric: DraggableRubric
}
export type DragRenderClone = (DragTableRowProps | DragTableHeaderCellProps)

export type DragIconRender = ({column:ColumnProps,dataSet:DataSet,snapshot:DraggableStateSnapshot} | {record: Record})

export interface DragRender {
  droppableProps: DroppableProps;
  draggableProps: DraggableProps;
  renderClone: (dragRenderProps:DragRenderClone) => ReactElement<any>;
  renderIcon: (DragIconRender) => ReactElement<any>;
};

let _instance;
// 构造一个单例table来防止body下不能有table元素的报错
export const instance = () :Instance => {
  // Using a table as the portal so that we do not get react
  // warnings when mounting a tr element
  const _tableContain = ():Instance => {
    const table: HTMLElement = document.createElement('table');
      table.classList.add(`${getProPrefixCls('table')}-drag-container`);
      const thead: HTMLElement = document.createElement('thead');
      thead.classList.add(`${getProPrefixCls('table')}-thead`)
      table.appendChild(thead);
      const headtr: HTMLElement = document.createElement('tr');
      thead.appendChild(headtr);
      const tbody: HTMLElement = document.createElement('tbody');
      tbody.classList.add(`${getProPrefixCls('table')}-tbody`)
      table.appendChild(tbody);
      if (!document.body) {
        throw new Error('document.body required a body to append');
      }
    document.body.appendChild(table);
    return {
      // @ts-ignore
      tbody,
      // @ts-ignore
      headtr,
    }
  }
  if(_instance){
    return _instance 
  }
  return _instance = _tableContain()
};

export interface TableProps extends DataSetComponentProps {
  columns?: ColumnProps[];
  /**
   * 表头
   */
  header?: ReactNode | ((records: Record[]) => ReactNode);
  /**
   * 表脚
   */
  footer?: ReactNode | ((records: Record[]) => ReactNode);
  /**
   * 是否显示边框
   * @default true
   */
  border?: boolean;
  /**
   * 数据源
   */
  dataSet: DataSet;
  /**
   * 选择记录的模式
   */
  selectionMode?: SelectionMode;
  /**
   * 在其他模式下是不是要是要rowbox
   */
  alwaysShowRowBox?: boolean;
  /**
   * 设置行属性
   * @param {onRowProps} props
   * @return {Object} 行属性
   */
  onRow?: (props: onRowProps) => object;
  /**
   * @deprecated
   * 请使用 onRow
   */
  rowRenderer?: (record: Record, index: number) => object;
  /**
   * 功能按钮
   * 可选值：`add` `delete` `remove` `save` `query` `reset` `expandAll` `collapseAll` `export` 或 自定义按钮
   * 给内置按钮加属性：buttons={[['add', { color: 'red' }], ...]}
   */
  buttons?: Buttons[];
  /**
   * 自定义查询字段组件
   * @example
   * { age: <NumberField /> }
   *
   * 默认会根据queryDataSet中定义的field类型自动匹配组件， 匹配类型如下
   * lovCode => Lov
   * lookupCode => Select
   * type:number => NumberField
   * type:date => DatePicker
   * type:dateTime => DatePicker[mode=dateTime]
   * type:week => DatePicker[mode=week]
   * default => TextField
   */
  queryFields?: { [key: string]: ReactElement<any>; };
  /**
   * 头部显示的查询字段的数量，超出限制的查询字段放入弹出窗口
   * @default 1
   */
  queryFieldsLimit?: number;
  /**
   * 显示查询条
   * 可选值: `advancedBar` `normal` `bar` `none`
   * @default 'normal'
   */
  queryBar?: TableQueryBarType | TableQueryBarHook;
  /**
   * 是否使用拖拽选择
   * @default false
   */
  useMouseBatchChoose?: boolean;
  /**
   * @deprecated
   * 请使用 queryBar="none"
   */
  showQueryBar?: boolean;
  /**
   * 行高
   * @default 31
   */
  rowHeight?: number | 'auto';
  /**
   * 默认行是否展开，当dataSet没有设置expandField时才有效
   * @default false;
   */
  defaultRowExpanded?: boolean;
  /**
   * 通过点击行来展开子行
   */
  expandRowByClick?: boolean;
  /**
   * 展开行渲染器
   */
  expandedRowRenderer?: (props: expandedRowRendererProps) => ReactNode;
  /**
   * 自定义展开图标
   */
  expandIcon?: (props: expandIconProps) => ReactNode;
  /**
   * 展开图标所在列索引
   */
  expandIconColumnIndex?: number;
  /**
   * 展示树形数据时，每层缩进的宽度
   */
  indentSize?: number;
  /**
   * 数据过滤
   * 返回值 true - 显示 false - 不显示
   * @param {Record} record 记录
   * @return {boolean}
   */
  filter?: (record: Record) => boolean;
  /**
   * 表格展示的模式
   * tree需要配合dataSet的`idField`和`parentField`来展示
   * 可选值: `list` `tree`
   */
  mode?: TableMode;
  /**
   * 表格编辑的模式
   * 可选值: `cell` `inline`
   * @default cell
   */
  editMode?: TableEditMode;
  /**
   * queryBar为bar时，直接输入的过滤条件的字段名
   */
  filterBarFieldName?: string;
  /**
   * queryBar为bar时输入框的占位符
   */
  filterBarPlaceholder?: string;
  /**
   * 分页导航条属性
   */
  pagination?: TablePaginationConfig | false;
  /**
   * 高亮行
   */
  highLightRow?: boolean;
  /**
   * 勾选高亮行
   */
  selectedHighLightRow?: boolean;
  /**
   * 可调整列宽
   */
  columnResizable?: boolean;
  /**
   * 显示原始值
   */
  pristine?: boolean;
  /**
   * 点击展开图标时触发
   */
  onExpand?: (expanded: boolean, record: Record) => void;
  /**
   * 加载条属性
   */
  spin?: TableSpinConfig | false;
  /**
   * 虚拟滚动
   */
  virtual?: boolean;
  /**
   * 虚拟滚动是否显示加载
   */
  virtualSpin?: boolean;

  /**
   * 是否开启自适应高度
   */
  autoHeight?: boolean | { type: TableAutoHeightType, diff: number };
  /**
   * 是否开启宽度双击最大值
   */
  autoMaxWidth?: boolean;
  /**
   * 设置drag框体位置
   */
  dragColumnAlign?: DragColumnAlign;
  /**
   * 开启列拖拽，但是无法使用宽度拖拽
   */
  dragColumn?: boolean;
  /**
   * 开启行拖拽
   */
  dragRow?: boolean;
  /**
   * 拖拽触发事件
   */
  onDragEnd?:(dataSet:DataSet,columns:ColumnProps[],resultDrag: DropResult, provided: ResponderProvided) => void
  /**
   * 渲染列拖拽
   */
  columnsDragRender?:DragRender;
  /**
   * 渲染行拖拽
   */
  rowDragRender?:DragRender;
}

@observer
export default class Table extends DataSetComponent<TableProps> {
  static displayName = 'Table';

  static Column = Column;

  static FilterBar = FilterBar;

  static AdvancedQueryBar = AdvancedQueryBar;

  static ToolBar = ToolBar;

  static TableRow = TableRow;

  static TableHeaderCell = TableHeaderCell;

  static propTypes = {
    columns: PropTypes.array,
    /**
     * 表头
     */
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * 表脚
     */
    footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * 是否显示边框
     * @default true
     */
    border: PropTypes.bool,
    /**
     * 功能按钮
     * 可选值：`add` `delete` `remove` `save` `query` `expandAll` `collapseAll` 或 自定义按钮
     */
    buttons: PropTypes.arrayOf(
      PropTypes.oneOfType([
        buttonsEnumType,
        PropTypes.arrayOf(PropTypes.oneOfType([buttonsEnumType, PropTypes.object])),
        PropTypes.node,
      ]),
    ),
    /**
     * 自定义查询字段组件
     * 默认会根据queryDataSet中定义的field类型自动匹配组件， 匹配类型如下
     * lovCode => Lov
     * lookupCode => Select
     * type:number => NumberField
     * type:date => DatePicker
     * type:dateTime => DatePicker[mode=dateTime]
     * type:week => DatePicker[mode=week]
     * default => TextField
     */
    queryFields: PropTypes.object,
    /**
     * 头部显示的查询字段的数量，超出限制的查询字段放入弹出窗口
     * @default 1
     */
    queryFieldsLimit: PropTypes.number,
    /**
     * 显示查询条
     * @default true
     */
    queryBar: PropTypes.oneOfType([
      PropTypes.oneOf([
        TableQueryBarType.advancedBar,
        TableQueryBarType.normal,
        TableQueryBarType.bar,
        TableQueryBarType.none,
      ]),
      PropTypes.func,
    ]),
    useMouseBatchChoose: PropTypes.bool,
    /**
     * 行高
     * @default 30
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
    alwaysShowRowBox:PropTypes.bool,
    defaultRowExpanded: PropTypes.bool,
    expandRowByClick: PropTypes.bool,
    indentSize: PropTypes.number,
    filter: PropTypes.func,
    mode: PropTypes.oneOf([TableMode.list, TableMode.tree]),
    editMode: PropTypes.oneOf([TableEditMode.inline, TableEditMode.cell]),
    filterBarFieldName: PropTypes.string,
    filterBarPlaceholder: PropTypes.string,
    highLightRow: PropTypes.bool,
    selectedHighLightRow: PropTypes.bool,
    autoMaxWidth: PropTypes.bool,
    /**
     * 设置drag框体位置
     */
    dragColumnAlign: PropTypes.oneOf([DragColumnAlign.left, DragColumnAlign.right]),
    /**
     * 开启列拖拽，但是无法使用宽度拖拽
     */
    dragColumn: PropTypes.bool,
    /**
     * 开启行拖拽
     */
  dragRow: PropTypes.bool,
    ...DataSetComponent.propTypes,
  };

  static defaultProps = {
    suffixCls: 'table',
    tabIndex: 0,
    selectionMode: SelectionMode.rowbox,
    queryFields: {},
    defaultRowExpanded: false,
    expandRowByClick: false,
    indentSize: 15,
    filterBarFieldName: 'params',
    virtual: false,
    virtualSpin: false,
    autoHeight: false,
    autoMaxWidth:false,
    dragRow:false,
    dragColumn:false,
  };

  tableStore: TableStore = new TableStore(this);

  nextFrameActionId?: number;

  scrollId?: number;

  resizeLine: HTMLDivElement | null;

  tableHeadWrap: HTMLDivElement | null;

  tableBodyWrap: HTMLDivElement | null;

  tableFootWrap: HTMLDivElement | null;

  fixedColumnsBodyLeft: HTMLDivElement | null;

  fixedColumnsBodyRight: HTMLDivElement | null;

  dragColumnsBodyLeft: HTMLDivElement | null;

  dragColumnsBodyRight: HTMLDivElement | null;

  lastScrollLeft: number;

  lastScrollTop: number;

  scrollPosition: ScrollPosition;

  refUpperPlaceholder: Array<HTMLDivElement | null> = [];

  refUnderPlaceholder: Array<HTMLDivElement | null> = [];

  refSpin: HTMLDivElement | null = null;

  refScroll: HTMLDivElement | null = null;

  get currentRow(): HTMLTableRowElement | null {
    return this.element.querySelector(
      `.${this.prefixCls}-row-current`,
    ) as HTMLTableRowElement | null;
  }

  get firstRow(): HTMLTableRowElement | null {
    return this.element.querySelector(
      `.${this.prefixCls}-row:first-child`,
    ) as HTMLTableRowElement | null;
  }

  get lastRow(): HTMLTableRowElement | null {
    return this.element.querySelector(
      `.${this.prefixCls}-row:last-child`,
    ) as HTMLTableRowElement | null;
  }

  @autobind
  saveResizeRef(node: HTMLDivElement | null) {
    this.resizeLine = node;
  }

  @autobind
  @action
  handleSwitchChange(value) {
    this.tableStore.showCachedSeletion = !!value;
  }

  @autobind
  handleResize(width: number) {
    const { element, tableStore } = this;
    if (!element.offsetParent) {
      tableStore.styledHidden = true;
    } else if (!tableStore.hidden) {
      this.syncSizeInFrame(width);
    } else {
      tableStore.styledHidden = false;
    }
  }

  @autobind
  handleDataSetLoad() {
    this.initDefaultExpandedRows();
  }

  @autobind
  handleDataSetCreate({ record, dataSet }) {
    const { tableStore } = this;
    if (tableStore.inlineEdit) {
      if (tableStore.currentEditRecord) {
        tableStore.currentEditRecord.reset();
        dataSet.remove(record);
      } else {
        tableStore.currentEditRecord = record;
      }
    }
  }

  @autobind
  handleKeyDown(e) {
    const { tableStore } = this;
    if (!tableStore.editing) {
      try {
        const { dataSet } = this.props;
        switch (e.keyCode) {
          case KeyCode.UP:
            this.handleKeyDownUp(e);
            break;
          case KeyCode.DOWN:
            this.handleKeyDownDown(e);
            break;
          case KeyCode.RIGHT:
            this.handleKeyDownRight(e);
            break;
          case KeyCode.LEFT:
            this.handleKeyDownLeft(e);
            break;
          case KeyCode.PAGE_UP:
            e.preventDefault();
            dataSet.prePage();
            break;
          case KeyCode.PAGE_DOWN:
            e.preventDefault();
            dataSet.nextPage();
            break;
          case KeyCode.HOME:
            this.handleKeyDownHome(e);
            break;
          case KeyCode.END:
            this.handleKeyDownEnd(e);
            break;
          default:
        }
      } catch (error) {
        warning(false, error.message);
      }
    }
    const { onKeyDown = noop } = this.props;
    onKeyDown(e);
  }

  focusRow(row: HTMLTableRowElement | null) {
    if (row) {
      const { index } = row.dataset;
      if (index) {
        const { dataSet } = this.props;
        const record = dataSet.findRecordById(index);
        if (record) {
          dataSet.current = record;
        }
      }
    }
  }

  async handleKeyDownHome(e) {
    e.preventDefault();
    const { dataSet } = this.props;
    if (!this.tableStore.isTree) {
      await dataSet.first();
    }
    this.focusRow(this.firstRow);
  }

  async handleKeyDownEnd(e) {
    e.preventDefault();
    const { dataSet } = this.props;
    if (!this.tableStore.isTree) {
      await dataSet.last();
    }
    this.focusRow(this.lastRow);
  }

  async handleKeyDownUp(e) {
    e.preventDefault();
    const { currentRow } = this;
    if (currentRow) {
      const previousElementSibling = findIndexedSibling(currentRow, -1);
      if (previousElementSibling) {
        this.focusRow(previousElementSibling);
      } else {
        const { dataSet } = this.props;
        await dataSet.prePage();
        this.focusRow(this.lastRow);
      }
    }
  }

  async handleKeyDownDown(e) {
    e.preventDefault();
    const { currentRow } = this;
    if (currentRow) {
      const nextElementSibling = findIndexedSibling(currentRow, 1);
      if (nextElementSibling) {
        this.focusRow(nextElementSibling);
      } else {
        const { dataSet } = this.props;
        await dataSet.nextPage();
        this.focusRow(this.firstRow);
      }
    }
  }

  handleKeyDownRight(e) {
    const {
      tableStore,
      props: { expandedRowRenderer, dataSet },
    } = this;
    if (tableStore.isTree || expandedRowRenderer) {
      const { current } = dataSet;
      if (current) {
        e.preventDefault();
        tableStore.setRowExpanded(current, true);
      }
    }
  }

  handleKeyDownLeft(e) {
    const {
      tableStore,
      props: { expandedRowRenderer, dataSet },
    } = this;
    if (tableStore.isTree || expandedRowRenderer) {
      const { current } = dataSet;
      if (current) {
        e.preventDefault();
        tableStore.setRowExpanded(current, false);
      }
    }
  }

  getOtherProps() {
    const otherProps = omit(super.getOtherProps(), [
      'columns',
      'header',
      'footer',
      'border',
      'style',
      'selectionMode',
      'alwaysShowRowBox',
      'onRow',
      'rowRenderer',
      'buttons',
      'rowHeight',
      'queryFields',
      'queryFieldsLimit',
      'queryBar',
      'defaultRowExpanded',
      'expandRowByClick',
      'expandedRowRenderer',
      'expandIconColumnIndex',
      'indentSize',
      'filter',
      'mode',
      'editMode',
      'filterBarFieldName',
      'filterBarPlaceholder',
      'pagination',
      'highLightRow',
      'selectedHighLightRow',
      'columnResizable',
      'pristine',
      'spin',
      'virtual',
      'virtualSpin',
      'autoHeight',
      'useMouseBatchChoose',
      'autoMaxWidth',
      'dragColumnAlign',
      'dragColumn',
      'dragRow',
      'onDragEnd',
    ]);
    otherProps.onKeyDown = this.handleKeyDown;
    const { rowHeight } = this.tableStore;
    if (rowHeight !== 'auto') {
      otherProps.style = { lineHeight: pxToRem(rowHeight) };
    }
    return otherProps;
  }

  getClassName(): string | undefined {
    const {
      prefixCls,
      tableStore: { border, rowHeight },
    } = this;
    return super.getClassName(`${prefixCls}-scroll-position-left`, {
      [`${prefixCls}-bordered`]: border,
      [`${prefixCls}-row-height-fixed`]: isNumber(rowHeight),
    });
  }

  getWrapperProps(props = {}) {
    const { style } = this.props;
    const { tableStore } = this;
    const newStyle: any = omit(style, ['width', 'height']);
    if (style && style.width !== undefined && style.width !== 'auto') {
      newStyle.width = Math.max(
        style.width as number,
        tableStore.leftLeafColumnsWidth + tableStore.rightLeafColumnsWidth + defaultMinWidth,
      );
    }
    return super.getWrapperProps({
      style: newStyle,
      ...props,
    });
  }

  /**
   * 获取传入的 Spin props
   */
  getSpinProps() {
    const { spin, dataSet } = this.props;
    if (spin && !isUndefined(spin.spinning)) return { ...spin };
    return {
      ...spin,
      dataSet,
    };
  }


  @autobind
  handleDragMouseUp() {
    const { dataSet, mouseBatchChooseIdList } = this.tableStore;
    if (this.tableStore.mouseBatchChooseState) {
      this.tableStore.mouseBatchChooseState = false;
      const { mouseBatchChooseStartId, mouseBatchChooseEndId } = this.tableStore;
      if (mouseBatchChooseStartId === mouseBatchChooseEndId) {
        return;
      }
      (mouseBatchChooseIdList || []).forEach((id: number) => {
        const record = dataSet.find((innerRecord) => innerRecord.id === id);
        if (record) {
          dataSet.select(record);
        }
      });
    }
  };

  componentWillMount() {
    super.componentWillMount();
    this.initDefaultExpandedRows();
    this.processDataSetListener(true);
  }

  componentDidMount() {
    this.syncSize();
    this.syncSizeInFrame();
    // 为什么使用 pointerup
    // 因为需要对disabled的元素进行特殊处理
    // 因为状态的改变依赖 mouseup 而在disabled的元素上 无法触发mouseup事件
    // 导致状态无法进行修正
    // 以下两种方案通过 pointer-events:none 进行处理
    // https://stackoverflow.com/questions/322378/javascript-check-if-mouse-button-down
    // https://stackoverflow.com/questions/62081666/the-event-of-the-document-is-not-triggered-when-it-is-on-a-disabled-element
    // 而使用指针事件可以突破disabled的限制
    // https://stackoverflow.com/questions/62126515/how-to-get-the-state-of-the-mouse-through-javascript/62127845#62127845
    document.addEventListener('pointerup', this.handleDragMouseUp);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    super.componentWillReceiveProps(nextProps, nextContext);
    this.processDataSetListener(false);
    this.tableStore.setProps(nextProps);
    this.processDataSetListener(true);
  }

  componentWillUnmount() {
    this.processDataSetListener(false);
    document.removeEventListener('pointerup', this.handleDragMouseUp);
  }

  processDataSetListener(flag: boolean) {
    const { isTree, dataSet, inlineEdit } = this.tableStore;
    if (dataSet) {
      const handler = flag ? dataSet.addEventListener : dataSet.removeEventListener;
      if (isTree) {
        handler.call(dataSet, 'load', this.handleDataSetLoad);
      }
      if (inlineEdit) {
        handler.call(dataSet, 'create', this.handleDataSetCreate);
      }
    }
  }

  render() {
    const {
      prefixCls,
      tableStore,
      tableStore: { overflowX, isAnyColumnsLeftLock, isAnyColumnsRightLock },
      props: {
        style,
        spin,
        virtual,
        virtualSpin,
        buttons,
        queryFields,
        queryFieldsLimit,
        filterBarFieldName,
        filterBarPlaceholder,
        dragColumnAlign,
        dragRow,
      },
    } = this;
    const content = this.getTable();
    const context = { tableStore };
    const pagination = this.getPagination(TablePaginationPosition.top);
    const tableSpinProps = getConfig('tableSpinProps');
    const styleHeight = style ? toPx(style.height) : 0;

    return (
      
      <ReactResizeObserver resizeProp="width" onResize={this.handleResize}>
        <div {...this.getWrapperProps()}>
          <TableContext.Provider value={context}>
            {this.getHeader()}
            <TableQueryBar
              prefixCls={prefixCls}
              buttons={buttons}
              pagination={pagination}
              queryFields={queryFields}
              queryFieldsLimit={queryFieldsLimit}
              filterBarFieldName={filterBarFieldName}
              filterBarPlaceholder={filterBarPlaceholder}
            />
            <Spin {...tableSpinProps} {...this.getSpinProps()} key="content">
              {virtual && <div
                ref={(node) => this.refSpin = node}
                style={{
                  display: 'none',
                }}
              >
                {virtualSpin && <Spin
                  key="virtual"
                  spinning
                  style={{
                    height: pxToRem(styleHeight),
                    lineHeight: pxToRem(styleHeight),
                    position: 'absolute',
                    width: '100%',
                    zIndex: 4,
                  }}
                  {...tableSpinProps}
                  {...spin}
                />}
              </div>}
              <div {...this.getOtherProps()}>
                <div className={`${prefixCls}-content`}>
                  {content}
                  {isAnyColumnsLeftLock && overflowX && this.getLeftFixedTable()}
                  {isAnyColumnsRightLock && overflowX && this.getRightFixedTable()}
                  {dragRow && dragColumnAlign === DragColumnAlign.left  && isAnyColumnsLeftLock && this.getLeftFixedTable(DragColumnAlign.left )}
                  {dragRow && dragColumnAlign === DragColumnAlign.right &&  isAnyColumnsRightLock && this.getRightFixedTable(DragColumnAlign.right )}
                  <div ref={this.saveResizeRef} className={`${prefixCls}-split-line`} />
                </div>
                {this.getFooter()}
              </div>
            </Spin>
            {this.getPagination(TablePaginationPosition.bottom)}
          </TableContext.Provider>
        </div>
      </ReactResizeObserver>
    );
  }

  @action
  reorderDataSet(dataset: DataSet, startIndex: number, endIndex: number){
    dataset.move(startIndex, endIndex)
  };

  @action
  reorderColumns(columns: ColumnProps[], startIndex: number, endIndex: number){
   const cloneColumns = columns.slice()
   const [dropItem] = cloneColumns.slice(endIndex, endIndex+1);
   const [dragItem] = cloneColumns.slice(startIndex, startIndex+1);
   const normalColumnLock = (lock) => {
     if(lock === true){
       return ColumnLock.left
     }
     if(!lock){
       return false
     }
     return lock
   }
   if( 
    dropItem && 
    dragItem && 
    dropItem.key !== DRAG_KEY && 
    dragItem.key !== DRAG_KEY && 
    normalColumnLock(dragItem.lock) === normalColumnLock(dropItem.lock)){
    const [removed] = columns.splice(startIndex, 1)
    if(columns.length ){
       columns.splice(endIndex, 0, removed);
    }
   }
  };

  @autobind
  onDragEnd(resultDrag: DropResult, provided: ResponderProvided) {
    const {onDragEnd}  = this.props
    if(resultDrag && resultDrag.destination){
      if (resultDrag.destination.droppableId === 'table') {
        this.reorderDataSet(
          this.tableStore.dataSet,
          resultDrag.source.index,
          resultDrag.destination.index,
        );
      }
      if(resultDrag.destination.droppableId === "tableHeader"){
        this.reorderColumns(
          this.tableStore.columns,
          resultDrag.source.index,
          resultDrag.destination.index,
        );
      }
    }
    if(onDragEnd){
      onDragEnd(this.tableStore.dataSet,this.tableStore.columns,resultDrag,provided)
    }
  }

  @autobind
  handleBodyScroll(e: React.SyntheticEvent) {
    if (this.scrollId !== undefined) {
      raf.cancel(this.scrollId);
    }
    const { currentTarget } = e;
    e.persist();
    this.scrollId = raf(() => {
      this.handleBodyScrollTop(e, currentTarget);
      this.handleBodyScrollLeft(e, currentTarget);
    });
  }

  /**
   * 滚动结束隐藏spin
   */
  setSpin = debounce(() => {
    this.refSpin!.style.display = 'none';
  }, 300);

  handleBodyScrollTop(e, currentTarget) {
    const { target } = e;
    const {
      tableStore: { rowHeight, height },
      observableProps: { dataSet },
      props: { virtual },
    } = this;
    if (
      this.tableStore.height === undefined ||
      currentTarget !== target ||
      target === this.tableFootWrap
    ) {
      return;
    }
    const fixedColumnsBodyLeft = this.fixedColumnsBodyLeft;
    const dragColumnsBodyLeft = this.dragColumnsBodyLeft
    const bodyTable = this.tableBodyWrap;
    const fixedColumnsBodyRight = this.fixedColumnsBodyRight;
    const dragColumnsBodyRight = this.dragColumnsBodyRight; 
    const { scrollTop } = target;
    if (scrollTop !== this.lastScrollTop) {
      if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
        fixedColumnsBodyLeft.scrollTop = scrollTop;
      }
      if (bodyTable && target !== bodyTable) {
        bodyTable.scrollTop = scrollTop;
      }
      if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
        fixedColumnsBodyRight.scrollTop = scrollTop;
      }

      if (dragColumnsBodyLeft && target !== dragColumnsBodyLeft) {
        dragColumnsBodyLeft.scrollTop = scrollTop;
      }

      if (dragColumnsBodyRight && target !== dragColumnsBodyRight) {
        dragColumnsBodyRight.scrollTop = scrollTop;
      }

      if (virtual) {
        this.refSpin!.style.display = 'block';
        this.setSpin();
      }
    }
    if (virtual) {
      const startIndex = Math.max(Math.round((scrollTop / Number(rowHeight)) - 3), 0);
      const endIndex = Math.min(Math.round((scrollTop + height) / Number(rowHeight) + 2), dataSet.length);
      this.refUpperPlaceholder.map(upperNode => {
        if (upperNode) {
          upperNode.style.height = `${startIndex * Number(rowHeight)}px`;
          upperNode.style.display = startIndex === 0 ? 'none' : 'block';
        }
        return null;
      });
      this.refUnderPlaceholder.map(underNode => {
        if (underNode) {
          underNode.style.display = endIndex === dataSet.length ? 'none' : 'block';
        }
        return null;
      });
      this.tableStore.setLastScrollTop(scrollTop);
    }
    this.lastScrollTop = scrollTop;
  }

  handleBodyScrollLeft(e, currentTarget) {
    const { target } = e;
    const headTable = this.tableHeadWrap;
    const bodyTable = this.tableBodyWrap;
    const footTable = this.tableFootWrap;
    if (
      this.tableStore.overflowX === undefined ||
      currentTarget !== target ||
      target === this.fixedColumnsBodyRight ||
      target === this.fixedColumnsBodyLeft
    ) {
      return;
    }
    const { scrollLeft } = target;
    if (scrollLeft !== this.lastScrollLeft) {
      if (headTable && target !== headTable) {
        headTable.scrollLeft = scrollLeft;
      }
      if (bodyTable && target !== bodyTable) {
        bodyTable.scrollLeft = scrollLeft;
      }
      if (footTable && target !== footTable) {
        footTable.scrollLeft = scrollLeft;
      }
      this.setScrollPositionClassName(target);
    }
    this.lastScrollLeft = scrollLeft;
  }

  setScrollPositionClassName(target?: any): void {
    if (this.tableStore.isAnyColumnsLock) {
      const node = target || this.tableBodyWrap;
      if (node) {
        const scrollToLeft = node.scrollLeft === 0;
        const table = node.querySelector('table');
        const scrollToRight = table && node.scrollLeft >= table.offsetWidth - node.offsetWidth;
        if (scrollToLeft && scrollToRight) {
          this.setScrollPosition(ScrollPosition.both);
        } else if (scrollToLeft) {
          this.setScrollPosition(ScrollPosition.left);
        } else if (scrollToRight) {
          this.setScrollPosition(ScrollPosition.right);
        } else {
          this.setScrollPosition(ScrollPosition.middle);
        }
      }
    }
  }

  setScrollPosition(position: ScrollPosition): void {
    if (this.scrollPosition !== position) {
      this.scrollPosition = position;
      const { prefixCls } = this;
      const cls = classes(this.element).remove(new RegExp(`^${prefixCls}-scroll-position-.+$`));
      if (position === ScrollPosition.both) {
        cls.add(`${prefixCls}-scroll-position-left`).add(`${prefixCls}-scroll-position-right`);
      } else {
        cls.add(`${prefixCls}-scroll-position-${position}`);
      }
    }
  }

  @autobind
  saveRef(node) {
    this.refScroll = node;
  }

  renderTable(
    hasHeader: boolean,
    hasBody: boolean,
    hasFooter: boolean,
    lock?: ColumnLock | boolean,
    dragColumnAlign?: DragColumnAlign,
  ): ReactNode {
    const {
      prefixCls,
      tableStore: { rowHeight, height },
      observableProps: { dataSet },
      props: { virtual },
    } = this;

    const virtualH = Math.round(dataSet.length * Number(rowHeight));

    return virtual && height ?
      (
        <>
          <TableWrapper
            prefixCls={prefixCls}
            key="tableWrapper-header"
            lock={lock}
            hasBody={false}
            hasHeader={hasHeader}
            hasFooter={false}
            dragColumnAlign={dragColumnAlign}
          >
            {hasHeader && this.getTableHeader(lock,dragColumnAlign)}
          </TableWrapper>
          {hasBody &&
            <div
              className={`${prefixCls}-tbody-wrapper`}
              style={{ height: virtualH }}
              ref={this.saveRef}
            >
              <div className='refUpperPlaceholder' style={{ display: 'none' }} ref={(node) => this.refUpperPlaceholder.push(node)} />
              <TableWrapper
                prefixCls={prefixCls}
                key="tableWrapper-body"
                lock={lock}
                hasBody={hasBody}
                hasHeader={false}
                hasFooter={false}
                dragColumnAlign={dragColumnAlign}
              >
                {hasBody && this.getTableBody(lock,dragColumnAlign)}
              </TableWrapper>
              <div className='refUnderPlaceholder' style={{ display: 'none' }} ref={(node) => this.refUnderPlaceholder.push(node)} />
            </div>}
          <TableWrapper
            prefixCls={prefixCls}
            key="tableWrapper-footer"
            lock={lock}
            hasBody={false}
            hasHeader={false}
            hasFooter={hasFooter}
            dragColumnAlign={dragColumnAlign}
          >
            {hasFooter && this.getTableFooter(lock,dragColumnAlign)}
          </TableWrapper>
        </>
      ) : (
        <TableWrapper
          prefixCls={prefixCls}
          key="tableWrapper"
          lock={lock}
          hasBody={hasBody}
          hasHeader={hasHeader}
          hasFooter={hasFooter}
          dragColumnAlign={dragColumnAlign}
        >
          {hasHeader && this.getTableHeader(lock,dragColumnAlign)}
          {hasBody && this.getTableBody(lock,dragColumnAlign)}
          {hasFooter && this.getTableFooter(lock,dragColumnAlign)}
        </TableWrapper>
      );
  }

  getHeader(): ReactNode {
    const {
      prefixCls,
      props: { header, dataSet },
    } = this;
    if (header) {
      const data = dataSet ? dataSet.records : [];
      return (
        <div key="header" className={`${prefixCls}-header`}>
          {typeof header === 'function' ? header(data) : header}
        </div>
      );
    }
  }

  getFooter(): ReactNode | undefined {
    const {
      prefixCls,
      props: { footer, dataSet },
    } = this;
    if (footer) {
      const data = dataSet ? dataSet.records : [];
      return (
        <div key="footer" className={`${prefixCls}-footer`}>
          {typeof footer === 'function' ? footer(data) : footer}
        </div>
      );
    }
  }

  getPagination(position: TablePaginationPosition): ReactElement<PaginationProps> | undefined {
    const {
      prefixCls,
      props: { dataSet },
      tableStore: { pagination },
    } = this;
    if (pagination !== false && dataSet && dataSet.paging) {
      const paginationPosition = getPaginationPosition(pagination);
      if (paginationPosition === TablePaginationPosition.both || paginationPosition === position) {
        const paginationProps = omit(pagination, 'position');
        return (
          <Pagination
            key={`pagination-${position}`}
            {...paginationProps}
            className={classNames(`${prefixCls}-pagination`, paginationProps.className)}
            dataSet={dataSet}
          >
            {this.getCacheSelectionSwitch()}
          </Pagination>
        );
      }
    }
  }

  getCacheSelectionSwitch() {
    const {
      props: { dataSet },
      prefixCls,
    } = this;
    if (dataSet && dataSet.cacheSelectionKeys && dataSet.cachedSelected.length) {
      const { showCachedSeletion } = this.tableStore;
      return (
        <Tooltip
          title={$l('Table', showCachedSeletion ? 'hide_cached_seletion' : 'show_cached_seletion')}
        >
          <Switch
            className={`${prefixCls}-switch`}
            checked={showCachedSeletion}
            onChange={this.handleSwitchChange}
          />
        </Tooltip>
      );
    }
  }

  getTable(lock?: ColumnLock | boolean,dragColumnAlign?:DragColumnAlign): ReactNode {
    const { prefixCls, props: { autoHeight } } = this;
    const { overflowX, height, hasFooter: footer } = this.tableStore;
    let tableHead: ReactNode;
    let tableBody: ReactNode;
    let tableFooter: ReactNode;
    if ((!dragColumnAlign && overflowX )|| height !== undefined || autoHeight) {
      const { lockColumnsBodyRowsHeight, rowHeight } = this.tableStore;
      let bodyHeight = height;
      let tableHeadRef;
      let tableBodyRef;
      let tableFootRef;
      if (!lock) {
        tableHeadRef = node => (this.tableHeadWrap = node);
        tableFootRef = node => (this.tableFootWrap = node);
        tableBodyRef = node => (this.tableBodyWrap = node);
      } else if (lock === 'right') {
        if(dragColumnAlign === DragColumnAlign.right){
          tableBodyRef = node => (this.dragColumnsBodyRight = node)
        }
        tableBodyRef = node => (this.fixedColumnsBodyRight = node);
      } else {
        if(dragColumnAlign === DragColumnAlign.left){
          tableBodyRef = node => (this.dragColumnsBodyLeft = node)
        }
        tableBodyRef = node => (this.fixedColumnsBodyLeft = node);
      }
      if (bodyHeight !== undefined) {
        bodyHeight = Math.max(
          bodyHeight,
          isNumber(rowHeight) ? rowHeight : lockColumnsBodyRowsHeight[0] || 0,
        );
        if (lock && !footer) {
          bodyHeight -= measureScrollbar();
        }
      }

      tableHead = (
        <div key="tableHead" ref={tableHeadRef} className={`${prefixCls}-head`}>
          {this.renderTable(true, false, false, lock,dragColumnAlign)}
        </div>
      );

      tableBody = (
        <TableBody
          key="tableBody"
          getRef={tableBodyRef}
          prefixCls={prefixCls}
          lock={lock}
          height={bodyHeight}
          onScroll={this.handleBodyScroll}
        >
          {this.renderTable(false, true, false, lock,dragColumnAlign)}
        </TableBody>
      );

      if (footer) {
        tableFooter = (
          <div
            key="tableFooter"
            ref={tableFootRef}
            className={`${prefixCls}-foot`}
            onScroll={this.handleBodyScroll}
          >
            {this.renderTable(false, false, true, lock,dragColumnAlign)}
          </div>
        );
      }
    } else {
      tableBody = this.renderTable(true, true, footer, lock,dragColumnAlign);
    }
    return [tableHead, tableBody, tableFooter];
  }

  getLeftFixedTable(dragColumnAlign?: DragColumnAlign ): ReactNode {
    const { overflowX, height } = this.tableStore;
    if ((!dragColumnAlign && !overflowX ) && height === undefined) {
      return;
    }
    const { prefixCls } = this;
    const table = this.getTable(ColumnLock.left,dragColumnAlign);
    return <div className={`${prefixCls}-fixed-left`}>{table}</div>;
  }

  getRightFixedTable(dragColumnAlign?: DragColumnAlign ): ReactNode | undefined {
    const { overflowX, height } = this.tableStore;
    if ((!dragColumnAlign && !overflowX ) && height === undefined) {
      return;
    }
    const { prefixCls } = this;
    const table = this.getTable(ColumnLock.right,dragColumnAlign);
    return <div className={`${prefixCls}-fixed-right`}>{table}</div>;
  }

  getTableBody(lock?: ColumnLock | boolean,dragColumnAlign?:DragColumnAlign): ReactNode {
    const {
      prefixCls,
      props: { indentSize },
    } = this;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <TableTBody  key="tbody" prefixCls={prefixCls} lock={lock} indentSize={indentSize!} dragColumnAlign= {dragColumnAlign} />
      </DragDropContext>
    );
  }

  getTableHeader(lock?: ColumnLock | boolean,dragColumnAlign?:DragColumnAlign): ReactNode {
    const {
      prefixCls,
      props: { dataSet },
    } = this;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <TableHeader key="thead" prefixCls={prefixCls} lock={lock} dataSet={dataSet} dragColumnAlign= {dragColumnAlign} />
      </DragDropContext>
    );
  }

  getTableFooter(lock?: ColumnLock | boolean,dragColumnAlign?:DragColumnAlign): ReactNode {
    const {
      prefixCls,
      props: { dataSet },
    } = this;
    return <TableFooter key="tfoot" prefixCls={prefixCls} lock={lock} dataSet={dataSet} dragColumnAlign={dragColumnAlign} />;
  }

  getStyleHeight(): number | undefined {
    const { style } = this.props;
    if (style) {
      return toPx(style.height);
    }
  }

  syncSizeInFrame(width: number = this.getWidth()) {
    if (this.nextFrameActionId !== undefined) {
      raf.cancel(this.nextFrameActionId);
    }
    this.nextFrameActionId = raf(this.syncSize.bind(this, width));
  }

  getContentHeight() {
    const { wrapper, element, prefixCls, props: { autoHeight } } = this;
    if (autoHeight) {
      const { top: parentTop, height: parentHeight } = wrapper.parentNode.getBoundingClientRect();
      const { top: tableTop } = element.getBoundingClientRect();
      let type = TableAutoHeightType.minHeight;
      let diff = 80;
      if (isObject(autoHeight)) {
        type = autoHeight.type || TableAutoHeightType.minHeight;
        diff = autoHeight.diff || 80;
      }
      if (wrapper) {
        if (type === TableAutoHeightType.minHeight) {
          return parentHeight - (tableTop - parentTop) - diff;
        }
        const tableBody: HTMLDivElement | null = element.querySelector(`.${prefixCls}-body`);
        if (tableBody) {
          tableBody.style.maxHeight = pxToRem(parentHeight - (tableTop - parentTop) - diff) || '';
          tableBody.style.overflow = 'auto';
        }
      }
    }
    return this.getStyleHeight();
  };

  @autobind
  @action
  syncSize(width: number = this.getWidth()) {
    const { element, tableStore } = this;
    if (element) {
      tableStore.width = Math.floor(width);
      const { prefixCls } = this;
      let height = this.getContentHeight();
      if (element && isNumber(height)) {
        const tableTitle: HTMLDivElement | null = element.querySelector(`.${prefixCls}-title`);
        const tableHeader: HTMLTableSectionElement | null = element.querySelector(
          `.${prefixCls}-thead`,
        );
        const tableFooter: HTMLTableSectionElement | null = element.querySelector(
          `.${prefixCls}-footer`,
        );
        const tableFootWrap: HTMLDivElement | null = element.querySelector(`.${prefixCls}-foot`);
        if (tableTitle) {
          height -= getHeight(tableTitle);
        }
        if (tableHeader) {
          height -= getHeight(tableHeader);
        }
        if (tableFooter) {
          height -= getHeight(tableFooter);
        }
        if (tableFootWrap) {
          height -= getHeight(tableFootWrap);
        }
        this.tableStore.height = height;
      }
    }
    this.setScrollPositionClassName();
  }

  @action
  initDefaultExpandedRows() {
    const {
      tableStore,
      props: { dataSet, defaultRowExpanded },
    } = this;
    if (tableStore.isTree && defaultRowExpanded && !dataSet.props.expandField) {
      tableStore.expandedRows = dataSet.reduce<(string | number)[]>((array, record) => {
        if (record.children) {
          array.push(record.key);
        }
        return array;
      }, []);
    }
  }

  getWidth(): number {
    const { wrapper } = this;
    if (wrapper) {
      return Math.floor(wrapper.getBoundingClientRect().width);
    }
    return 0;
  }
}
