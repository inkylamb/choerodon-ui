---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic Usage
only: true
---

## zh-CN

文件上传。

## en-US

File Upload.

```jsx
import { Upload } from 'choerodon-ui/pro';


const props = {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  multiple: true,
  accept: ['.deb', '.txt', '.pdf', 'image/*'],
  uploadImmediately: true,
  showUploadList: true,
  beforeUpload:() => {return false},
};

ReactDOM.render(
  <div>
    <Upload {...props} />
  </div>,
  mountNode,
);
```
