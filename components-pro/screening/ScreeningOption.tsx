import React, { Component, CSSProperties, Key } from 'react';
import classNames from 'classnames';
import Col from 'choerodon-ui/lib/col';
import noop from 'lodash/noop';
import { observer } from 'mobx-react';
import { action, observable, runInAction, toJS } from 'mobx';
import ObserverCheckBox from '../check-box/CheckBox';
import { ElementProps } from '../core/ViewComponent';
import Record from '../data-set/Record';

export interface Info {
    key: string | number | undefined;
    value: any | Record;
}

export interface ColSize {
  span?: number;
  order?: number;
  offset?: number;
  push?: number;
  pull?: number;
}

export interface ScreeningOptionProps extends ElementProps {
    optionKey?:Key;
    selectedKeys?: Array<string | number | undefined>;
    onSelect?: (info:Info) => void;
    onClick?: (info:Info)=> void;
    onDeselect?: (info:Info) => void;
    onMouseEnter?: (info:Info) => void;
    onMouseLeave?: (info:Info) => void;
    onMouseDown?: (info:Info) => void;
    disabled?: boolean;
    children?: React.ReactElement<any> | string;
    active?: boolean;CSSProperties
    multiple?: boolean;
    isSelected?: boolean;
    value?: any | Record;
    span?: number;
    order?: number;
    offset?: number;
    push?: number;
    pull?: number;
    xs?: number | ColSize;
    sm?: number | ColSize;
    md?: number | ColSize;
    lg?: number | ColSize;
    xl?: number | ColSize;
    xxl?: number | ColSize;
}

@observer
export default class ScreeningOption extends Component<ScreeningOptionProps> {
    
  static displayName: 'ScreeningOption';

  static defaultProps = {
    onSelect: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onMouseDown: noop,
    isSelected: false,
  };

  @observable isSelected

  constructor(props, context) {
    super(props, context);
    runInAction(() => {
      this.isSelected = this.props.isSelected ;
    })
  }

  onMouseLeave = () => {
    const { optionKey,value, onMouseLeave } = this.props;
    const info : Info = {
      key:optionKey,
      value,
    };
    if(onMouseLeave){
      onMouseLeave(info);
    }
  };

  onMouseEnter = () => {
    const { optionKey,value, onMouseEnter } = this.props;
    const info : Info = {
      key:optionKey,
      value,
    };
    if(onMouseEnter){
      onMouseEnter(info);
    }
  };

  @action
  onClick = () =>  {
    const { optionKey, multiple, onClick, onSelect, onDeselect, value } = this.props;
    const info : Info = {
      key:optionKey,
      value,
    };
    
    if(onSelect && onClick) {
        onClick(info);
        if (multiple ) {
          if (this.isSelected && onDeselect ) {
            onDeselect(info);
          } else {
            onSelect(info);
          }
          this.isSelected = !this.isSelected;
        } else {
          onSelect(info);
        }
      };
   };

  render() {
    const { 
        prefixCls, 
        disabled, 
        children,
        optionKey,
        active,
        style,
        multiple,
        onMouseDown,
        span,
        order,
        offset,
        push,
        pull,
        xs,
        sm,
        md,
        lg,
        xl,
        xxl,
    } = this.props;
    const ScreeningOptionPrefix = `${prefixCls}-screening-option`
    const isSelected = this.isSelected
    const className = classNames(
        ScreeningOptionPrefix,
        {
            [`${ScreeningOptionPrefix}-disabled`]:disabled,
            [`${ScreeningOptionPrefix}-selected`]:isSelected,
            [`${ScreeningOptionPrefix}-active`]:active,
        },
    );
    
    const attrs = {
      optionKey,
      className,
      span,
      order,
      offset,
      push,
      pull,
      xs,
      sm,
      md,
      lg,
      xl,
      xxl,
      prefixCls,
    };
    let mouseEvent = {};
    if (!disabled) {
        mouseEvent = {
          onClick: this.onClick,
          onMouseLeave: this.onMouseLeave,
          onMouseEnter: this.onMouseEnter,
          onMouseDown,
        };
    }

    
    const checkbox = multiple ? <ObserverCheckBox readOnly checked={toJS(isSelected)} tabIndex={-1} /> : null;

    return (
        <Col
          {...attrs}
          style={style}
        >
          <div className={`${ScreeningOptionPrefix}-content`} {...mouseEvent}>
            {checkbox}
            {children}
          </div>
        </Col>
    );
  };
}