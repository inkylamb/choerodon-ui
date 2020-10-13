import React from 'react';
import ReactDOM from 'react-dom';
import { DataSet, NumberField } from 'choerodon-ui/pro';

function handleDataSetChange({ record, name, value, oldValue }) {
  console.log('[dataset newValue]', value, '[oldValue]', oldValue, `[record.get('${name}')]`, record.get(name));
}

class App extends React.Component {
  ds = new DataSet({
    autoCreate: true,
    fields: [
      { name: 'age', type: 'number', defaultValue: 100000000000000, required: true },
    ],
    events: {
      update: handleDataSetChange,
    },
  });

  render() {
    return <NumberField dataSet={this.ds} name="age" />;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);