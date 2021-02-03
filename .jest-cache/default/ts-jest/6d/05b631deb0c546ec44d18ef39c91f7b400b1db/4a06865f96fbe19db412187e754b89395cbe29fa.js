import React, { Children, cloneElement, Component, } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import Icon from '../icon';
import warning from '../_util/warning';
import isFlexSupported from '../_util/isFlexSupported';
import RcTabs, { TabContent, TabPane } from '../rc-components/tabs';
import ScrollableInkTabBar from '../rc-components/tabs/ScrollableInkTabBar';
import { generateKey } from '../rc-components/tabs/utils';
import { getPrefixCls } from '../configure';
export default class Tabs extends Component {
    constructor() {
        super(...arguments);
        this.createNewTab = targetKey => {
            const { onEdit } = this.props;
            if (onEdit) {
                onEdit(targetKey, 'add');
            }
        };
        this.removeTab = (targetKey, e) => {
            e.stopPropagation();
            if (!targetKey) {
                return;
            }
            const { onEdit } = this.props;
            if (onEdit) {
                onEdit(targetKey, 'remove');
            }
        };
        this.handleChange = (activeKey) => {
            const { onChange } = this.props;
            if (onChange) {
                onChange(activeKey);
            }
        };
    }
    componentDidMount() {
        const NO_FLEX = ' no-flex';
        const tabNode = findDOMNode(this);
        if (tabNode && !isFlexSupported() && tabNode.className.indexOf(NO_FLEX) === -1) {
            tabNode.className += NO_FLEX;
        }
    }
    render() {
        const { prefixCls: customizePrefixCls, className = '', size, type = "line" /* line */, tabPosition, children, tabBarStyle, hideAdd, onTabClick, onPrevClick, onNextClick, animated = true, tabBarGutter, } = this.props;
        let { tabBarExtraContent } = this.props;
        const prefixCls = getPrefixCls('tabs', customizePrefixCls);
        const inkBarAnimated = typeof animated === 'object' ? animated.inkBar : animated;
        let tabPaneAnimated = typeof animated === 'object' ? animated.tabPane : animated;
        // card tabs should not have animation
        if (type !== "line" /* line */) {
            tabPaneAnimated = 'animated' in this.props ? tabPaneAnimated : false;
        }
        const isCard = type === "card" /* card */ || type === "editable-card" /* 'editable-card' */;
        warning(!(isCard && (size === "small" /* small */ || size === "large" /* large */)), "Tabs[type=card|editable-card] doesn't have small or large size, it's by designed.");
        const cls = classNames(className, `${prefixCls}-${type}`, {
            [`${prefixCls}-vertical`]: tabPosition === "left" /* left */ || tabPosition === "right" /* right */,
            [`${prefixCls}-${size}`]: !!size,
            [`${prefixCls}-card`]: isCard,
            [`${prefixCls}-no-animation`]: !tabPaneAnimated,
        });
        // only card type tabs can be added and closed
        let childrenWithClose = [];
        if (type === "editable-card" /* 'editable-card' */) {
            childrenWithClose = [];
            Children.forEach(children, (child, index) => {
                let closable = child.props.closable;
                closable = typeof closable === 'undefined' ? true : closable;
                const closeIcon = closable ? (React.createElement(Icon, { type: "close", onClick: e => this.removeTab(child.key, e) })) : null;
                childrenWithClose.push(cloneElement(child, {
                    tab: (React.createElement("div", { className: closable ? undefined : `${prefixCls}-tab-unclosable` },
                        child.props.tab,
                        closeIcon)),
                    key: generateKey(child.key, index),
                }));
            });
            // Add new tab handler
            if (!hideAdd) {
                tabBarExtraContent = (React.createElement("span", null,
                    React.createElement(Icon, { type: "plus", className: `${prefixCls}-new-tab`, onClick: this.createNewTab }),
                    tabBarExtraContent));
            }
        }
        tabBarExtraContent = tabBarExtraContent ? (React.createElement("div", { className: `${prefixCls}-extra-content` }, tabBarExtraContent)) : null;
        const renderTabBar = () => (React.createElement(ScrollableInkTabBar, { inkBarAnimated: inkBarAnimated, extraContent: tabBarExtraContent, onTabClick: onTabClick, onPrevClick: onPrevClick, onNextClick: onNextClick, style: tabBarStyle, tabBarGutter: tabBarGutter }));
        return (React.createElement(RcTabs, Object.assign({}, this.props, { prefixCls: prefixCls, className: cls, tabBarPosition: tabPosition, renderTabBar: renderTabBar, renderTabContent: () => React.createElement(TabContent, { animated: tabPaneAnimated, animatedWithMargin: true }), onChange: this.handleChange }), childrenWithClose.length > 0 ? childrenWithClose : children));
    }
}
Tabs.displayName = 'Tabs';
Tabs.TabPane = TabPane;
Tabs.defaultProps = {
    hideAdd: false,
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvdGFicy9pbmRleC50c3giLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEVBQUUsRUFDWixRQUFRLEVBRVIsWUFBWSxFQUNaLFNBQVMsR0FLVixNQUFNLE9BQU8sQ0FBQztBQUNmLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDeEMsT0FBTyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUMzQixPQUFPLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQztBQUN2QyxPQUFPLGVBQWUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLE1BQU0sRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRSxPQUFPLG1CQUFtQixNQUFNLDJDQUEyQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUcxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBa0M1QyxNQUFNLENBQUMsT0FBTyxPQUFPLElBQUssU0FBUSxTQUF5QjtJQUEzRDs7UUFTRSxpQkFBWSxHQUFtQyxTQUFTLENBQUMsRUFBRTtZQUN6RCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM5QixJQUFJLE1BQU0sRUFBRTtnQkFDVixNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzFCO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsY0FBUyxHQUFHLENBQUMsU0FBaUIsRUFBRSxDQUFnQyxFQUFFLEVBQUU7WUFDbEUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2QsT0FBTzthQUNSO1lBRUQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDOUIsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQztRQUVGLGlCQUFZLEdBQUcsQ0FBQyxTQUFpQixFQUFFLEVBQUU7WUFDbkMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDaEMsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3JCO1FBQ0gsQ0FBQyxDQUFDO0lBZ0hKLENBQUM7SUE5R0MsaUJBQWlCO1FBQ2YsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDO1FBQzNCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQWdCLENBQUM7UUFDakQsSUFBSSxPQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM5RSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxFQUNKLFNBQVMsRUFBRSxrQkFBa0IsRUFDN0IsU0FBUyxHQUFHLEVBQUUsRUFDZCxJQUFJLEVBQ0osSUFBSSxvQkFBZ0IsRUFDcEIsV0FBVyxFQUNYLFFBQVEsRUFDUixXQUFXLEVBQ1gsT0FBTyxFQUNQLFVBQVUsRUFDVixXQUFXLEVBQ1gsV0FBVyxFQUNYLFFBQVEsR0FBRyxJQUFJLEVBQ2YsWUFBWSxHQUNiLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNmLElBQUksRUFBRSxrQkFBa0IsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEMsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzNELE1BQU0sY0FBYyxHQUFHLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ2pGLElBQUksZUFBZSxHQUFHLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBRWpGLHNDQUFzQztRQUN0QyxJQUFJLElBQUksc0JBQWtCLEVBQUU7WUFDMUIsZUFBZSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUN0RTtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksc0JBQWtCLElBQUksSUFBSSwwQ0FBOEIsQ0FBQztRQUU1RSxPQUFPLENBQ0wsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksd0JBQWUsSUFBSSxJQUFJLHdCQUFlLENBQUMsQ0FBQyxFQUN6RCxtRkFBbUYsQ0FDcEYsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxTQUFTLElBQUksSUFBSSxFQUFFLEVBQUU7WUFDeEQsQ0FBQyxHQUFHLFNBQVMsV0FBVyxDQUFDLEVBQ3ZCLFdBQVcsc0JBQXNCLElBQUksV0FBVyx3QkFBdUI7WUFDekUsQ0FBQyxHQUFHLFNBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJO1lBQ2hDLENBQUMsR0FBRyxTQUFTLE9BQU8sQ0FBQyxFQUFFLE1BQU07WUFDN0IsQ0FBQyxHQUFHLFNBQVMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxlQUFlO1NBQ2hELENBQUMsQ0FBQztRQUNILDhDQUE4QztRQUM5QyxJQUFJLGlCQUFpQixHQUF3QixFQUFFLENBQUM7UUFDaEQsSUFBSSxJQUFJLDBDQUE4QixFQUFFO1lBQ3RDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztZQUN2QixRQUFRLENBQUMsT0FBTyxDQUFDLFFBQXFCLEVBQUUsQ0FBQyxLQUF3QixFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMxRSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFDcEMsUUFBUSxHQUFHLE9BQU8sUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQzdELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDM0Isb0JBQUMsSUFBSSxJQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBYSxFQUFFLENBQUMsQ0FBQyxHQUFJLENBQzVFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDVCxpQkFBaUIsQ0FBQyxJQUFJLENBQ3BCLFlBQVksQ0FBQyxLQUFLLEVBQUU7b0JBQ2xCLEdBQUcsRUFBRSxDQUNILDZCQUFLLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLGlCQUFpQjt3QkFDakUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHO3dCQUNmLFNBQVMsQ0FDTixDQUNQO29CQUNELEdBQUcsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7aUJBQ25DLENBQUMsQ0FDSCxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFDSCxzQkFBc0I7WUFDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixrQkFBa0IsR0FBRyxDQUNuQjtvQkFDRSxvQkFBQyxJQUFJLElBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUUsR0FBRyxTQUFTLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBSTtvQkFDbEYsa0JBQWtCLENBQ2QsQ0FDUixDQUFDO2FBQ0g7U0FDRjtRQUVELGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUN4Qyw2QkFBSyxTQUFTLEVBQUUsR0FBRyxTQUFTLGdCQUFnQixJQUFHLGtCQUFrQixDQUFPLENBQ3pFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVULE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQ3pCLG9CQUFDLG1CQUFtQixJQUNsQixjQUFjLEVBQUUsY0FBYyxFQUM5QixZQUFZLEVBQUUsa0JBQWtCLEVBQ2hDLFVBQVUsRUFBRSxVQUFVLEVBQ3RCLFdBQVcsRUFBRSxXQUFXLEVBQ3hCLFdBQVcsRUFBRSxXQUFXLEVBQ3hCLEtBQUssRUFBRSxXQUFXLEVBQ2xCLFlBQVksRUFBRSxZQUFZLEdBQzFCLENBQ0gsQ0FBQztRQUVGLE9BQU8sQ0FDTCxvQkFBQyxNQUFNLG9CQUNELElBQUksQ0FBQyxLQUFLLElBQ2QsU0FBUyxFQUFFLFNBQVMsRUFDcEIsU0FBUyxFQUFFLEdBQUcsRUFDZCxjQUFjLEVBQUUsV0FBVyxFQUMzQixZQUFZLEVBQUUsWUFBWSxFQUMxQixnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxvQkFBQyxVQUFVLElBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsU0FBRyxFQUNwRixRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksS0FFMUIsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FDckQsQ0FDVixDQUFDO0lBQ0osQ0FBQzs7QUEvSU0sZ0JBQVcsR0FBRyxNQUFNLENBQUM7QUFFckIsWUFBTyxHQUFHLE9BQThDLENBQUM7QUFFekQsaUJBQVksR0FBRztJQUNwQixPQUFPLEVBQUUsS0FBSztDQUNmLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvdGFicy9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7XG4gIENoaWxkcmVuLFxuICBDbGFzc2ljQ29tcG9uZW50Q2xhc3MsXG4gIGNsb25lRWxlbWVudCxcbiAgQ29tcG9uZW50LFxuICBDU1NQcm9wZXJ0aWVzLFxuICBNb3VzZUV2ZW50SGFuZGxlcixcbiAgUmVhY3RFbGVtZW50LFxuICBSZWFjdE5vZGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGZpbmRET01Ob2RlIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IEljb24gZnJvbSAnLi4vaWNvbic7XG5pbXBvcnQgd2FybmluZyBmcm9tICcuLi9fdXRpbC93YXJuaW5nJztcbmltcG9ydCBpc0ZsZXhTdXBwb3J0ZWQgZnJvbSAnLi4vX3V0aWwvaXNGbGV4U3VwcG9ydGVkJztcbmltcG9ydCBSY1RhYnMsIHsgVGFiQ29udGVudCwgVGFiUGFuZSB9IGZyb20gJy4uL3JjLWNvbXBvbmVudHMvdGFicyc7XG5pbXBvcnQgU2Nyb2xsYWJsZUlua1RhYkJhciBmcm9tICcuLi9yYy1jb21wb25lbnRzL3RhYnMvU2Nyb2xsYWJsZUlua1RhYkJhcic7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uL3JjLWNvbXBvbmVudHMvdGFicy91dGlscyc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnLi4vX3V0aWwvZW51bSc7XG5pbXBvcnQgeyBUYWJzUG9zaXRpb24sIFRhYnNUeXBlIH0gZnJvbSAnLi9lbnVtJztcbmltcG9ydCB7IGdldFByZWZpeENscyB9IGZyb20gJy4uL2NvbmZpZ3VyZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFic1Byb3BzIHtcbiAgYWN0aXZlS2V5Pzogc3RyaW5nO1xuICBkZWZhdWx0QWN0aXZlS2V5Pzogc3RyaW5nO1xuICBoaWRlQWRkPzogYm9vbGVhbjtcbiAgb25DaGFuZ2U/OiAoYWN0aXZlS2V5OiBzdHJpbmcpID0+IHZvaWQ7XG4gIG9uVGFiQ2xpY2s/OiBGdW5jdGlvbjtcbiAgb25QcmV2Q2xpY2s/OiBNb3VzZUV2ZW50SGFuZGxlcjxhbnk+O1xuICBvbk5leHRDbGljaz86IE1vdXNlRXZlbnRIYW5kbGVyPGFueT47XG4gIHRhYkJhckV4dHJhQ29udGVudD86IFJlYWN0Tm9kZSB8IG51bGw7XG4gIHRhYkJhclN0eWxlPzogQ1NTUHJvcGVydGllcztcbiAgdHlwZT86IFRhYnNUeXBlO1xuICB0YWJQb3NpdGlvbj86IFRhYnNQb3NpdGlvbjtcbiAgb25FZGl0PzogKHRhcmdldEtleTogc3RyaW5nIHwgUmVhY3QuTW91c2VFdmVudDxIVE1MRWxlbWVudD4sIGFjdGlvbjogYW55KSA9PiB2b2lkO1xuICBzaXplPzogU2l6ZTtcbiAgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzO1xuICBwcmVmaXhDbHM/OiBzdHJpbmc7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgYW5pbWF0ZWQ/OiBib29sZWFuIHwgeyBpbmtCYXI6IGJvb2xlYW47IHRhYlBhbmU6IGJvb2xlYW4gfTtcbiAgdGFiQmFyR3V0dGVyPzogbnVtYmVyO1xufVxuXG4vLyBUYWJzXG5leHBvcnQgaW50ZXJmYWNlIFRhYlBhbmVQcm9wcyB7XG4gIC8qKiDpgInpobnljaHlpLTmmL7npLrmloflrZcgKi9cbiAgdGFiPzogUmVhY3ROb2RlIHwgc3RyaW5nO1xuICBzdHlsZT86IENTU1Byb3BlcnRpZXM7XG4gIGNsb3NhYmxlPzogYm9vbGVhbjtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBkaXNhYmxlZD86IGJvb2xlYW47XG4gIGZvcmNlUmVuZGVyPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFicyBleHRlbmRzIENvbXBvbmVudDxUYWJzUHJvcHMsIGFueT4ge1xuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnVGFicyc7XG5cbiAgc3RhdGljIFRhYlBhbmUgPSBUYWJQYW5lIGFzIENsYXNzaWNDb21wb25lbnRDbGFzczxUYWJQYW5lUHJvcHM+O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGlkZUFkZDogZmFsc2UsXG4gIH07XG5cbiAgY3JlYXRlTmV3VGFiOiBNb3VzZUV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD4gPSB0YXJnZXRLZXkgPT4ge1xuICAgIGNvbnN0IHsgb25FZGl0IH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChvbkVkaXQpIHtcbiAgICAgIG9uRWRpdCh0YXJnZXRLZXksICdhZGQnKTtcbiAgICB9XG4gIH07XG5cbiAgcmVtb3ZlVGFiID0gKHRhcmdldEtleTogc3RyaW5nLCBlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxFbGVtZW50PikgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCF0YXJnZXRLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IG9uRWRpdCB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAob25FZGl0KSB7XG4gICAgICBvbkVkaXQodGFyZ2V0S2V5LCAncmVtb3ZlJyk7XG4gICAgfVxuICB9O1xuXG4gIGhhbmRsZUNoYW5nZSA9IChhY3RpdmVLZXk6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHsgb25DaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKG9uQ2hhbmdlKSB7XG4gICAgICBvbkNoYW5nZShhY3RpdmVLZXkpO1xuICAgIH1cbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBOT19GTEVYID0gJyBuby1mbGV4JztcbiAgICBjb25zdCB0YWJOb2RlID0gZmluZERPTU5vZGUodGhpcykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKHRhYk5vZGUgJiYgIWlzRmxleFN1cHBvcnRlZCgpICYmIHRhYk5vZGUuY2xhc3NOYW1lLmluZGV4T2YoTk9fRkxFWCkgPT09IC0xKSB7XG4gICAgICB0YWJOb2RlLmNsYXNzTmFtZSArPSBOT19GTEVYO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcmVmaXhDbHM6IGN1c3RvbWl6ZVByZWZpeENscyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgc2l6ZSxcbiAgICAgIHR5cGUgPSBUYWJzVHlwZS5saW5lLFxuICAgICAgdGFiUG9zaXRpb24sXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHRhYkJhclN0eWxlLFxuICAgICAgaGlkZUFkZCxcbiAgICAgIG9uVGFiQ2xpY2ssXG4gICAgICBvblByZXZDbGljayxcbiAgICAgIG9uTmV4dENsaWNrLFxuICAgICAgYW5pbWF0ZWQgPSB0cnVlLFxuICAgICAgdGFiQmFyR3V0dGVyLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGxldCB7IHRhYkJhckV4dHJhQ29udGVudCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBwcmVmaXhDbHMgPSBnZXRQcmVmaXhDbHMoJ3RhYnMnLCBjdXN0b21pemVQcmVmaXhDbHMpO1xuICAgIGNvbnN0IGlua0JhckFuaW1hdGVkID0gdHlwZW9mIGFuaW1hdGVkID09PSAnb2JqZWN0JyA/IGFuaW1hdGVkLmlua0JhciA6IGFuaW1hdGVkO1xuICAgIGxldCB0YWJQYW5lQW5pbWF0ZWQgPSB0eXBlb2YgYW5pbWF0ZWQgPT09ICdvYmplY3QnID8gYW5pbWF0ZWQudGFiUGFuZSA6IGFuaW1hdGVkO1xuXG4gICAgLy8gY2FyZCB0YWJzIHNob3VsZCBub3QgaGF2ZSBhbmltYXRpb25cbiAgICBpZiAodHlwZSAhPT0gVGFic1R5cGUubGluZSkge1xuICAgICAgdGFiUGFuZUFuaW1hdGVkID0gJ2FuaW1hdGVkJyBpbiB0aGlzLnByb3BzID8gdGFiUGFuZUFuaW1hdGVkIDogZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgaXNDYXJkID0gdHlwZSA9PT0gVGFic1R5cGUuY2FyZCB8fCB0eXBlID09PSBUYWJzVHlwZVsnZWRpdGFibGUtY2FyZCddO1xuXG4gICAgd2FybmluZyhcbiAgICAgICEoaXNDYXJkICYmIChzaXplID09PSBTaXplLnNtYWxsIHx8IHNpemUgPT09IFNpemUubGFyZ2UpKSxcbiAgICAgIFwiVGFic1t0eXBlPWNhcmR8ZWRpdGFibGUtY2FyZF0gZG9lc24ndCBoYXZlIHNtYWxsIG9yIGxhcmdlIHNpemUsIGl0J3MgYnkgZGVzaWduZWQuXCIsXG4gICAgKTtcbiAgICBjb25zdCBjbHMgPSBjbGFzc05hbWVzKGNsYXNzTmFtZSwgYCR7cHJlZml4Q2xzfS0ke3R5cGV9YCwge1xuICAgICAgW2Ake3ByZWZpeENsc30tdmVydGljYWxgXTpcbiAgICAgICAgdGFiUG9zaXRpb24gPT09IFRhYnNQb3NpdGlvbi5sZWZ0IHx8IHRhYlBvc2l0aW9uID09PSBUYWJzUG9zaXRpb24ucmlnaHQsXG4gICAgICBbYCR7cHJlZml4Q2xzfS0ke3NpemV9YF06ICEhc2l6ZSxcbiAgICAgIFtgJHtwcmVmaXhDbHN9LWNhcmRgXTogaXNDYXJkLFxuICAgICAgW2Ake3ByZWZpeENsc30tbm8tYW5pbWF0aW9uYF06ICF0YWJQYW5lQW5pbWF0ZWQsXG4gICAgfSk7XG4gICAgLy8gb25seSBjYXJkIHR5cGUgdGFicyBjYW4gYmUgYWRkZWQgYW5kIGNsb3NlZFxuICAgIGxldCBjaGlsZHJlbldpdGhDbG9zZTogUmVhY3RFbGVtZW50PGFueT5bXSA9IFtdO1xuICAgIGlmICh0eXBlID09PSBUYWJzVHlwZVsnZWRpdGFibGUtY2FyZCddKSB7XG4gICAgICBjaGlsZHJlbldpdGhDbG9zZSA9IFtdO1xuICAgICAgQ2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiBhcyBSZWFjdE5vZGUsIChjaGlsZDogUmVhY3RFbGVtZW50PGFueT4sIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBjbG9zYWJsZSA9IGNoaWxkLnByb3BzLmNsb3NhYmxlO1xuICAgICAgICBjbG9zYWJsZSA9IHR5cGVvZiBjbG9zYWJsZSA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogY2xvc2FibGU7XG4gICAgICAgIGNvbnN0IGNsb3NlSWNvbiA9IGNsb3NhYmxlID8gKFxuICAgICAgICAgIDxJY29uIHR5cGU9XCJjbG9zZVwiIG9uQ2xpY2s9e2UgPT4gdGhpcy5yZW1vdmVUYWIoY2hpbGQua2V5IGFzIHN0cmluZywgZSl9IC8+XG4gICAgICAgICkgOiBudWxsO1xuICAgICAgICBjaGlsZHJlbldpdGhDbG9zZS5wdXNoKFxuICAgICAgICAgIGNsb25lRWxlbWVudChjaGlsZCwge1xuICAgICAgICAgICAgdGFiOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbG9zYWJsZSA/IHVuZGVmaW5lZCA6IGAke3ByZWZpeENsc30tdGFiLXVuY2xvc2FibGVgfT5cbiAgICAgICAgICAgICAgICB7Y2hpbGQucHJvcHMudGFifVxuICAgICAgICAgICAgICAgIHtjbG9zZUljb259XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGtleTogZ2VuZXJhdGVLZXkoY2hpbGQua2V5LCBpbmRleCksXG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIC8vIEFkZCBuZXcgdGFiIGhhbmRsZXJcbiAgICAgIGlmICghaGlkZUFkZCkge1xuICAgICAgICB0YWJCYXJFeHRyYUNvbnRlbnQgPSAoXG4gICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8SWNvbiB0eXBlPVwicGx1c1wiIGNsYXNzTmFtZT17YCR7cHJlZml4Q2xzfS1uZXctdGFiYH0gb25DbGljaz17dGhpcy5jcmVhdGVOZXdUYWJ9IC8+XG4gICAgICAgICAgICB7dGFiQmFyRXh0cmFDb250ZW50fVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0YWJCYXJFeHRyYUNvbnRlbnQgPSB0YWJCYXJFeHRyYUNvbnRlbnQgPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7cHJlZml4Q2xzfS1leHRyYS1jb250ZW50YH0+e3RhYkJhckV4dHJhQ29udGVudH08L2Rpdj5cbiAgICApIDogbnVsbDtcblxuICAgIGNvbnN0IHJlbmRlclRhYkJhciA9ICgpID0+IChcbiAgICAgIDxTY3JvbGxhYmxlSW5rVGFiQmFyXG4gICAgICAgIGlua0JhckFuaW1hdGVkPXtpbmtCYXJBbmltYXRlZH1cbiAgICAgICAgZXh0cmFDb250ZW50PXt0YWJCYXJFeHRyYUNvbnRlbnR9XG4gICAgICAgIG9uVGFiQ2xpY2s9e29uVGFiQ2xpY2t9XG4gICAgICAgIG9uUHJldkNsaWNrPXtvblByZXZDbGlja31cbiAgICAgICAgb25OZXh0Q2xpY2s9e29uTmV4dENsaWNrfVxuICAgICAgICBzdHlsZT17dGFiQmFyU3R5bGV9XG4gICAgICAgIHRhYkJhckd1dHRlcj17dGFiQmFyR3V0dGVyfVxuICAgICAgLz5cbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxSY1RhYnNcbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgIHByZWZpeENscz17cHJlZml4Q2xzfVxuICAgICAgICBjbGFzc05hbWU9e2Nsc31cbiAgICAgICAgdGFiQmFyUG9zaXRpb249e3RhYlBvc2l0aW9ufVxuICAgICAgICByZW5kZXJUYWJCYXI9e3JlbmRlclRhYkJhcn1cbiAgICAgICAgcmVuZGVyVGFiQ29udGVudD17KCkgPT4gPFRhYkNvbnRlbnQgYW5pbWF0ZWQ9e3RhYlBhbmVBbmltYXRlZH0gYW5pbWF0ZWRXaXRoTWFyZ2luIC8+fVxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbldpdGhDbG9zZS5sZW5ndGggPiAwID8gY2hpbGRyZW5XaXRoQ2xvc2UgOiBjaGlsZHJlbn1cbiAgICAgIDwvUmNUYWJzPlxuICAgICk7XG4gIH1cbn1cbiJdLCJ2ZXJzaW9uIjozfQ==