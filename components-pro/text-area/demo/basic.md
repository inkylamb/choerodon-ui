---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic usage
only: true
---

## zh-CN

基本使用。

## en-US

Basic usage example.

```jsx
import { TextArea, Row, Col } from 'choerodon-ui/pro';

ReactDOM.render(
  <Row gutter={10}>
    <Col span={8}>
      <TextArea  placeholder="Basic usage" />
    </Col>
  </Row>,
  mountNode,
);
```
