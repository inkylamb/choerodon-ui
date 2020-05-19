import React, { CSSProperties, isValidElement, Key, ReactElement, ReactNode } from 'react';
import PropTypes, { element } from 'prop-types';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import isString from 'lodash/isString';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep'
import isPlainObject from 'lodash/isPlainObject';
import { observer } from 'mobx-react';
import { action, observable, toJS, computed, IReactionDisposer, isArrayLike, reaction, runInAction } from 'mobx';
import { Menus  } from 'choerodon-ui/lib/rc-components/cascader';
import KeyCode from 'choerodon-ui/lib/_util/KeyCode';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import { getConfig } from 'choerodon-ui/lib/configure';
import TriggerField, { TriggerFieldProps } from '../trigger-field/TriggerField';
import autobind from '../_util/autobind';
import { ValidationMessages } from '../validator/Validator';
import { DataSetStatus, FieldType } from '../data-set/enum';
import DataSet from '../data-set/DataSet';
import Record from '../data-set/Record';
import Spin from '../spin';
import { stopEvent } from '../_util/EventManager';
import normalizeOptions from '../option/normalizeOptions';
import { $l } from '../locale-context';
import * as ObjectChainValue from '../_util/ObjectChainValue';
import isEmpty from '../_util/isEmpty';
import isSame from '../_util/isSame';
import isSameLike from '../_util/isSameLike';
import { Renderer } from '../field/FormField';
import Item from 'choerodon-ui/lib/list/Item';
import arrayTreeFilter from 'array-tree-filter';
import { OptionProps } from '../option/Option';
import { Children } from 'react';

function updateActiveKey(menu: Menu, activeKey: string) {
  const store = menu.getStore();
  const menuId = menu.getEventKey();
  const state = store.getState();
  store.setState({
    activeKey: {
      ...state.activeKey,
      [menuId]: activeKey,
    },
  });
}

function defaultSearchMatcher({ record, text, textField }) {
  return record.get(textField).indexOf(text) !== -1;
}

const disabledField = '__disabled';

function defaultOnOption({ record }) {
  return {
    disabled: record.get(disabledField),
  };
}

export function getItemKey(record: Record, text: ReactNode, value: any) {
  return `item-${value || record.id}-${(isValidElement(text) ? text.key : text) || record.id}`;
}

function getSimpleValue(value, valueField) {
  if (isPlainObject(value)) {
    return ObjectChainValue.get(value, valueField);
  }
  return value;
}

export type onOptionProps = { dataSet: DataSet; record: Record };

export type SearchMatcher = string | ((props: SearchMatcherProps) => boolean);

export interface SearchMatcherProps {
  record: Record;
  text: string;
  textField: string;
  valueField: string;
}

export interface SelectProps extends TriggerFieldProps {
  /**
   * 复合输入值
   * @default false
   */
  combo?: boolean;
  /**
   * 可搜索
   * @default false
   */
  searchable?: boolean;
  /**
   * 搜索匹配器。 当为字符串时，作为lookup的参数名来重新请求值列表。
   */
  searchMatcher?: SearchMatcher;
  /**
   * 选项过滤
   * @param {Record} record
   * @return {boolean}
   */
  optionsFilter?: (record: Record, index: number, records: Record[]) => boolean;
  /**
   * 当选项改变时，检查并清除不在选项中的值
   * @default true
   */
  checkValueOnOptionsChange?: boolean;
  /**
   * 下拉框匹配输入框宽度
   * @default true
   */
  dropdownMatchSelectWidth?: boolean;
  /**
   * 下拉框菜单样式名
   */
  dropdownMenuStyle?: CSSProperties;
  /**
   * 选项数据源
   */
  options?: DataSet;
  /**
   * 是否为原始值
   * true - 选项中valueField对应的值
   * false - 选项值对象
   */
  primitiveValue?: boolean;
  /**
   * 渲染Option文本的钩子
   * @example
   * ```js
   * <Select
   *   {...props}
   *   optionRenderer={({ record, text, value }) => text + '$'}
   * />
   * ```
   */
  optionRenderer?: Renderer;
  /**
   * 当下拉列表为空时显示的内容
   */
  notFoundContent?: ReactNode;
  /**
   * 设置选项属性，如 disabled;
   */
  onOption: (props: onOptionProps) => OptionProps;
}

