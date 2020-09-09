---
order: 13
title:
  zh-CN: 虚拟滚动
  en-US: Virtual Scroll
---

## zh-CN

虚拟滚动，virtual 配合 height 使用。

当前版本还有一些问题，拖动滚动不顺滑等，非必需情况（大数据需求并同时对功能性需求很高）下使用建议不使用。

后续会不断完善此功能，感谢理解。

## en-US

Virtual Scroll.

```jsx
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import XLSX from 'xlsx';

    const initColumn = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        className: 'text-monospace',
    }, {
        title: '年级',
        dataIndex: 'grade',
        key: 'grade',
    }, {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
    }];


const  attendanceInfoList = [
    {
        name:"张三",
        grade:"2017级",
        department:"前端部门",

    },
    {
        name:"李四",
        grade:"2017级",
        department:"程序部门",

    }];


function exportExcel(headers, data, fileName = '请假记录表.xlsx') {
    const _headers = headers
        .map((item, i) => Object.assign({}, { key: item.key, title: item.title, position: String.fromCharCode(65 + i) + 1 }))
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }), {});

    const _data = data
        .map((item, i) => headers.map((key, j) => Object.assign({}, { content: item[key.key], position: String.fromCharCode(65 + j) + (i + 2) })))
        // 对刚才的结果进行降维处理（二维数组变成一维数组）
        .reduce((prev, next) => prev.concat(next))
        // 转换成 worksheet 需要的结构
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.content } }), {});

    // 合并 headers 和 data
    const output = Object.assign({}, _headers, _data);
    // 获取所有单元格的位置
    const outputPos = Object.keys(output);
    // 计算出范围 ,["A1",..., "H2"]
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

    // 构建 workbook 对象
    const wb = {
        SheetNames: ['mySheet'],
        Sheets: {
            mySheet: Object.assign(
                {},
                output,
                {
                    '!ref': ref,
                    '!cols': [{ wpx: 45 }, { wpx: 100 }, { wpx: 200 }, { wpx: 80 }, { wpx: 150 }, { wpx: 100 }, { wpx: 300 }, { wpx: 300 }],
                },
            ),
        },
    };

    // 导出 Excel
    XLSX.writeFile(wb, fileName);
}


class App extends React.Component {
  userDs = new DataSet({
    primaryKey: 'userid',
    name: 'user',
    autoQuery: true,
    pageSize: 10,
    fields: [
      {
        name: 'userid',
        type: 'string',
        label: '编号',
        required: true,
        unique: true, // 唯一索引或联合唯一索引组名 设置可编辑只有新增才能编辑,确保该字段或字段组唯一性
        help: '主键，区分用户',
      },
      {
        name: 'name',
        type: 'intl',
        label: '姓名',
      },
      {
        name: 'age',
        type: 'number',
        label: '年龄',
        unique: 'uniqueGroup',
        max: 100,
        step: 1,
        help: '用户年龄，可以排序',
      },
      {
        name: 'numberMultiple',
        type: 'number',
        label: '数值多值',
        multiple: true,
        min: 10,
        max: 100,
        step: 0.5,
      },
      {
        name: 'code',
        type: 'object',
        label: '代码描述',
      },
      {
        name: 'code.v',
        type: 'number',
      },
      {
        name: 'code.d.v',
        type: 'number',
      },
      {
        name: 'code_code',
        type: 'string',
        label: '代码',
        maxLength: 20,
        required: true,
      },
      {
        name: 'code_description',
        type: 'string',
        label: '代码描述',
      },
      {
        name: 'code_select',
        type: 'string',
        label: '代码描述(下拉)',
        lovCode: 'LOV_CODE',
        required: true,
      },
      {
        name: 'codeMultiple',
        type: 'object',
        label: '代码描述（多值）',
        lovCode: 'LOV_CODE',
        multiple: true,
        required: true,
      },
      {
        name: 'codeMultiple_code',
        bind: 'codeMultiple.code',
        type: 'string',
        label: '代码（多值）',
        multiple: true,
      },
      {
        name: 'codeMultiple_description',
        bind: 'codeMultiple.description',
        type: 'string',
        label: '代码描述',
        multiple: ',',
      },
      {
        name: 'sex',
        type: 'string',
        label: '性别',
        lookupCode: 'HR.EMPLOYEE_GENDER',
        required: true,
      },
      {
        name: 'sexMultiple',
        type: 'string',
        label: '性别（多值）',
        lookupCode: 'HR.EMPLOYEE_GENDER',
        multiple: true,
      },
      {
        name: 'accountMultiple',
        type: 'string',
        bind: 'account.multiple',
        label: '多值拼接',
        lookupCode: 'HR.EMPLOYEE_GENDER',
        multiple: ',',
      },
      { name: 'account', type: 'object', ignore: 'always' },
      { name: 'enable', type: 'boolean', label: '是否开启', unique: 'uniqueGroup' },
      { name: 'frozen', type: 'boolean', label: '是否冻结', trueValue: 'Y', falseValue: 'N' },
      { name: 'date.startDate', type: 'date', label: '开始日期', defaultValue: new Date() },
      { name: 'date.endDate', type: 'time', range: true, label: '结束日期' },
    ],
  });

  

  render() {
    const columns = [{
      name: 'userid',
    }, {
      name: 'age',
    }, {
      name: 'name',
    }, {
      name: 'code_code',
    }, {
      name: 'code_select',
    }, {
      name: 'codeMultiple',
    }, {
      name: 'codeMultiple_code',
    }, {
      name: 'sex',
    }, {
      name: 'sexMultiple',
    }, {
      name: 'accountMultiple',
    }, {
      name: 'date.startDate',
    }, {
      name: 'date.endDate',
    }, {
      name: 'numberMultiple',
    }, {
      name: 'frozen',
    }];

    // 设置 virtualSpin 开启滚动loading效果，与 table spin 效果一致
    renderButton = (<Button icon="graphic_eq" key="none"  onClick={() => {exportExcel(initColumn, attendanceInfoList,"人员名单.xlsx")}}>导出</Button>);

    return (
      <Table
        key="user"
        buttons={[this.renderButton,'save']}
        selectionMode='click'
        dataSet={this.userDs}
        style={{ height: 300 }}
        columns={columns}
        pagination={{
          pageSizeOptions: ['10', '50', '100', '200'],
        }}
      />
    );
  }
}

ReactDOM.render(<App />, mountNode);

```
