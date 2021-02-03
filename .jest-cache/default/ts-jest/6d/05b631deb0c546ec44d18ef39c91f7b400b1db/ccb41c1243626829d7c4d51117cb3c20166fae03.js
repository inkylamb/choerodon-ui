import React from 'react';
import classNames from 'classnames';
import { getPrefixCls } from '../configure';
const Group = props => {
    const { prefixCls: customizePrefixCls, className = '', size, compact, style, children } = props;
    const prefixCls = getPrefixCls('input-group', customizePrefixCls);
    const cls = classNames(prefixCls, {
        [`${prefixCls}-lg`]: size === "large" /* large */,
        [`${prefixCls}-sm`]: size === "small" /* small */,
        [`${prefixCls}-compact`]: compact,
    }, className);
    return (React.createElement("span", { className: cls, style: style }, children));
};
export default Group;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvaW5wdXQvR3JvdXAudHN4IiwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBMkMsTUFBTSxPQUFPLENBQUM7QUFDaEUsT0FBTyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBRXBDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFXNUMsTUFBTSxLQUFLLEdBQWtDLEtBQUssQ0FBQyxFQUFFO0lBQ25ELE1BQU0sRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDaEcsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xFLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FDcEIsU0FBUyxFQUNUO1FBQ0UsQ0FBQyxHQUFHLFNBQVMsS0FBSyxDQUFDLEVBQUUsSUFBSSx3QkFBZTtRQUN4QyxDQUFDLEdBQUcsU0FBUyxLQUFLLENBQUMsRUFBRSxJQUFJLHdCQUFlO1FBQ3hDLENBQUMsR0FBRyxTQUFTLFVBQVUsQ0FBQyxFQUFFLE9BQU87S0FDbEMsRUFDRCxTQUFTLENBQ1YsQ0FBQztJQUNGLE9BQU8sQ0FDTCw4QkFBTSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLElBQy9CLFFBQVEsQ0FDSixDQUNSLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixlQUFlLEtBQUssQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIvVXNlcnMvaHVpaHVhd2svRG9jdW1lbnRzL29wdC9jaG9lcm9kb24tdWkvY29tcG9uZW50cy9pbnB1dC9Hcm91cC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENTU1Byb3BlcnRpZXMsIEZ1bmN0aW9uQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnLi4vX3V0aWwvZW51bSc7XG5pbXBvcnQgeyBnZXRQcmVmaXhDbHMgfSBmcm9tICcuLi9jb25maWd1cmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwUHJvcHMge1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIHNpemU/OiBTaXplO1xuICBjaGlsZHJlbj86IGFueTtcbiAgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzO1xuICBwcmVmaXhDbHM/OiBzdHJpbmc7XG4gIGNvbXBhY3Q/OiBib29sZWFuO1xufVxuXG5jb25zdCBHcm91cDogRnVuY3Rpb25Db21wb25lbnQ8R3JvdXBQcm9wcz4gPSBwcm9wcyA9PiB7XG4gIGNvbnN0IHsgcHJlZml4Q2xzOiBjdXN0b21pemVQcmVmaXhDbHMsIGNsYXNzTmFtZSA9ICcnLCBzaXplLCBjb21wYWN0LCBzdHlsZSwgY2hpbGRyZW4gfSA9IHByb3BzO1xuICBjb25zdCBwcmVmaXhDbHMgPSBnZXRQcmVmaXhDbHMoJ2lucHV0LWdyb3VwJywgY3VzdG9taXplUHJlZml4Q2xzKTtcbiAgY29uc3QgY2xzID0gY2xhc3NOYW1lcyhcbiAgICBwcmVmaXhDbHMsXG4gICAge1xuICAgICAgW2Ake3ByZWZpeENsc30tbGdgXTogc2l6ZSA9PT0gU2l6ZS5sYXJnZSxcbiAgICAgIFtgJHtwcmVmaXhDbHN9LXNtYF06IHNpemUgPT09IFNpemUuc21hbGwsXG4gICAgICBbYCR7cHJlZml4Q2xzfS1jb21wYWN0YF06IGNvbXBhY3QsXG4gICAgfSxcbiAgICBjbGFzc05hbWUsXG4gICk7XG4gIHJldHVybiAoXG4gICAgPHNwYW4gY2xhc3NOYW1lPXtjbHN9IHN0eWxlPXtzdHlsZX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9zcGFuPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR3JvdXA7XG4iXSwidmVyc2lvbiI6M30=