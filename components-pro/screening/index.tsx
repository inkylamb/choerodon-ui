import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action, runInAction, toJS } from 'mobx';
import Tag from 'choerodon-ui/lib/tag';
import DataSetComponent, { DataSetComponentProps } from '../data-set/DataSetComponent';
import ScreeningItem from './ScreeningItem'; 
import DataSet from '../data-set';
import merge from 'lodash/merge';
import isEmpty from '../_util/isEmpty';
import { isNil, isNumber } from 'lodash';
import Record from '../data-set/Record';


export interface SpinProps extends DataSetComponentProps {
  dataSet: DataSet;
}

@observer
export default class Screening extends DataSetComponent<SpinProps> {
  static displayName = 'Screening';

  @observable mergeValue: any 

  emptyValue?: any = null;

  constructor(props, context) {
    super(props, context);
    const { dataSet } = props 
    runInAction(() => {
      if(dataSet){
        this.mergeValue = dataSet.current.toData()
      }
    });
  }

  static defaultProps = {
    suffixCls: 'Screening',
  };

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


  handChange=()=> {
    const { dataSet } = this.props;
  }

  @action
  handComfirm = ({value,text,field}) => {
    const fieldName = field.get('name')
    if(fieldName){
      this.mergeValue = {...this.mergeValue,[fieldName]:{
        value,text,
      }}
    }
    console.log(field);
  }

  @action
  handleCloseItem = (x) => {
    const { dataSet } = this.props;
    if (dataSet && x) {
      (this.record || dataSet.create({})).set(x, this.emptyValue);
    }
    this.forceUpdate()
    console.log(dataSet.toData())
  }

  render() {
    const { dataSet } = this.props;
    const mergeValue = toJS(this.mergeValue)
    const renderTag = () => {
      const tagChildren = []
      for(const x in mergeValue){
        if(x !== '__dirty'){
          if(!isNil(mergeValue[x]) && mergeValue[x] !== {}){
            tagChildren.push(<Tag afterClose={(_e)=> {this.handleCloseItem(x)}} key={x} closable>
              {mergeValue[x].text}
            </Tag>)
          }
        }
      }
      return (
        <div>
          {tagChildren}
        </div>
      )
    }
    return (
       <>
         {renderTag()}
         <ScreeningItem 
            onComfirm={this.handComfirm}  
            onChange={this.handChange} 
            name="sex" 
            dataSet={dataSet} 
         />
       </>
    );
  }
}
