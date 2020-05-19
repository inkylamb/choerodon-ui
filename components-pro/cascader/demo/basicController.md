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
import { Cascader} from 'choerodon-ui/pro';

const options = [{
  value: 'zhejiang',
  meaning: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    meaning: 'Hangzhou',
    children: [{
      value: 'xihu',
      meaning: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  meaning: 'Jiangsu',
  children: [{
    value: 'nanjing',
    meaning: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      meaning: 'Zhong Hua Men',
    }],
  }],
}];

function onChange(value) {
  console.log(value);
}

ReactDOM.render(
  <Cascader  value={["zhejiang", "hangzhou", "xihu"]} options={options} onChange={onChange} placeholder="Please select" />,
  mountNode);
```
