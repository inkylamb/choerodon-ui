---
order: 0
title: 
  zh-CN: 绑定数据源
  en-US: DataSet Binding
---

## zh-CN

绑定数据源。

## en-US

DataSet Binding.

````jsx
import { Screening, DataSet } from 'choerodon-ui/pro';

function handleDataSetChange({ record, name, value, oldValue }) {
  console.log(
    '[dataset newValue]',
    value,
    '[oldValue]',
    oldValue,
    `[record.get('${name}')]`,
    record.get(name),
  );
}

function handQueryDataSet({ dataSet, params, data }){
  console.log(1111111);
  console.log(data);
}


class App extends React.Component {

  ds = new DataSet({
    autoCreate: true,
    fields: [
      { name: 'sex', type: 'string', lookupCode: 'WEAR',label:'衣服分类' },
    ],
    events: { 
      update: handleDataSetChange,
      query: handQueryDataSet,
    },
  });

  render() {
    return (
      <Screening name='sex' dataSet={this.ds} /> 
    );
  }
}

ReactDOM.render(
  <App />,
  mountNode
);
````
