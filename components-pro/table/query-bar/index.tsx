import React, {
  cloneElement,
  Component,
  isValidElement,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import { observer } from 'mobx-react';
import { isArrayLike } from 'mobx';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import { getConfig } from 'choerodon-ui/lib/configure';
import Row from 'choerodon-ui/lib/row';
import Col from 'choerodon-ui/lib/col';
import { TableButtonType, TableQueryBarType } from '../enum';
import TableButtons from './TableButtons';
import Table, {
  Buttons,
  TableButtonProps,
  TableQueryBarHook,
  TableQueryBarHookProps,
} from '../Table';
import Button, { ButtonProps } from '../../button/Button';
import { ButtonType } from '../../button/enum';
import { DataSetStatus, FieldType } from '../../data-set/enum';
import { $l } from '../../locale-context';
import TableContext from '../TableContext';
import autobind from '../../_util/autobind';
import DataSet from '../../data-set';
import Modal from '../../modal';
import Column from '../Column';
import { getEditorByField } from '../utils';
import TableToolBar from './TableToolBar';
import TableFilterBar from './TableFilterBar';
import TableAdvancedQueryBar from './TableAdvancedQueryBar';
import { PaginationProps } from '../../pagination/Pagination';
import { findBindFieldBy } from '../../data-set/utils';
import NumberField from '../../number-field';

export interface TableQueryBarProps {
  prefixCls?: string;
  buttons?: Buttons[];
  queryFields?: { [key: string]: ReactElement<any> };
  queryFieldsLimit?: number;
  showQueryBar?: boolean;
  pagination?: ReactElement<PaginationProps>;
  filterBarFieldName?: string;
  filterBarPlaceholder?: string;
}

@observer
export default class TableQueryBar extends Component<TableQueryBarProps> {
  static displayName = 'TableQueryBar';

  static contextType = TableContext;

  exportModal;

  exportDataSet: DataSet;

  exportQuantity: number;

  get showQueryBar(): boolean {
    const {
      props: { showQueryBar },
      context: {
        tableStore: { queryBar },
      },
    } = this;
    return showQueryBar !== false && queryBar !== TableQueryBarType.none;
  }

  componentWillUnmount() {
    if (this.exportModal) {
      this.exportModal.close(true);
    }
  }

  @autobind
  handleButtonCreate() {
    const {
      tableStore: { dataSet },
    } = this.context;
    dataSet.create({}, 0);
  }

  @autobind
  handleButtonSubmit() {
    const {
      tableStore: { dataSet },
    } = this.context;
    return dataSet.submit();
  }

  @autobind
  handleButtonDelete() {
    const {
      tableStore: { dataSet },
    } = this.context;
    return dataSet.delete(dataSet.selected);
  }

  @autobind
  handleButtonRemove() {
    const {
      tableStore: { dataSet },
    } = this.context;
    dataSet.remove(dataSet.selected);
  }

  @autobind
  handleButtonReset() {
    const {
      tableStore: { dataSet },
    } = this.context;
    dataSet.reset();
  }

  @autobind
  handleQueryReset() {
    const {
      tableStore: {
        dataSet: { queryDataSet },
      },
    } = this.context;
    if (queryDataSet) {
      const { current } = queryDataSet;
      if (current) {
        current.reset();
      }
      this.handleQuery();
    }
  }

  @autobind
  handleExpandAll() {
    const { tableStore } = this.context;
    tableStore.expandAll();
  }

  @autobind
  handleCollapseAll() {
    const { tableStore } = this.context;
    tableStore.collapseAll();
  }

  @autobind
  async handleButtonExport() {
    const { tableStore } = this.context;
    const columnHeaders = await tableStore.getColumnHeaders();
    const changeQuantity = (value: number) => {
      this.exportQuantity = value;
    }
    const { prefixCls } = this.props;
    this.exportDataSet = new DataSet({ data: columnHeaders, paging: false });
    this.exportDataSet.selectAll();
    this.exportQuantity = tableStore.dataSet.totalCount
    this.exportModal = Modal.open({
      title: $l('Table', 'choose_export_columns'),
      children: (
        <>
          <Table dataSet={this.exportDataSet} style={{ height: pxToRem(300) }}>
            <Column header={$l('Table', 'column_name')} name="label" resizable={false} />
          </Table>
          <Row className={`${prefixCls}-export-quantity`}>
            <Col span={6} >
             <span>导出数量</span>
            </Col>
            <Col span={18}>
              <NumberField onChange={changeQuantity} defaultValue={this.exportQuantity} max={1000} clearButton min={0} step={1}/>  
            </Col>
          </Row>
        </>
      ),
      closable: true,
      okText: $l('Table', 'export_button'),
      onOk: this.handleExport,
      style: {
        width: pxToRem(400),
      },
    });
  }

  @autobind
  handleQuery() {
    const {
      tableStore: { dataSet },
    } = this.context;
    return dataSet.query();
  }

  @autobind
  handleExport() {
    const { selected } = this.exportDataSet;
    if (selected.length) {
      const {
        tableStore: { dataSet },
      } = this.context;
      dataSet.export(
        selected.reduce((columns, record) => {
          let myName = record.get('name');
          const myField = dataSet.getField(myName);
          if (myField && myField.type === FieldType.object) {
            const bindField = findBindFieldBy(myField, dataSet.fields, 'textField');
            if (bindField) {
              myName = bindField.name;
            }
          }
          columns[myName] = record.get('label');
          return columns;
        }, {}),
        this.exportQuantity,
      );
    } else {
      return false;
    }
  }

  getButtonProps(
    type: TableButtonType,
  ): ButtonProps & { onClick: MouseEventHandler<any>; children?: ReactNode } | undefined {
    const {
      tableStore: { isTree, dataSet },
    } = this.context;
    const disabled = dataSet.status !== DataSetStatus.ready;
    switch (type) {
      case TableButtonType.add:
        return {
          icon: 'playlist_add',
          onClick: this.handleButtonCreate,
          children: $l('Table', 'create_button'),
          disabled: disabled || (dataSet.parent ? !dataSet.parent.current : false),
        };
      case TableButtonType.save:
        return {
          icon: 'save',
          onClick: this.handleButtonSubmit,
          children: $l('Table', 'save_button'),
          type: ButtonType.submit,
          disabled,
        };
      case TableButtonType.delete:
        return {
          icon: 'delete',
          onClick: this.handleButtonDelete,
          children: $l('Table', 'delete_button'),
          disabled: disabled || dataSet.selected.length === 0,
        };
      case TableButtonType.remove:
        return {
          icon: 'remove_circle',
          onClick: this.handleButtonRemove,
          children: $l('Table', 'remove_button'),
          disabled: disabled || dataSet.selected.length === 0,
        };
      case TableButtonType.reset:
        return {
          icon: 'undo',
          onClick: this.handleButtonReset,
          children: $l('Table', 'reset_button'),
          type: ButtonType.reset,
        };
      case TableButtonType.query:
        return { icon: 'search', onClick: this.handleQuery, children: $l('Table', 'query_button') };
      case TableButtonType.export:
        return {
          icon: 'export',
          onClick: this.handleButtonExport,
          children: $l('Table', 'export_button'),
        };
      case TableButtonType.expandAll:
        return isTree
          ? {
              icon: 'add_box',
              onClick: this.handleExpandAll,
              children: $l('Table', 'expand_button'),
            }
          : undefined;
      case TableButtonType.collapseAll:
        return isTree
          ? {
              icon: 'short_text',
              onClick: this.handleCollapseAll,
              children: $l('Table', 'collapse_button'),
            }
          : undefined;
      default:
    }
  }

  getButtons(): ReactElement<ButtonProps>[] {
    const { buttons } = this.props;
    const children: ReactElement<ButtonProps>[] = [];
    if (buttons) {
      const tableButtonProps = getConfig('tableButtonProps');
      buttons.forEach(button => {
        let props: TableButtonProps = {};
        if (isArrayLike(button)) {
          props = button[1] || {};
          button = button[0];
        }
        if (isString(button) && button in TableButtonType) {
          const { afterClick, ...buttonProps } = props;
          const defaultButtonProps = this.getButtonProps(button);
          if (defaultButtonProps) {
            if (afterClick) {
              const { onClick } = defaultButtonProps;
              defaultButtonProps.onClick = async e => {
                e.persist();
                try {
                  await onClick(e);
                } finally {
                  afterClick(e);
                }
              };
            }
            children.push(
              <Button
                key={button}
                {...tableButtonProps}
                {...defaultButtonProps}
                {...buttonProps}
              />,
            );
          }
        } else if (isValidElement<ButtonProps>(button)) {
          children.push(cloneElement(button, { ...tableButtonProps, ...button.props }));
        } else if (isObject(button)) {
          children.push(<Button {...tableButtonProps} {...button} />);
        }
      });
    }
    return children;
  }

  getQueryFields(): ReactElement<any>[] {
    const {
      context: {
        tableStore: { dataSet },
      },
      props: { queryFields },
    } = this;
    const { queryDataSet } = dataSet;
    const result: ReactElement<any>[] = [];
    if (queryDataSet) {
      const { fields } = queryDataSet;
      return [...fields.entries()].reduce((list, [name, field]) => {
        if (!field.get('bind')) {
          const props: any = {
            key: name,
            name,
            dataSet: queryDataSet,
          };
          const element = queryFields![name];
          list.push(
            isValidElement(element)
              ? cloneElement(element, props)
              : cloneElement(getEditorByField(field), {
                  ...props,
                  ...(isObject(element) ? element : {}),
                }),
          );
        }
        return list;
      }, result);
    }
    return result;
  }

  renderToolBar(props: TableQueryBarHookProps) {
    const { prefixCls } = this.props;
    return <TableToolBar key="toolbar" prefixCls={prefixCls} {...props} />;
  }

  renderFilterBar(props: TableQueryBarHookProps) {
    const {
      props: { prefixCls, filterBarFieldName, filterBarPlaceholder },
    } = this;
    return (
      <TableFilterBar
        key="toolbar"
        prefixCls={prefixCls}
        paramName={filterBarFieldName!}
        placeholder={filterBarPlaceholder}
        {...props}
      />
    );
  }

  renderAdvancedQueryBar(props: TableQueryBarHookProps) {
    const { prefixCls } = this.props;
    return <TableAdvancedQueryBar key="toolbar" prefixCls={prefixCls} {...props} />;
  }

  render() {
    const buttons = this.getButtons();
    const {
      context: {
        tableStore: { dataSet, queryBar },
      },
      props: { queryFieldsLimit, prefixCls, pagination },
      showQueryBar,
    } = this;
    if (showQueryBar) {
      const { queryDataSet } = dataSet;
      const queryFields = this.getQueryFields();
      const props: TableQueryBarHookProps = {
        dataSet,
        queryDataSet,
        buttons,
        pagination,
        queryFields,
        queryFieldsLimit: queryFieldsLimit!,
      };
      if (typeof queryBar === 'function') {
        return (queryBar as TableQueryBarHook)(props);
      }
      switch (queryBar) {
        case TableQueryBarType.normal:
          return this.renderToolBar(props);
        case TableQueryBarType.bar:
          return this.renderFilterBar(props);
        case TableQueryBarType.advancedBar:
          return this.renderAdvancedQueryBar(props);
        default:
      }
    }
    return [<TableButtons key="toolbar" prefixCls={prefixCls} buttons={buttons} />, pagination];
  }
}