export class Select<T extends SelectProps> extends TriggerField<T> {
  static displayName = 'Select';

  static propTypes = {
    /**
     * 复合输入值
     * @default false
     */
    combo: PropTypes.bool,
    /**
     * 过滤器
     * @default false
     */
    searchable: PropTypes.bool,
    /**
     * 搜索匹配器。 当为字符串时，作为lookup的参数名来重新请求值列表。
     */
    searchMatcher: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * 是否为原始值
     * true - 选项中valueField对应的值
     * false - 选项值对象
     */
    primitiveValue: PropTypes.bool,
    /**
     * 渲染Option文本的钩子
     * @example
     * ```js
     * <Select
     *   {...props}
     *   optionRenderer={({ dataSet, record, text, value }) => text + '$'}
     * />
     * ```
     */
    optionRenderer: PropTypes.func,
    /**
     * 当下拉列表为空时显示的内容
     */
    notFoundContent: PropTypes.node,
    /**
     * 设置选项属性，如 disabled;
     */
    onOption: PropTypes.func,
    ...TriggerField.propTypes,
  };

  static defaultProps = {
    ...TriggerField.defaultProps,
    suffixCls: 'select',
    combo: false,
    searchable: false,
    dropdownMatchSelectWidth: true,
    checkValueOnOptionsChange: true,
    onOption: defaultOnOption,
  };

  comboOptions: DataSet = new DataSet();

  menu?: Menu | null;

  @observable activeValues 

  @computed
  get activeValue(): any {
    return this.activeValues;
  }

  constructor(props, context) {
    super(props, context);
    const activevalue = this.findActiveRecord(this.getValues())
    this.setActiveValue(activevalue || {})
  }

  findActiveRecord(value){
    const { options } = this;
    let result 
    const returnactiveValue = (arrayOption,index) => {
      if(arrayOption && arrayOption.length > 0){
        arrayOption.forEach((item) => {
          if(isSame(value[index],this.getRecordOrObjValue(item,this.valueField))){
            result = item
            if(item.children){
              returnactiveValue(item.children,++index)
            }
          }
        })
      }
    }
    if(options instanceof DataSet){
      returnactiveValue(options.treeData,0)
    }
    if(options instanceof Array){
      returnactiveValue(options,0)
    }
    return result
  }

  @action
  setActiveValue(activeValues:any) {
    this.activeValues = activeValues;
  }


  @computed
  get searchMatcher(): SearchMatcher {
    const { searchMatcher = defaultSearchMatcher } = this.observableProps;
    return searchMatcher;
  }

  @computed
  get defaultValidationMessages(): ValidationMessages {
    const label = this.getProp('label');
    return {
      valueMissing: $l('Cascader', label ? 'value_missing' : 'value_missing_no_label', { label }),
    };
  }

  @computed
  get textField(): string {
    return this.getProp('textField') || 'meaning';
  }

  @computed
  get valueField(): string {
    return this.getProp('valueField') || 'value';
  }

  get currentComboOption(): Record | undefined {
    return this.comboOptions.filter(record => !this.isSelected(record))[0];
  }

  get filteredOptions(): Record[] {
    const { optionsWithCombo, text } = this;
    return this.filterData(optionsWithCombo, text);
  }

  @computed
  get optionsWithCombo(): Record[] {
    if(!this.cascadeOptions){
      return [...this.comboOptions.data]
    }
    return [...this.comboOptions.data, ...this.cascadeOptions];
  }

  @computed
  get cascadeOptions(): Record[] {
    const { record, field, options, searchMatcher } = this;
    const { data } = options;
    if (field && !isString(searchMatcher)) {
      const cascadeMap = field.get('cascadeMap');
      if (cascadeMap) {
        if (record) {
          const cascades = Object.keys(cascadeMap);
          return data.filter(item =>
            cascades.every(cascade =>
              isSameLike(record.get(cascadeMap[cascade]), item.get(cascade)),
            ),
          );
        }
        return [];
      }
    }
    return data;
  }

