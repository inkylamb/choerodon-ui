---
order: 4
title:
  zh-CN: 数据源选项
  en-US: DataSet Options
only: true
---

## zh-CN

数据源选项。

## en-US

DataSet Options

```jsx
import { DataSet, Cascader} from 'choerodon-ui/pro';

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
  optionDs = new DataSet({
    queryUrl: '/tree-less.mock',
    autoQuery: true,
    selection: 'single',
    parentField: 'parentId',
    idField: 'id',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'expand', type: 'boolean' },
      { name: 'parentId', type: 'number' },
    ],
  });

  ds = new DataSet({
    autoCreate:true,
    fields: [
      {
        name: 'id',
        type: 'string',
        textField: 'text',
        defaultValue:["2", "7"],
        valueField: 'id',
        label: '部门',
        options: this.optionDs,
      },
    ],
    events: {
      update: handleDataSetChange,
    },
  });

  render() {
    return (
      <Cascader
            dataSet={this.ds}
            name="id"
      />
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
