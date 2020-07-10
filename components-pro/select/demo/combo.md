---
order: 9
title:
  zh-CN: 复合下拉框
  en-US: ComboBox
only: true
---

## zh-CN

复合下拉框。

## en-US

ComboBox.

````jsx
import { DataSet, Select, Row, Col } from 'choerodon-ui/pro';

function handleChange(value) {
  console.log('[combo]', value);
}

const { Option } = Select;

class App extends React.Component {
  state = {
    value: 'fox',
  }
  
  ds = new DataSet({
    autoCreate: true,
    fields: [
      { name: 'name', defaultValue: 'fox2' },
    ],
  });
  
  handleChange = (value) => {
    console.log('[combo]', value);
    this.setState({
      value,
    });
    this.ds.current.set('name', value);
  }

  render() {
    return (
      <Row gutter={10}>
        <Col span={12}>
          <Select placeholder="复合" onChange={this.handleChange}  restrict="0-9" combo value={this.state.value}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="wu">Wu</Option>
          </Select>
        </Col>
        <Col span={12}>
          <Select dataSet={this.ds} name="name" placeholder="复合+可搜索" onChange={handleChange} combo searchable>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="wu">Wu</Option>
          </Select>
        </Col>
      </Row>
    );
  }
}

ReactDOM.render(
  <App />,
  mountNode
);
````
