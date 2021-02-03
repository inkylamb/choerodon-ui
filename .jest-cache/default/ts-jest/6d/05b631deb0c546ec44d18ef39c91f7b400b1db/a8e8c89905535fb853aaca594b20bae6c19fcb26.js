import React, { Component } from 'react';
import classNames from 'classnames';
import animation from '../_util/openAnimation';
import CollapsePanel from './CollapsePanel';
import RcCollapse from '../rc-components/collapse';
import { getPrefixCls, getConfig } from '../configure';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
export default class Collapse extends Component {
    constructor() {
        super(...arguments);
        this.renderExpandIcon = (panelProps = {}) => {
            const { expandIcon } = this.props;
            return expandIcon ? expandIcon(panelProps) : null;
        };
        this.renderExpandTextContent = (panelProps = {}, locale) => {
            const { prefixCls: customizePrefixCls, } = this.props;
            const prefixCls = getPrefixCls('collapse', customizePrefixCls);
            const iconCls = classNames({
                [`${prefixCls}-expand-icon`]: true,
                [`${prefixCls}-expanded`]: panelProps.isActive,
                [`${prefixCls}-collapsed`]: !panelProps.isActive,
            });
            const icon = React.createElement("i", { className: iconCls });
            return (React.createElement(React.Fragment, null,
                panelProps.isActive ? React.createElement("span", { className: `${prefixCls}-expand-text` }, locale.fold) :
                    React.createElement("span", { className: `${prefixCls}-expand-text` }, locale.unfold),
                icon));
        };
    }
    render() {
        const { prefixCls: customizePrefixCls, className = '', expandIcon, bordered, expandIconPosition, trigger, } = this.props;
        const prefixCls = getPrefixCls('collapse', customizePrefixCls);
        const expandIconPositionCof = expandIconPosition || getConfig('collapseExpandIconPosition');
        const triggerCof = trigger || getConfig('collapseTrigger');
        const collapseClassName = classNames({
            [`${prefixCls}-borderless`]: !bordered,
            // @ts-ignore
            [`${prefixCls}-text-action`]: expandIcon === 'text' && expandIconPositionCof === 'left',
            [`${prefixCls}-trigger`]: triggerCof === 'header',
            [`${prefixCls}-icon-position-${expandIconPositionCof}`]: true,
        }, className);
        let expandIconContent;
        if (typeof expandIcon === 'function') {
            expandIconContent = (panelProps) => this.renderExpandIcon(panelProps);
        }
        else if (expandIcon === 'text') {
            expandIconContent = (panelProps) => {
                return (React.createElement(LocaleReceiver, { componentName: "Collapse", defaultLocale: defaultLocale.Collapse }, locale => this.renderExpandTextContent(panelProps, locale)));
            };
        }
        return (React.createElement(RcCollapse, Object.assign({}, this.props, { expandIcon: expandIconContent, prefixCls: prefixCls, className: collapseClassName })));
    }
}
Collapse.displayName = 'Collapse';
Collapse.Panel = CollapsePanel;
Collapse.defaultProps = {
    bordered: true,
    openAnimation: {
        ...animation,
        appear() { },
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvY29sbGFwc2UvQ29sbGFwc2UudHN4IiwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFpQixNQUFNLE9BQU8sQ0FBQztBQUN4RCxPQUFPLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUM7QUFDL0MsT0FBTyxhQUFhLE1BQU0saUJBQWlCLENBQUM7QUFDNUMsT0FBTyxVQUFVLE1BQU0sMkJBQTJCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdkQsT0FBTyxjQUFjLE1BQU0sbUNBQW1DLENBQUM7QUFDL0QsT0FBTyxhQUFhLE1BQU0sNEJBQTRCLENBQUM7QUFpQ3ZELE1BQU0sQ0FBQyxPQUFPLE9BQU8sUUFBUyxTQUFRLFNBQTZCO0lBQW5FOztRQWFFLHFCQUFnQixHQUFHLENBQUMsYUFBeUIsRUFBRSxFQUFFLEVBQUU7WUFDakQsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbEMsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3BELENBQUMsQ0FBQztRQUVGLDRCQUF1QixHQUFHLENBQUMsYUFBeUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ2hFLE1BQU0sRUFDSixTQUFTLEVBQUUsa0JBQWtCLEdBQzlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNmLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUUvRCxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUM7Z0JBQ3pCLENBQUMsR0FBRyxTQUFTLGNBQWMsQ0FBQyxFQUFFLElBQUk7Z0JBQ2xDLENBQUMsR0FBRyxTQUFTLFdBQVcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRO2dCQUM5QyxDQUFDLEdBQUcsU0FBUyxZQUFZLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRO2FBQ2pELENBQUMsQ0FBQztZQUVILE1BQU0sSUFBSSxHQUFHLDJCQUFHLFNBQVMsRUFBRSxPQUFPLEdBQUksQ0FBQztZQUV2QyxPQUFPLENBQ0w7Z0JBQ0csVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsOEJBQU0sU0FBUyxFQUFFLEdBQUcsU0FBUyxjQUFjLElBQUcsTUFBTSxDQUFDLElBQUksQ0FBUSxDQUFDLENBQUM7b0JBQ3hGLDhCQUFNLFNBQVMsRUFBRSxHQUFHLFNBQVMsY0FBYyxJQUFHLE1BQU0sQ0FBQyxNQUFNLENBQVE7Z0JBQ3BFLElBQUksQ0FDSixDQUNKLENBQUM7UUFDSixDQUFDLENBQUM7SUErQ0osQ0FBQztJQTdDQyxNQUFNO1FBQ0osTUFBTSxFQUNKLFNBQVMsRUFBRSxrQkFBa0IsRUFDN0IsU0FBUyxHQUFHLEVBQUUsRUFDZCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGtCQUFrQixFQUNsQixPQUFPLEdBQ1IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2YsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQy9ELE1BQU0scUJBQXFCLEdBQUcsa0JBQWtCLElBQUksU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDNUYsTUFBTSxVQUFVLEdBQUcsT0FBTyxJQUFJLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRTNELE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUNsQztZQUNFLENBQUMsR0FBRyxTQUFTLGFBQWEsQ0FBQyxFQUFFLENBQUMsUUFBUTtZQUN0QyxhQUFhO1lBQ2IsQ0FBQyxHQUFHLFNBQVMsY0FBYyxDQUFDLEVBQUUsVUFBVSxLQUFLLE1BQU0sSUFBSSxxQkFBcUIsS0FBSyxNQUFNO1lBQ3ZGLENBQUMsR0FBRyxTQUFTLFVBQVUsQ0FBQyxFQUFFLFVBQVUsS0FBSyxRQUFRO1lBQ2pELENBQUMsR0FBRyxTQUFTLGtCQUFrQixxQkFBcUIsRUFBRSxDQUFDLEVBQUUsSUFBSTtTQUM5RCxFQUNELFNBQVMsQ0FDVixDQUFDO1FBQ0YsSUFBSSxpQkFBaUIsQ0FBQztRQUV0QixJQUFJLE9BQU8sVUFBVSxLQUFLLFVBQVUsRUFBRTtZQUNwQyxpQkFBaUIsR0FBRyxDQUFDLFVBQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuRjthQUFNLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtZQUNoQyxpQkFBaUIsR0FBRyxDQUFDLFVBQXNCLEVBQUUsRUFBRTtnQkFDN0MsT0FBTyxDQUNMLG9CQUFDLGNBQWMsSUFBQyxhQUFhLEVBQUMsVUFBVSxFQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsUUFBUSxJQUM1RSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQzVDLENBQUMsQ0FBQTtZQUNyQixDQUFDLENBQUM7U0FDSDtRQUVELE9BQU8sQ0FDTCxvQkFBQyxVQUFVLG9CQUNMLElBQUksQ0FBQyxLQUFLLElBQ2QsVUFBVSxFQUFFLGlCQUFpQixFQUM3QixTQUFTLEVBQUUsU0FBUyxFQUNwQixTQUFTLEVBQUUsaUJBQWlCLElBQzVCLENBQ0gsQ0FBQztJQUNKLENBQUM7O0FBcEZNLG9CQUFXLEdBQUcsVUFBVSxDQUFDO0FBRXpCLGNBQUssR0FBRyxhQUFhLENBQUM7QUFFdEIscUJBQVksR0FBRztJQUNwQixRQUFRLEVBQUUsSUFBSTtJQUNkLGFBQWEsRUFBRTtRQUNiLEdBQUcsU0FBUztRQUNaLE1BQU0sS0FBSSxDQUFDO0tBQ1o7Q0FDRixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9odWlodWF3ay9Eb2N1bWVudHMvb3B0L2Nob2Vyb2Rvbi11aS9jb21wb25lbnRzL2NvbGxhcHNlL0NvbGxhcHNlLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBDU1NQcm9wZXJ0aWVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgYW5pbWF0aW9uIGZyb20gJy4uL191dGlsL29wZW5BbmltYXRpb24nO1xuaW1wb3J0IENvbGxhcHNlUGFuZWwgZnJvbSAnLi9Db2xsYXBzZVBhbmVsJztcbmltcG9ydCBSY0NvbGxhcHNlIGZyb20gJy4uL3JjLWNvbXBvbmVudHMvY29sbGFwc2UnO1xuaW1wb3J0IHsgZ2V0UHJlZml4Q2xzLCBnZXRDb25maWcgfSBmcm9tICcuLi9jb25maWd1cmUnO1xuaW1wb3J0IExvY2FsZVJlY2VpdmVyIGZyb20gJy4uL2xvY2FsZS1wcm92aWRlci9Mb2NhbGVSZWNlaXZlcic7XG5pbXBvcnQgZGVmYXVsdExvY2FsZSBmcm9tICcuLi9sb2NhbGUtcHJvdmlkZXIvZGVmYXVsdCc7XG5cbmV4cG9ydCB0eXBlIEV4cGFuZEljb25Qb3NpdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCc7XG5cbmV4cG9ydCB0eXBlIFRyaWdnZXJNb2RlID0gJ2ljb24nIHwgJ2hlYWRlcic7XG5cblxuZXhwb3J0IGludGVyZmFjZSBQYW5lbFByb3BzIHtcbiAgaXNBY3RpdmU/OiBib29sZWFuO1xuICBoZWFkZXI/OiBSZWFjdC5SZWFjdE5vZGU7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgc3R5bGU/OiBSZWFjdC5DU1NQcm9wZXJ0aWVzO1xuICBzaG93QXJyb3c/OiBib29sZWFuO1xuICBmb3JjZVJlbmRlcj86IGJvb2xlYW47XG4gIGRpc2FibGVkPzogYm9vbGVhbjtcbiAgZXh0cmE/OiBSZWFjdC5SZWFjdE5vZGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29sbGFwc2VQcm9wcyB7XG4gIGFjdGl2ZUtleT86IEFycmF5PHN0cmluZz4gfCBzdHJpbmc7XG4gIGRlZmF1bHRBY3RpdmVLZXk/OiBBcnJheTxzdHJpbmc+O1xuICAvKiog5omL6aOO55C05pWI5p6cICovXG4gIGFjY29yZGlvbj86IGJvb2xlYW47XG4gIG9uQ2hhbmdlPzogKGtleTogc3RyaW5nIHwgc3RyaW5nW10pID0+IHZvaWQ7XG4gIHN0eWxlPzogQ1NTUHJvcGVydGllcztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBib3JkZXJlZD86IGJvb2xlYW47XG4gIHByZWZpeENscz86IHN0cmluZztcbiAgZXhwYW5kSWNvbj86IChwYW5lbFByb3BzOiBQYW5lbFByb3BzKSA9PiBSZWFjdC5SZWFjdE5vZGUgfCAndGV4dCc7XG4gIGV4cGFuZEljb25Qb3NpdGlvbj86IEV4cGFuZEljb25Qb3NpdGlvbjtcbiAgdHJpZ2dlcj86IFRyaWdnZXJNb2RlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xsYXBzZSBleHRlbmRzIENvbXBvbmVudDxDb2xsYXBzZVByb3BzLCBhbnk+IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ0NvbGxhcHNlJztcblxuICBzdGF0aWMgUGFuZWwgPSBDb2xsYXBzZVBhbmVsO1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgYm9yZGVyZWQ6IHRydWUsXG4gICAgb3BlbkFuaW1hdGlvbjoge1xuICAgICAgLi4uYW5pbWF0aW9uLFxuICAgICAgYXBwZWFyKCkge30sXG4gICAgfSxcbiAgfTtcblxuICByZW5kZXJFeHBhbmRJY29uID0gKHBhbmVsUHJvcHM6IFBhbmVsUHJvcHMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHsgZXhwYW5kSWNvbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gZXhwYW5kSWNvbiA/IGV4cGFuZEljb24ocGFuZWxQcm9wcykgOiBudWxsO1xuICB9O1xuXG4gIHJlbmRlckV4cGFuZFRleHRDb250ZW50ID0gKHBhbmVsUHJvcHM6IFBhbmVsUHJvcHMgPSB7fSwgbG9jYWxlKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgcHJlZml4Q2xzOiBjdXN0b21pemVQcmVmaXhDbHMsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgcHJlZml4Q2xzID0gZ2V0UHJlZml4Q2xzKCdjb2xsYXBzZScsIGN1c3RvbWl6ZVByZWZpeENscyk7XG5cbiAgICBjb25zdCBpY29uQ2xzID0gY2xhc3NOYW1lcyh7XG4gICAgICBbYCR7cHJlZml4Q2xzfS1leHBhbmQtaWNvbmBdOiB0cnVlLFxuICAgICAgW2Ake3ByZWZpeENsc30tZXhwYW5kZWRgXTogcGFuZWxQcm9wcy5pc0FjdGl2ZSxcbiAgICAgIFtgJHtwcmVmaXhDbHN9LWNvbGxhcHNlZGBdOiAhcGFuZWxQcm9wcy5pc0FjdGl2ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGljb24gPSA8aSBjbGFzc05hbWU9e2ljb25DbHN9IC8+O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDw+XG4gICAgICAgIHtwYW5lbFByb3BzLmlzQWN0aXZlID8gPHNwYW4gY2xhc3NOYW1lPXtgJHtwcmVmaXhDbHN9LWV4cGFuZC10ZXh0YH0+e2xvY2FsZS5mb2xkfTwvc3Bhbj4gOlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YCR7cHJlZml4Q2xzfS1leHBhbmQtdGV4dGB9Pntsb2NhbGUudW5mb2xkfTwvc3Bhbj59XG4gICAgICAgIHtpY29ufVxuICAgICAgPC8+XG4gICAgKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJlZml4Q2xzOiBjdXN0b21pemVQcmVmaXhDbHMsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIGV4cGFuZEljb24sXG4gICAgICBib3JkZXJlZCxcbiAgICAgIGV4cGFuZEljb25Qb3NpdGlvbixcbiAgICAgIHRyaWdnZXIsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgcHJlZml4Q2xzID0gZ2V0UHJlZml4Q2xzKCdjb2xsYXBzZScsIGN1c3RvbWl6ZVByZWZpeENscyk7XG4gICAgY29uc3QgZXhwYW5kSWNvblBvc2l0aW9uQ29mID0gZXhwYW5kSWNvblBvc2l0aW9uIHx8IGdldENvbmZpZygnY29sbGFwc2VFeHBhbmRJY29uUG9zaXRpb24nKTtcbiAgICBjb25zdCB0cmlnZ2VyQ29mID0gdHJpZ2dlciB8fCBnZXRDb25maWcoJ2NvbGxhcHNlVHJpZ2dlcicpO1xuXG4gICAgY29uc3QgY29sbGFwc2VDbGFzc05hbWUgPSBjbGFzc05hbWVzKFxuICAgICAge1xuICAgICAgICBbYCR7cHJlZml4Q2xzfS1ib3JkZXJsZXNzYF06ICFib3JkZXJlZCxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBbYCR7cHJlZml4Q2xzfS10ZXh0LWFjdGlvbmBdOiBleHBhbmRJY29uID09PSAndGV4dCcgJiYgZXhwYW5kSWNvblBvc2l0aW9uQ29mID09PSAnbGVmdCcsXG4gICAgICAgIFtgJHtwcmVmaXhDbHN9LXRyaWdnZXJgXTogdHJpZ2dlckNvZiA9PT0gJ2hlYWRlcicsXG4gICAgICAgIFtgJHtwcmVmaXhDbHN9LWljb24tcG9zaXRpb24tJHtleHBhbmRJY29uUG9zaXRpb25Db2Z9YF06IHRydWUsXG4gICAgICB9LFxuICAgICAgY2xhc3NOYW1lLFxuICAgICk7XG4gICAgbGV0IGV4cGFuZEljb25Db250ZW50O1xuXG4gICAgaWYgKHR5cGVvZiBleHBhbmRJY29uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBleHBhbmRJY29uQ29udGVudCA9IChwYW5lbFByb3BzOiBQYW5lbFByb3BzKSA9PiB0aGlzLnJlbmRlckV4cGFuZEljb24ocGFuZWxQcm9wcyk7XG4gICAgfSBlbHNlIGlmIChleHBhbmRJY29uID09PSAndGV4dCcpIHtcbiAgICAgIGV4cGFuZEljb25Db250ZW50ID0gKHBhbmVsUHJvcHM6IFBhbmVsUHJvcHMpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TG9jYWxlUmVjZWl2ZXIgY29tcG9uZW50TmFtZT1cIkNvbGxhcHNlXCIgZGVmYXVsdExvY2FsZT17ZGVmYXVsdExvY2FsZS5Db2xsYXBzZX0+XG4gICAgICAgICAgIHtsb2NhbGUgPT4gdGhpcy5yZW5kZXJFeHBhbmRUZXh0Q29udGVudChwYW5lbFByb3BzLCBsb2NhbGUpfVxuICAgICAgICAgPC9Mb2NhbGVSZWNlaXZlcj4pXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8UmNDb2xsYXBzZVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgZXhwYW5kSWNvbj17ZXhwYW5kSWNvbkNvbnRlbnR9XG4gICAgICAgIHByZWZpeENscz17cHJlZml4Q2xzfVxuICAgICAgICBjbGFzc05hbWU9e2NvbGxhcHNlQ2xhc3NOYW1lfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXSwidmVyc2lvbiI6M30=