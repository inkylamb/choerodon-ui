import React from 'react';
import classNames from 'classnames';
import { getPrefixCls } from '../configure';
const Grid = (props) => {
    const { prefixCls: customizePrefixCls, className, ...others } = props;
    const prefixCls = getPrefixCls('card', customizePrefixCls);
    const classString = classNames(`${prefixCls}-grid`, className);
    return React.createElement("div", Object.assign({}, others, { className: classString }));
};
Grid.displayName = 'CardGrid';
export default Grid;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvY2FyZC9HcmlkLnRzeCIsIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQTZCLE1BQU0sT0FBTyxDQUFDO0FBQ2xELE9BQU8sVUFBVSxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBUTVDLE1BQU0sSUFBSSxHQUF1QixDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ3pDLE1BQU0sRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLEdBQUcsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ3RFLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUMzRCxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxTQUFTLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvRCxPQUFPLDZDQUFTLE1BQU0sSUFBRSxTQUFTLEVBQUUsV0FBVyxJQUFJLENBQUM7QUFDckQsQ0FBQyxDQUFDO0FBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7QUFFOUIsZUFBZSxJQUFJLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvY2FyZC9HcmlkLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ1NTUHJvcGVydGllcywgU0ZDIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBnZXRQcmVmaXhDbHMgfSBmcm9tICcuLi9jb25maWd1cmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhcmRHcmlkUHJvcHMge1xuICBwcmVmaXhDbHM/OiBzdHJpbmc7XG4gIHN0eWxlPzogQ1NTUHJvcGVydGllcztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufVxuXG5jb25zdCBHcmlkOiBTRkM8Q2FyZEdyaWRQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBwcmVmaXhDbHM6IGN1c3RvbWl6ZVByZWZpeENscywgY2xhc3NOYW1lLCAuLi5vdGhlcnMgfSA9IHByb3BzO1xuICBjb25zdCBwcmVmaXhDbHMgPSBnZXRQcmVmaXhDbHMoJ2NhcmQnLCBjdXN0b21pemVQcmVmaXhDbHMpO1xuICBjb25zdCBjbGFzc1N0cmluZyA9IGNsYXNzTmFtZXMoYCR7cHJlZml4Q2xzfS1ncmlkYCwgY2xhc3NOYW1lKTtcbiAgcmV0dXJuIDxkaXYgey4uLm90aGVyc30gY2xhc3NOYW1lPXtjbGFzc1N0cmluZ30gLz47XG59O1xuXG5HcmlkLmRpc3BsYXlOYW1lID0gJ0NhcmRHcmlkJztcblxuZXhwb3J0IGRlZmF1bHQgR3JpZDtcbiJdLCJ2ZXJzaW9uIjozfQ==