import React from 'react';
import { observer } from 'mobx-react';
import { DataSetStatus } from '../data-set/enum';
import DataSetComponent, { DataSetComponentProps } from '../data-set/DataSetComponent';
import Row from 'choerodon-ui/lib/row';
import Col from 'choerodon-ui/lib/col';
import Icon from 'choerodon-ui/lib/icon';
import {observable, runInAction, action} from 'mobx';


export interface SpinProps extends DataSetComponentProps {
}

@observer
export default class Screening extends DataSetComponent<SpinProps> {
  static displayName = 'Screening';

  @observable iconExpanded: boolean 

  constructor(props, context) {
    super(props, context);
    runInAction(() => {
      this.iconExpanded = false ;
    });
  }

  static defaultProps = {
    suffixCls: 'screening',
  };

  @action
  handleExpanedClick = () => {
    this.iconExpanded = !this.iconExpanded
  }

  render() {
    const { dataSet, ...otherProps } = this.props;
    const { iconExpanded, prefixCls } = this;
    const props: SpinProps = {};

    const expandedButton = () => {
      if(iconExpanded === true ){
        return (
          <>
            <span>更多</span>
            <Icon type="expand_less" />
          </>
        )
      }
      return (
        <>
         <span>收起</span>
         <Icon type="expand_more" />
        </>
      )
    }

    
    return (
      <div {...this.getMergedProps()}> 
        <div className={`${prefixCls}-title`}>分类</div>
        <div className={`${prefixCls}-content`}>
          <div className={`${prefixCls}-scroll`}>
            <Row>
                <Col span={6} >111</Col>
                <Col span={6} >112</Col>
                <Col span={6} >113</Col>
                <Col span={6} >114</Col>
                <Col span={6} >115</Col>
                <Col span={6} >116</Col>
                <Col span={6} >117</Col>
                <Col span={6} >118</Col>
                <Col span={6} >111</Col>
                <Col span={6} >112</Col>
                <Col span={6} >113</Col>
                <Col span={6} >114</Col>
                <Col span={6} >115</Col>
                <Col span={6} >116</Col>
                <Col span={6} >117</Col>
                <Col span={6} >118</Col>
                <Col span={6} >111</Col>
                <Col span={6} >112</Col>
                <Col span={6} >113</Col>
                <Col span={6} >114</Col>
                <Col span={6} >115</Col>
                <Col span={6} >116</Col>
                <Col span={6} >117</Col>
                <Col span={6} >118</Col>
                <Col span={6} >111</Col>
                <Col span={6} >112</Col>
                <Col span={6} >113</Col>
                <Col span={6} >114</Col>
                <Col span={6} >115</Col>
                <Col span={6} >116</Col>
                <Col span={6} >117</Col>
                <Col span={6} >118</Col>
            </Row>
          </div>
        </div>
        <div className={`${prefixCls}-operation`} onClick={this.handleExpanedClick}>
                {expandedButton()}
        </div>
      </div>
    );
  }
}
