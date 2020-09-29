import React, { Component } from 'react';
import classNames from 'classnames';
import Col from 'choerodon-ui/lib/col';
import noop from 'lodash/noop';
import ObserverCheckBox from '../check-box/CheckBox';
import { ElementProps } from '../core/ViewComponent';

export interface Info {
    key: string;
    valye: any;
}

export interface ScreeningOptionProps extends ElementProps {
    selectedKeys: Array<string>;
    onSelect?: (info:Info) => void;
    onClick?: (info:Info)=> void;
    onDeselect?: (info:Info) => void;
    onMouseEnter?: (info:Info) => void;
    onMouseLeave?: (info:Info) => void;
    disabled: boolean;
    children: React.ReactElement<any>;
    active: boolean;
    multiple: true
    isSelected: boolean;
    value: any;
}

export default class ScreeningOption extends Component<ScreeningOptionProps> {
    
  static displayName: 'ScreeningOption';

  static defaultProps: ScreeningOptionProps = {
    onSelect: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onMouseDown: noop,
  }


  onMouseLeave(e) {
    const { eventKey, onItemHover, onMouseLeave } = this.props;
    onItemHover({
      key: eventKey,
      hover: false,
    });
    onMouseLeave({
      key: eventKey,
      domEvent: e,
    });
  };

  onMouseEnter(e) {
    const { eventKey, onItemHover, onMouseEnter } = this.props;
    onItemHover({
      key: eventKey,
      hover: true,
    });
    onMouseEnter({
      key: eventKey,
      domEvent: e,
    });
  };

  onClick() {
    const { key, multiple, onClick, onSelect, onDeselect, value, isSelected } = this.props;
    const info = {
      key,
      value,
    };
    if(onSelect && onClick) {
        onClick(info);
        if (multiple ) {
          if (isSelected && onDeselect ) {
            onDeselect(info);
          } else {
            onSelect(info);
          }
        } else if (!isSelected) {
          onSelect(info);
        }
      };
   };

  render() {
    const { 
        prefixCls, 
        disabled, 
        isSelected,
        children,
        key,
        active,
        style,
        multiple,
        onMouseDown,
    } = this.props;
    const ScreeningOptionPrefix = `${prefixCls}-screening-option`

    const className = classNames(
        ScreeningOptionPrefix,
        {
            [`${ScreeningOptionPrefix}-disabled`]:disabled,
            [`${ScreeningOptionPrefix}-selected`]:isSelected,
            [`${ScreeningOptionPrefix}-active`]:active,
        },
    );
    
    const attrs = {
      key,
      className,
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
    const checkbox = multiple ? <ObserverCheckBox disabled={disabled} checked={isSelected} tabIndex={-1} /> : null;

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