  @computed
  get editable(): boolean {
    const { combo } = this.observableProps;
    return !this.isReadOnly() && (!!this.searchable || !!combo);
  }

  @computed
  get searchable(): boolean {
    return !!this.props.searchable;
  }

  @computed
  get multiple(): boolean {
    return !!this.getProp('multiple');
  }

  @computed
  get menuMultiple(): boolean {
    return this.multiple;
  }

  @computed
  get options(): DataSet {
    const {
      field,
      textField,
      valueField,
      multiple,
      observableProps: { children, options },
    } = this;
    let dealOption 
    if(options instanceof Array){
      dealOption = this.addOptionsParent(options,undefined)
    }else{
      dealOption = options
    }
    return (
      dealOption ||
      (field && field.options) ||
      normalizeOptions({ textField, valueField, disabledField, multiple, children })
    );
  }
  
  // 增加父级属性
  addOptionsParent(options,parent){
    if(options.length > 0){
      const optionPrent = options.map( (ele) => {
        ele.parent = parent || undefined;
        if(ele.children){
          this.addOptionsParent(ele.children,ele)
        }
        return ele
      });
      return optionPrent
    }
  }

  @computed
  get primitive(): boolean {
    const type = this.getProp('type');
    return this.observableProps.primitiveValue !== false && type !== FieldType.object;
  }

  checkValueReaction?: IReactionDisposer;

  checkComboReaction?: IReactionDisposer;

  @autobind
  saveMenu(node) {
    this.menu = node;
  }

  checkValue() {
    this.checkValueReaction = reaction(() => this.cascadeOptions, () => this.processSelectedData());
  }

  checkCombo() {
    this.checkComboReaction = reaction(
      () => this.getValue(),
      value => this.generateComboOption(value),
    );
  }

  clearCheckValue() {
    if (this.checkValueReaction) {
      this.checkValueReaction();
      this.checkValueReaction = undefined;
    }
  }

  clearCheckCombo() {
    if (this.checkComboReaction) {
      this.checkComboReaction();
      this.checkComboReaction = undefined;
    }
  }

  clearReaction() {
    this.clearCheckValue();
    this.clearCheckCombo();
  }

