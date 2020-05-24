---
order: 3
title:
  zh-CN: 鼠标移动上去触发选择
  en-US: hover
---

## zh-CN

鼠标移动上去触发选择

## en-US

hover 

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

const optionDs = new DataSet({
    queryUrl: '/tree-less.mock',
    autoQuery: true,
    selection: 'mutiple',
    parentField: 'parentId',
    idField: 'id',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'expand', type: 'boolean' },
      { name: 'parentId', type: 'string' },
    ],
  });

class App extends React.Component {
  

  ds = new DataSet({
    autoCreate:true,
    fields: [
      {
        name: 'id',
        type: 'string',
        textField: 'text',
        valueField: 'id',
        label: '部门',
        options: optionDs,
      },
    ],
    events: {
      update: handleDataSetChange,
    },
  });

  render() {
    return (
      <Cascader
          expandTrigger="hover"
          dataSet={this.ds}
          name="id"
      />
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
