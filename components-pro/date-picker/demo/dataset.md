---
order: 2
title:
  zh-CN: DataSet
  en-US: 数据源
only: true
---

## zh-CN

绑定数据源。

## en-US

DataSet binding.

```jsx
import { Form, DateTimePicker, Button, Modal, DataSet, TextField } from 'choerodon-ui/pro';
import moment from 'moment';

const App = () => {
  const timeDs = new DataSet({
    autoCreate: true,
    fields:[
      { name:'startTime',type:'dateTime',label:'开始时间',defaultValue: new Date()},
      { name:'endTime',type:'dateTime',label:'结束时间'},
      { name:'result',type:'string',label:'时间差'},
      { name:'rangeTime',type:'dateTime',label:'开始时间',range: true,defaultValue: { start: new Date()}},
      { name:'result2',type:'string',label:'时间差2'},
    ],
   })

   const handleChangeTime = (value, oldValue, form) => {
     const current = timeDs.current
     current.set('result',current.get('startTime').from(current.get('endTime')) ) 
   }

   const handleChangeTimeRange = (value) => {
     const current = timeDs.current
     current.set('result2',value[0].from(value[1]) ) 
   }

   return (
     <Form labelLayout="float" dataSet={timeDs} columns={3} header="Float Label">
      <DateTimePicker mode="dateTime" name="startTime" onChange={handleChangeTime} />
      <DateTimePicker mode="dateTime" name="endTime"  onChange={handleChangeTime} />
      <TextField name="result" />
      <DateTimePicker mode="dateTime" name="rangeTime" onChange={handleChangeTimeRange} />
      <TextField name="result2" />
      <div newLine colSpan={3}>
        <Button type="submit">注册</Button>
        <Button type="reset" style={{ marginLeft: 8 }}>重置</Button>
      </div>
    </Form>
   )
}

const openModal = () => {
  Modal.open({
    drawer: true,
    children: App(),
  });
}

ReactDOM.render(
  <Button onClick={openModal}>Open</Button>,
  mountNode
);

```
