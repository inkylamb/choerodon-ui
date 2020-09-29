---
order: 4
title:
  zh-CN: 树形数据
  en-US: Tree Data
---

## zh-CN

树形数据。

## en-US

Tree Data.

```jsx
import { DataSet, Table, Button, Icon,CheckBox } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';

const { Column } = Table;

function iconRenderer({ record, text }) {
  return [<Icon key="icon" type={record.get('icon')} />, <span key="text">{text}</span>];
}

function expandedRowRenderer({ record }) {
  return (
    <p>
      功能代码：{record.get('functionCode')} 入口页面：{record.get('url')}
    </p>
  );
}

@observer
class AddChildButton extends React.Component {
  render() {
    const { dataSet, ...otherProps } = this.props;
    const { current } = dataSet;
    return <Button {...otherProps} disabled={!current || !current.get('id')} />;
  }
}



@observer
class CheckBoxHeader extends React.Component {
  render() {
    const { dataSet, onChange, checkedValue } = this.props;
    const {checkField} = dataSet.props;
    let indeterminate = true;
    let value = checkedValue
    if(dataSet.treeRecords.every((recordItem) => recordItem.get(checkField) === false)){
      indeterminate = false;
    } 
    if(dataSet.treeRecords.every((recordItem) => recordItem.get(checkField) === true )) {
      indeterminate = false;
      value = true
    }
    return <CheckBox onChange={onChange} indeterminate={indeterminate} checked={!!value}  />;
  }
}

class App extends React.Component {
  ds = new DataSet({
    primaryKey: 'id',
    queryUrl: '/tree.mock',
    submitUrl: '/tree.mock',
    selection: false, // 不会渲染选择box
    autoQuery: true,
    parentField: 'parentId',
    idField: 'id',
    expandField: 'expand',
    checkField: 'ischecked',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'text', type: 'string', label: '功能名称' },
      { name: 'url', type: 'string', label: '入口页面' },
      { name: 'expand', type: 'boolean', label: '是否展开' },
      { name: 'ischecked', type: 'boolean', label: '是否开启' },
      { name: 'score', type: 'number', order: 'asc' },
      { name: 'parentId', type: 'number', parentFieldName: 'id' },
    ],
    events: {
      indexchange: ({ current }) => console.log('current user', current),
      submit: ({ data }) => console.log('submit tree data', data),
    },
  });

  state = {
    border: true,
    mode: 'tree',
    expandedRender: false,
    checked: false,
  };

  handleCreateChild = () => {
    this.ds.create({ parentId: this.ds.current.get('id') });
  };

  handleChangeExpandRender = () => this.setState({ expandedRender: !this.state.expandedRender });


  handleChangeBorder = () => this.setState({ border: !this.state.border });

  handleChangeMode = () => this.setState({ mode: this.state.mode === 'tree' ? 'list' : 'tree' });

  headerCheck = (value,oldValue) => {
    const {checkField} = this.ds.props;
    const { checked } = this.state;
     this.ds.records.forEach(record =>{
        record.set(checkField,!checked);
      })
    this.setState({ checked: !checked });
  }

  buttons = [
    'add',
    'save',
    'delete',
    'remove',
    'query',
    'expandAll',
    'collapseAll',
    <AddChildButton key="add-child" dataSet={this.ds} onClick={this.handleCreateChild}>
      添加子节点
    </AddChildButton>,
    <Button key="change-expand-type" onClick={this.handleChangeExpandIconIndex}>
      切换展开图标索引
    </Button>,
    <Button key="change-border" onClick={this.handleChangeBorder}>
      切换边框
    </Button>,
    <Button key="change-mode" onClick={this.handleChangeMode}>
      切换树模式
    </Button>,
    <Button key="change-expand-render" onClick={this.handleChangeExpandRender}>
      切换展开行渲染
    </Button>,
  ];

  render() {
    const { mode, border, expandedRender,checked } = this.state;
    console.log(checked)
    return (
      <Table
        mode={mode}
        buttons={this.buttons}
        dataSet={this.ds}
        expandIconColumnIndex={1}
        border={border}
        expandedRowRenderer={expandedRender && expandedRowRenderer}
      >
        <Column header={<CheckBoxHeader checked={checked} onChange={(value,oldValue) => {this.headerCheck(value,oldValue,this.ds)}} dataSet={this.ds} />} width={50} name="ischecked" editor />
        <Column name="text" editor renderer={iconRenderer} width={450} />
        <Column name="url" editor />
        <Column name="expand" editor />
        <Column header="权限设置" width={150} align="center" />
      </Table>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