  componentWillMount() {
    super.componentWillMount();
    const { checkValueOnOptionsChange, combo } = this.props;
    if (checkValueOnOptionsChange) {
      this.checkValue();
    }
    if (combo) {
      this.checkCombo();
      this.generateComboOption(this.getValue());
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.doSearch.cancel();
    this.clearReaction();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    super.componentWillReceiveProps(nextProps, nextContext);
    const { checkValueOnOptionsChange, combo } = this.props;
    if (checkValueOnOptionsChange && !nextProps.checkValueOnOptionsChange) {
      this.clearCheckValue();
    }
    if (!checkValueOnOptionsChange && nextProps.checkValueOnOptionsChange) {
      this.checkValue();
    }
    if (combo && !nextProps.combo) {
      this.removeComboOptions();
      this.clearCheckCombo();
    }
    if (!combo && nextProps.combo) {
      this.checkCombo();
      if ('value' in nextProps) {
        this.generateComboOption(nextProps.value);
      }
    }
  }

  componentDidUpdate() {
    this.forcePopupAlign();
  }

  getOtherProps() {
    const otherProps = omit(super.getOtherProps(), [
      'searchable',
      'searchMatcher',
      'combo',
      'multiple',
      'value',
      'name',
      'options',
      'optionsFilter',
      'dropdownMatchSelectWidth',
      'dropdownMenuStyle',
      'checkValueOnOptionsChange',
      'primitiveValue',
      'optionRenderer',
      'notFoundContent',
      'onOption',
    ]);
    return otherProps;
  }

  getObservableProps(props, context) {
    return {
      ...super.getObservableProps(props, context),
      children: props.children,
      options: props.options,
      combo: props.combo,
      primitiveValue: props.primitiveValue,
      searchMatcher: props.searchMatcher,
    };
  }

  getMenuPrefixCls() {
    return `${this.prefixCls}-dropdown-menu`;
  }

  renderMultipleHolder() {
    const { name, multiple } = this;
    if (multiple) {
      return super.renderMultipleHolder();
    }
    return (
      <input
        key="value"
        type="hidden"
        value={this.toValueString(this.getValue()) || ''}
        name={name}
        onChange={noop}
      />
    );
  }

  getNotFoundContent() {
    const { notFoundContent } = this.props;
    if (notFoundContent !== undefined) {
      return notFoundContent;
    }
    return getConfig('renderEmpty')('Select');
  }
  
  /**
   * 返回一个打平tree返回层级
   * @param record 
   * @param fn 
   */
  findParentRecodTree(record:Record,fn?:any){
      const recordTree:any[] = []
      if(record){
        if(fn instanceof Function){
          recordTree.push(fn(record))
        }else{
          recordTree.push(record)
        }
      }
      if(record.parent){
        if(fn instanceof Function){
        return [...this.findParentRecodTree(record.parent,fn),...recordTree]
        }
        return [...this.findParentRecodTree(record.parent),...recordTree]
      }
      return recordTree
  }
 
  /**
   * 获取record 或者 obj对应的值
   * @param value 
   * @param key 
   */
  getRecordOrObjValue(value,key){
    if(value instanceof Record){
      return value.get(key)
    }
     if(value instanceof Object){
      return value[key]
    }
    return value
  }

  /**
   * 渲染menu 表格
   * @param menuProps 
   */
  @autobind
  getMenu(menuProps: object = {}): ReactNode {
    // 暂时不用考虑分组情况 groups
    const {
      options,
      textField,
      valueField,
      props: { dropdownMenuStyle, onOption },
    } = this;
    if (!options) {
      return null;
    }
    const menuDisabled = this.isDisabled();
    let optGroups: any[] = [];
    let selectedValues: any[] = [];
    const treePropsChange = (treeRecord:Record[]|any[]) => {
        let treeRecords:any = []
        if(treeRecord.length > 0){
          treeRecords = treeRecord.map((recordItem,index) => {
            const value = this.getRecordOrObjValue(recordItem,valueField);
            const text = this.getRecordOrObjValue(recordItem,textField);
            if(recordItem instanceof Record){
              const optionProps = onOption({ dataSet: options, record: recordItem });
              const optionDisabled = menuDisabled || (optionProps && optionProps.disabled);
              const key: Key = getItemKey(recordItem, text, value);
              let children
              if (recordItem.isSelected) {
                selectedValues.push(recordItem);   
              }
              if(recordItem.children){
                children = treePropsChange(recordItem.children)
              }
              return (children ? {
                key,
                label:text,
                value:recordItem,
                disabled: optionDisabled,
                children,
              }:{
                key,
                label:text,
                value:recordItem,
                disabled: optionDisabled,
              })
            }
              const optionDisabled = recordItem.disabled
              const key: Key = index
              let children: any
              if(recordItem.children){
                children = treePropsChange(recordItem.children)
              }
              return (children ? {
                key,
                label:text,
                value:recordItem,
                disabled: optionDisabled,
                children,
              }:{
                key,
                label:text,
                value:recordItem,
                disabled: optionDisabled,
              })
          })
        }
        return treeRecords
       }
       if(options instanceof DataSet){
        optGroups = treePropsChange(options.treeData)
       }else if(options instanceof Array){
        optGroups = treePropsChange(options)
       }else{
        optGroups = []
       }
       selectedValues = this.findParentRecodTree(this.activeValue)
    return options && options.length > 0 ? (
      <Menus
          {...menuProps}
          prefixCls={this.prefixCls}
          ref={this.saveMenu} 
          // disabled={menuDisabled}
          // value={this.state.value}
          activeValue={selectedValues}
          options={optGroups}
          onSelect={this.handleMenuClick}
          style={dropdownMenuStyle}
          visible={true}
        />
    ) : (
      <div key="no_data">
          {this.loading ? ' ' : this.getNotFoundContent()}
      </div>
    )
  }

  // 遍历出父亲节点
  @computed
  get loading(): boolean {
    const { field, options } = this;
    return options.status === DataSetStatus.loading || (!!field && field.pending.length > 0);
  }

  getPopupContent(): ReactNode {
    const menu = (
      <Spin key="menu" spinning={this.loading}>
        {this.getMenu()}
      </Spin>
    );
    if (this.multiple) {
      return [
        <div key="check-all" className={`${this.prefixCls}-select-all-none`}>
          <span onClick={this.chooseAll}>{$l('Select', 'select_all')}</span>
          <span onClick={this.unChooseAll}>{$l('Select', 'unselect_all')}</span>
        </div>,
        menu,
      ];
    }
    return menu;
  }

  @autobind
  getPopupStyleFromAlign(): CSSProperties | undefined {
    return undefined;
  }

  getTriggerIconFont() {
    return 'baseline-arrow_drop_down';
  }

  @autobind
  handleKeyDown(e) {
    if (!this.isDisabled() && !this.isReadOnly()) {
      switch (e.keyCode) {
        case KeyCode.RIGHT:
          this.handleKeyLeftRightNext(e,1)
          break
        case KeyCode.DOWN:
          this.handleKeyDownPrevNext(e, 1);
          break;
        case KeyCode.LEFT:
          this.handleKeyLeftRightNext(e,-1)
          break;
        case KeyCode.UP:
          this.handleKeyDownPrevNext(e, -1);
          break;
        case KeyCode.END:
        case KeyCode.PAGE_DOWN:
          this.handleKeyDownFirstLast(e, 1);
          break;
        case KeyCode.HOME:
        case KeyCode.PAGE_UP:
          this.handleKeyDownFirstLast(e, -1);
          break;
        case KeyCode.ENTER:
          this.handleKeyDownEnter(e);
          break;
        case KeyCode.ESC:
          this.handleKeyDownEsc(e);
          break;
        case KeyCode.SPACE:
          this.handleKeyDownSpace(e);
          break;
        default:
      }
    }
    super.handleKeyDown(e);
  }

  // 获取当前列第一个值和最后的值
  findTreeDataFirstLast(options,activeValue,direction){
    const nowIndexList = activeValue.parent ? activeValue.parent.children : options
     if(nowIndexList.length > 0 && direction > 0){
       return nowIndexList[nowIndexList.length-1]
     } 
     if(nowIndexList.length > 0 && direction < 0){
      return nowIndexList[0]
     }
     return activeValue
  }

  handleKeyDownFirstLast(e, direction: number) {
    stopEvent(e);
    if(this.options instanceof DataSet){
      if(isEmpty(toJS(this.activeValue))){
        this.setActiveValue(this.options.treeData[0])
      }else{
        const activeItem = this.findTreeDataFirstLast(this.options.treeData,this.activeValue,direction)
        if (!this.editable || this.popup) {
          this.setActiveValue(activeItem);
        }
      }
    }
  }

  // 查找同级位置 
  findTreeDataUpDown(options,value,direction,fn?:any){
    const nowIndexList = value.parent ? value.parent.children : options
    if(nowIndexList instanceof Array){
      const nowIndex = fn !== undefined ? fn : nowIndexList.findIndex( ele => ele.value === value )
      const length = nowIndexList.length
      if(nowIndex+direction >= length){
        return nowIndexList[0]
      }
      if(nowIndex+direction < 0){
        return nowIndexList[length-1]
      }
      return nowIndexList[nowIndex+direction]
    }
    return value
  }

  sameKeyRecordIndex(options:Record[],activeValue:Record){
    const nowIndexList = activeValue.parent ? activeValue.parent.children : options;
    return nowIndexList!.findIndex(ele => ele.key=== activeValue.key)
  }

  handleKeyDownPrevNext(e, direction: number) {
    if (!this.editable) {
      if(this.options instanceof DataSet){
        if(isEmpty(toJS(this.activeValue))){
          this.setActiveValue(this.options.treeData[0])
        }else{
          const {activeValue} = this 
          this.setActiveValue(this.findTreeDataUpDown(this.options.treeData,this.activeValue,direction,this.sameKeyRecordIndex(this.options.treeData,activeValue)));
        }
      }
      e.preventDefault();
    } else if (e === KeyCode.DOWN) {
      this.expand();
      e.preventDefault();
    }
  }

  // 查找相邻的节点
  findTreeParentChidren(options,activeValue,direction){
    if(direction > 0){
      if(activeValue.children.length > 0){
        return activeValue.children[0]
      }
    }else if(activeValue.parent){
        return activeValue.parent
    }
    return activeValue
  }



  handleKeyLeftRightNext(e, direction: number) {
     if (!this.editable) {
      if(this.options instanceof DataSet){
        if(isEmpty(toJS(this.activeValue))){
          this.setActiveValue(this.options.treeData[0])
        }else{
          this.setActiveValue(this.findTreeParentChidren(this.options.treeData,this.activeValue,direction));
        }
      }
      e.preventDefault();
    } else if (e === KeyCode.DOWN) {
      this.expand();
      e.preventDefault();
    }
  }

  handleKeyDownEnter(e) {
    if (this.popup && !this.editable) {
      const value = this.activeValue
      if (this.isSelected(value)) {
        this.unChoose(value);
      } else {
        this.choose(value);
      }
    }
    e.preventDefault();
  }
  
  handleKeyDownEsc(e) {
    if (this.popup) {
      e.preventDefault();
      this.collapse();
    }
  }

  handleKeyDownSpace(e) {
    if (!this.editable) {
      e.preventDefault();
      if (!this.popup) {
        this.expand();
      }
    }
  }

  @autobind
  handleBlur(e) {
    if (!e.isDefaultPrevented()) {
      super.handleBlur(e);
      this.resetFilter();
    }
  }

  expand() {
    const { filteredOptions } = this;
    if (filteredOptions && filteredOptions.length) {
      super.expand();
    }
  }

  syncValueOnBlur(value) {
    if (value) {
      const { data } = this.comboOptions;
      this.options.ready().then(() => {
        const record = this.findByTextWithValue(value, data);
        if (record) {
          this.choose(record);
        }
      });
    } else if (!this.multiple) {
      this.setValue(this.emptyValue);
    }
  }

  findByTextWithValue(text, data: Record[]): Record | undefined {
    const { textField } = this;
    const records = [...data, ...this.filteredOptions].filter(record =>
      isSameLike(record.get(textField), text),
    );
    if (records.length > 1) {
      const { valueField, primitive } = this;
      const value = this.getValue();
      if (value) {
        const found = records.find(record =>
          isSameLike(record.get(valueField), primitive ? value : value[valueField]),
        );
        if (found) {
          return found;
        }
      }
    }
    return records[0];
  }

  findByText(text): Record | undefined {
    const { textField } = this;
    return this.optionsWithCombo.find(record => isSameLike(record.get(textField), text));
  }

  findByValue(value): Record | undefined {
    const { valueField } = this;
    const autoType = this.getProp('type') === FieldType.auto;
    value = getSimpleValue(value, valueField);
    return this.optionsWithCombo.find(record =>
      autoType ? isSameLike(record.get(valueField), value) : isSame(record.get(valueField), value),
    );
  }

  isSelected(record: Record) {
    const { valueField } = this;
    const autoType = this.getProp('type') === FieldType.auto;
    // 多值处理
    if(this.multiple){
      return this.getValues().some(value => {
        const simpleValue = getSimpleValue(value, valueField);
        return autoType
          ? isSameLike(this.treeValueToArray(record), toJS(simpleValue))
          : isSame(this.treeValueToArray(record), toJS(simpleValue));
      });
    }
    const simpleValue = this.getValues()
    return autoType
      ? isSameLike(this.treeValueToArray(record), simpleValue)
      : isSame(this.treeValueToArray(record), simpleValue);
  }

  generateComboOption(value: string | any[], callback?: (text: string) => void): void {
    const { currentComboOption, textField, valueField } = this;
    if (value) {
      if (isArrayLike(value)) {
        value.forEach(v => !isNil(v) && this.generateComboOption(v));
      } else {
        const found = this.findByText(value) || this.findByValue(value);
        if (found) {
          const text = found.get(textField);
          if (text !== value && callback) {
            callback(text);
          }
          this.removeComboOption();
        } else if (currentComboOption) {
          currentComboOption.set(textField, value);
          currentComboOption.set(valueField, value);
        } else {
          this.createComboOption(value);
        }
      }
    } else {
      this.removeComboOption();
    }
  }

  createComboOption(value): void {
    const { textField, valueField, menu } = this;
    const record = this.comboOptions.create(
      {
        [textField]: value,
        [valueField]: value,
      },
      0,
    );
    if (menu) {
      updateActiveKey(menu, getItemKey(record, value, value));
    }
  }

  removeComboOptions() {
    this.comboOptions.forEach(record => this.removeComboOption(record));
  }

  removeComboOption(record?: Record): void {
    if (!record) {
      record = this.currentComboOption;
    }
    if (record && !this.isSelected(record)) {
      this.comboOptions.remove(record);
    }
  }

  handlePopupAnimateAppear() {}

  getValueKey(v) {
    if (isArrayLike(v)) {
      return v.map(this.getValueKey, this).join(',');
    }
    const autoType = this.getProp('type') === FieldType.auto;
    const value = getSimpleValue(v, this.valueField);
    return autoType && !isNil(value) ? value.toString() : value;
  }

  @autobind
  handlePopupAnimateEnd(_key, _exists) {}
 
  // 触发下拉框的点击事件
  @autobind
  handleMenuClick(targetOption, menuIndex, e) {
    
    if (!targetOption || targetOption.disabled) {
      return;
    }
    if(!this.isSelected(targetOption.value)){
      if (targetOption.children ) {
        this.setPopup(true);
        this.setActiveValue(targetOption.value);
      } else {
        this.choose(targetOption.value);
        this.setActiveValue(targetOption.value);
      }
    }else{
      this.unChoose(targetOption.value);
    }
    
  }

  handleOptionSelect(record: Record) {
    this.prepareSetValue(this.processRecordToObject(record));
  }

  handleOptionUnSelect(record: Record) {
    const newValue = this.treeValueToArray(record);
    this.removeValue(newValue, -1);
  }
  
  // 移除所选值
  removeValues(values: any[], index: number = 0) {
    if(!this.multiple){
      const oldValues = this.getValues() 
      if (this.getValueKey(oldValues) === this.getValueKey(values[0])) {
        if (index === -1) {
          this.afterRemoveValue(values[0], 1);
          this.setValue([]);
        }
      }
    }
    super.removeValues(values, index)
    this.setActiveValue({});
    this.collapse();
  }

  @action
  setText(text?: string): void {
    super.setText(text);
    if (this.searchable && isString(this.searchMatcher)) {
      this.doSearch(text);
    }
  } 

  doSearch = debounce(value => this.searchRemote(value), 500);

  searchRemote(value) {
    const { field, searchMatcher } = this;
    if (field && isString(searchMatcher)) {
      field.setLovPara(searchMatcher, value === '' ? undefined : value);
    }
  }

  @autobind
  @action
  handleChange(e) {
    const { value } = e.target;
    this.setText(value);
    if (this.observableProps.combo) {
      this.generateComboOption(value, text => this.setText(text));
    }
    if (!this.popup) {
      this.expand();
    }
  }

  processRecordToObject(record: Record) {
    const { primitive, valueField } = this;
    if(record instanceof Record && record.dataSet!.getFromTree(0)){
      return this.treeValueToArray(record)
    }
    if(record instanceof Object){
      return this.treeValueToArray(record)
    }
    const result =  primitive ? record.get(valueField) : record.toData();
    return result
  }

  /**
   * 返回tree 的值的列表方法
   * @param record 
   * @param allArray 
   */
  treeValueToArray(record:Record,allArray?:string[]){
    const { valueField } = this;
    if(!allArray){
      allArray = []
    }
    if(record){
      allArray = [this.getRecordOrObjValue(record,valueField),...allArray]
    }
    if(record.parent){
      return this.treeValueToArray(record.parent,allArray)
    }
    return allArray
  }

  processObjectValue(value, textField) {
    if (!isNil(value)) {
      if (isPlainObject(value)) {
        return ObjectChainValue.get(value, textField);
      }
      const found = this.findByValue(value);
      if (found) {
        return found.get(textField);
      }
    }
  }

  processLookupValue(value) {
    const { field, textField, primitive } = this;
    if (primitive && field && field.lookup) {
      return super.processValue(field.getText(value));
    }
    return super.processValue(this.processObjectValue(value, textField));
  }
  
  // 处理value
  processValue(value: any): string {
    const text = this.processLookupValue(value);
    if(value instanceof Array){
      return value.join('/')
    }
    if (isEmpty(text)) {
      if (isPlainObject(value)) {
        return ObjectChainValue.get(value, this.valueField) || '';
      }
      return super.processValue(value);
    }
    return text;
  }

  toValueString(value: any): string | undefined {
    if (value instanceof Array) {
      return value.join('/');
    }
    return value;
  }
  

  @action
  clear() {
    this.setText(undefined);
    super.clear();
    this.removeComboOptions();
  }

  addValue(...values) {
    if (this.multiple) {
      const oldValues = this.getValues();
      if (values.length) {
        const oldValuesJS = oldValues.map(item => toJS(item))
        this.setValue([...oldValuesJS, ...values]);
      } else if (!oldValues.length) {
        this.setValue(this.emptyValue);
      }
    } else {
      this.setValue(values.pop());
    }
  }

  resetFilter() {
    this.setText(undefined);
    this.removeComboOption();
    this.forcePopupAlign();
  }

  @autobind
  reset() {
    super.reset();
    this.resetFilter();
  }

  unChoose(record?: Record | null) {
    if (record) {
      this.handleOptionUnSelect(record);
    }
  }

  choose(record?: Record | null) {
    if (!this.multiple) {
      this.collapse();
    }
    if (record) {
      this.handleOptionSelect(record);
    }
  }

  @autobind
  chooseAll() {
    this.setValue(this.filteredOptions.map(this.processRecordToObject, this));
  }

  @autobind
  unChooseAll() {
    this.clear();
  }

  @autobind
  async handlePopupHiddenChange(hidden: boolean) {
    if (!hidden) {
      this.forcePopupAlign();
    }
    super.handlePopupHiddenChange(hidden);
  }

  async processSelectedData() {
    this.comboOptions.removeAll();
    const values = this.getValues();
    const { field } = this;
    if (field) {
      await field.ready();
    }
    const {
      filteredOptions,
      observableProps: { combo },
    } = this;
    runInAction(() => {
      const newValues = values.filter(value => {
        const record = this.findByValue(value);
        if (record) {
          return true;
        }
        if (combo) {
          this.createComboOption(value);
          return true;
        }
        return false;
      });
      if (this.text && combo) {
        this.generateComboOption(this.text);
      }
      if (
        field &&
        field.get('cascadeMap') &&
        filteredOptions.length &&
        !isEqual(newValues, values)
      ) {
        this.setValue(this.multiple ? newValues : newValues[0]);
      }
    });
  }

  filterData(data: Record[], text?: string): Record[] {
    const {
      textField,
      valueField,
      searchable,
      searchMatcher,
      props: { optionsFilter },
    } = this;
    data = optionsFilter ? data.filter(optionsFilter!) : data;
    if (searchable && text && typeof searchMatcher === 'function') {
      return data.filter(record => searchMatcher({ record, text, textField, valueField }));
    }
    return data;
  }
}

@observer
export default class ObserverSelect extends Select<SelectProps> {
  static defaultProps = Select.defaultProps;
}
