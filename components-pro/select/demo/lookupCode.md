---
order: 2
title:
  zh-CN: 值列表代码
  en-US: Lookup Code
only: true
---

## zh-CN

值列表代码。

## en-US

Lookup Code

```jsx
import { DataSet, Select, Button, Row, Col } from 'choerodon-ui/pro';

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

function handleOption({ record }) {
  return {
    disabled: record.index === 0,
  };
}

function handleQuery({data}){
  console.log(data);
}


class App extends React.Component {
  flag = false;

  ds = new DataSet({
    autoCreate: true,
    fields: [
      { name: 'sex', type: 'string', lookupCode: 'HR.EMPLOYEE_GENDER' },
    ],
    events: {
      update: handleDataSetChange,
      query: handleQuery,
    },
  });

  changeLookupCode = () => {
    this.flag = !this.flag;
    this.ds.getField('sex').set('lookupCode', this.flag ? 'SYS.USER_STATUS' : 'HR.EMPLOYEE_GENDER');
  };

  render() {
    return (
      <Row gutter={10}>
        <Col span={6}>
          <Select dataSet={this.ds} name="sex" placeholder="请选择" onOption={handleOption} />
        </Col>
      </Row>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
