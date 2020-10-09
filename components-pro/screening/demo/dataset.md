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

const ScreeningItem = Screening.ScreeningItem

function handleDataSetChange({ record, name, value, oldValue }) {
  console.log(
    '[dataset newValue]',
    value,
    '[oldValue]',
    oldValue,
    `[record.get('${name}')]`,
    record.toData(),
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
      { name: 'wear', type: 'string', lookupCode: 'WEAR',label:'衣服分类1' },
    ],
    events: { 
      update: handleDataSetChange,
      query: handQueryDataSet,
    },
  });

  render() {
    return (
      <Screening dataSet={this.ds} >
        <ScreeningItem name='sex' />
        <ScreeningItem name='wear' />
      </Screening>
    );
  }
}

ReactDOM.render(
  <App />,
  mountNode
);
````
