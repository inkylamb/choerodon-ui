import React, { Children, ReactElement, cloneElement } from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action, runInAction, toJS } from 'mobx';
import Tag from 'choerodon-ui/lib/tag';
import { isNumber, isString } from 'lodash';
import warning from 'choerodon-ui/lib/_util/warning';
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
    const { dataSet } = props
    runInAction(() => {
      if (dataSet) {
        this.mergeValue = toJS(dataSet.current.toData())
      }
    });
  }

  static defaultProps = {
    suffixCls: 'Screening',
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
    const { dataSet } = this.props;
  }

  @action
  handComfirm = ({ value, text, field }) => {
    const fieldName = field.get('name')
    if (fieldName) {
      this.mergeValue = {
        ...this.mergeValue, [fieldName]: {
          value, text, field,
        },
      }
    }
  }

  @action
  handleCloseItem = (x) => {
    const { dataSet } = this;
    if (dataSet && x) {
      (this.record || dataSet.create({})).set(x, this.emptyValue);
    }
    delete this.mergeValue[x];
    if (this.child && this.child[x]) {
      this.child[x].handleClear()
    }
  }



  renderTag = (mergeValue) => {
    const tagChildren: ReactElement[] = [];
    const { dataSet } = this.props;
    Object.keys(mergeValue).forEach(key => {
      const text = mergeValue[key].text
      const field = dataSet.getField(key)
      let label = key
      if (field) {
        label = field.get('label')
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
    return (
      <div>
        {tagChildren}
      </div>
    )
  }




  render() {
    const { dataSet, children } = this.props;
    const mergeValue = toJS(this.mergeValue)
    delete mergeValue.__dirty
    const filteredChildren = Children.toArray(children).filter(c => !!c);
    return (
      <>
        {this.renderTag(mergeValue)}
        {Children.map(filteredChildren, (child, _index) => {
          const name = child.props.name
          const screenProps = {
            onComfirm: this.handComfirm,
            onChange: this.handChange,
            dataSet,
            onRef: (ref) => { this.onRef(ref, name) },
          }
          if (!isString(name)) {
            delete screenProps.onRef
            warning(false, `ScreeningItem need binding DataSet with property name.`);
          }
          return cloneElement(child, screenProps)
        })}
      </>
    );
  }
}
