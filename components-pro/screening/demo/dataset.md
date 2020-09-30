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


class App extends React.Component {

  ds = new DataSet({
    autoCreate: true,
    fields: [
      { name: 'sex', type: 'string', lookupCode: 'HR.EMPLOYEE_GENDER' },
    ],
    events: {
      update: handleDataSetChange,
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
