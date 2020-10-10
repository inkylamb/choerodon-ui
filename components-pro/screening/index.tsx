import React, { Children, ReactElement, cloneElement } from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action, runInAction, toJS } from 'mobx';
import Tag from 'choerodon-ui/lib/tag';
import { isNumber, isString, isNil } from 'lodash';
import warning from 'choerodon-ui/lib/_util/warning';
import isArray from 'lodash/isArray';
import DataSetComponent, { DataSetComponentProps } from '../data-set/DataSetComponent';
import ScreeningItem, { ScreeningItemProps } from './ScreeningItem';
import DataSet from '../data-set';
import Record from '../data-set/Record';


export interface ScreeningProps extends DataSetComponentProps {
  dataSet: DataSet;
  children: ReactElement<ScreeningItemProps>[];
}

@observer
export default class Screening extends DataSetComponent<ScreeningProps> {
  static displayName = 'Screening';

  static ScreeningItem = ScreeningItem

  @observable mergeValue: any

  emptyValue?: any = null;

  // 存下所有子集的ref便于直接调用其中内部方法
  child?: any = {};

  constructor(props, context) {
    super(props, context);
    const dataSet = this.dataSet
    const record = this.record;
    runInAction(() => {
      if (dataSet && record) {
        this.mergeValue = record.toData()
      }
    });
  }

  static defaultProps = {
    suffixCls: 'screening',
  };

  onRef = (ref, name) => {
    this.child[name] = ref
  }

  /**
 * return the record: dataIndex record, current, undefined
 */
  @computed
  get record(): Record | undefined {
    const { record, dataSet, dataIndex } = this.observableProps;
    if (record) {
      return record;
    }
    if (dataSet) {
      if (isNumber(dataIndex)) {
        return dataSet.get(dataIndex);
      }
      return dataSet.current;
    }
    return undefined;
  }

  @computed
  get dataSet(): DataSet | undefined {
    const { record } = this;
    if (record) {
      return record.dataSet;
    }
    return this.observableProps.dataSet;
  }


  handChange = () => {
  }

  @action
  handConfirm = ({ value, fieldName }) => {
    if (fieldName) {
      this.mergeValue = {
        ...this.mergeValue, [fieldName]: value,
      }
    }
  }

  @action
  handleCloseItem = (x) => {
    const { dataSet } = this.props;
    if (dataSet && x) {
      (this.record || dataSet.create({})).set(x, this.emptyValue);
    }
    this.mergeValue[x] = this.emptyValue;
    if (this.child && this.child[x]) {
      this.child[x].handleClear()
    }
  }

  findByValue = (value,name) => {
    if (value && this.child && this.child[name]) {
      return this.child[name].processValue(value)
    }
    return value
  }

  renderTag = (mergeValue) => {
    const tagChildren: ReactElement[] = [];
    const { dataSet } = this;
    const prefixCls = this.prefixCls;
    if (dataSet) {
      Object.keys(mergeValue).forEach(key => {
        const value = mergeValue[key];
        const field = dataSet.getField(key);
        let label = key;
        let text = value;
        if (field) {
          label = field.get('label')
          if (isArray(value)) {
            text = value.map(v => {
              let itemText = field.getText(v)
              if(isNil(itemText)){
                itemText = this.findByValue(v,key);
              }
              return itemText
            })
          } else {
            text = field.getText(value)
            if(isNil(text)){
              text = this.findByValue(value,key);
            }
          }
        }
        if (text && label) {
          tagChildren.push(
            <Tag
              onClose={(e) => {
                e.preventDefault();
                this.handleCloseItem(key)
              }}
              key={key}
              closable
            >
              {`${label}:${text}`}
            </Tag>,
          )
        }
      })
      const labelNode = (<span className={`${prefixCls}-choosed-label`}>已选:</span>)
      if (tagChildren.length > 0) {
        return (
          <div className={`${prefixCls}-choosed`}>
            <div className={`${prefixCls}-choosed-title`}>{labelNode}</div>
            <div className={`${prefixCls}-choosed-content`}>
              {tagChildren}
            </div>
          </div>
        )
      }
    }
    return null
  }




  render() {
    const dataSet = this.dataSet;
    const { children } = this.props;
    const mergeValue = toJS(this.mergeValue)
    delete mergeValue.__dirty
    const filteredChildren = Children.toArray(children).filter(c => !!c);
    return (
      <div className={`${this.prefixCls}`}>
        {this.renderTag(mergeValue)}
        {Children.map(filteredChildren, (child, _index) => {
          const name = child.props.name
          if (this.mergeValue && name && isNil(this.mergeValue[name])) {
            const screenProps = {
              onConfirm: this.handConfirm,
              onChange: this.handChange,
              dataSet,
              onRef: (ref) => { this.onRef(ref, name) },
            }
            if (!isString(name)) {
              delete screenProps.onRef
              warning(false, `ScreeningItem need binding DataSet with property name.`);
            }
            return cloneElement(child, screenProps)
          }
        })}
      </div>
    );
  }
}
