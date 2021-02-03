import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LAYER_WIDTH } from './constants';
import { isNullOrUndefined, defaultClassPrefix, getUnhandledProps, prefix } from './utils';
import TableContext from './TableContext';
import Column from './Column';
export const propTypes = {
    align: PropTypes.oneOf(['left', 'center', 'right']),
    verticalAlign: PropTypes.oneOf(['top', 'middle', 'bottom']),
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    dataKey: PropTypes.string,
    isHeaderCell: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    left: PropTypes.number,
    headerHeight: PropTypes.number,
    style: PropTypes.object,
    firstColumn: PropTypes.bool,
    lastColumn: PropTypes.bool,
    hasChildren: PropTypes.bool,
    children: PropTypes.any,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rowIndex: PropTypes.number,
    rowData: PropTypes.object,
    depth: PropTypes.number,
    onTreeToggle: PropTypes.func,
    renderTreeToggle: PropTypes.func,
    renderCell: PropTypes.func,
    wordWrap: PropTypes.bool,
    removed: PropTypes.bool,
    treeCol: PropTypes.bool,
    expanded: PropTypes.bool,
    groupHeader: PropTypes.node,
    groupCount: PropTypes.number,
};
class Cell extends React.PureComponent {
    constructor() {
        super(...arguments);
        // @ts-ignore
        this.addPrefix = (name) => prefix(this.props.classPrefix)(name);
        this.handleExpandClick = (event) => {
            const { rowKey, rowIndex, rowData } = this.props;
            this.props.onTreeToggle?.(rowKey, rowIndex, rowData, event);
        };
    }
    isTreeCol() {
        const { treeCol, firstColumn } = this.props;
        const { hasCustomTreeCol } = this.context;
        if (treeCol) {
            return true;
        }
        if (!hasCustomTreeCol && firstColumn) {
            return true;
        }
        return false;
    }
    getHeight() {
        const { height, rowData } = this.props;
        // @ts-ignore
        return typeof height === 'function' ? height(rowData) : height;
    }
    renderTreeNodeExpandIcon() {
        const { rowData, renderTreeToggle, hasChildren, expanded } = this.props;
        const expandButton = React.createElement("i", { className: this.addPrefix('expand-icon icon') });
        if (this.isTreeCol() && hasChildren) {
            return (React.createElement("span", { role: "button", tabIndex: -1, className: this.addPrefix('expand-wrapper'), onClick: this.handleExpandClick }, renderTreeToggle ? renderTreeToggle(expandButton, rowData, expanded) : expandButton));
        }
        return null;
    }
    render() {
        const { width, left, style, className, firstColumn, lastColumn, isHeaderCell, headerHeight, align, children, rowData, dataKey, rowIndex, renderCell, removed, wordWrap, classPrefix, depth, verticalAlign, expanded, ...rest } = this.props;
        if (removed) {
            return null;
        }
        const classes = classNames(classPrefix, className, {
            [this.addPrefix('expanded')]: expanded && this.isTreeCol(),
            [this.addPrefix('first')]: firstColumn,
            [this.addPrefix('last')]: lastColumn,
        });
        const { rtl } = this.context;
        const nextHeight = isHeaderCell ? headerHeight : this.getHeight();
        const styles = {
            width,
            height: nextHeight,
            zIndex: depth,
            [rtl ? 'right' : 'left']: left,
        };
        const contentStyles = {
            width,
            height: nextHeight,
            textAlign: align,
            [rtl ? 'paddingRight' : 'paddingLeft']: this.isTreeCol() ? depth * LAYER_WIDTH + 10 : null,
            ...style,
        };
        if (verticalAlign) {
            contentStyles.display = 'table-cell';
            contentStyles.verticalAlign = verticalAlign;
        }
        // @ts-ignore
        let cellContent = isNullOrUndefined(children) && rowData ? rowData[dataKey] : children;
        if (typeof children === 'function') {
            const getChildren = children;
            cellContent = getChildren(rowData, rowIndex);
        }
        const unhandledProps = getUnhandledProps(Cell, getUnhandledProps(Column, rest));
        const cell = renderCell ? renderCell(cellContent) : cellContent;
        const content = wordWrap ? (React.createElement("div", { className: this.addPrefix('wrap') },
            this.renderTreeNodeExpandIcon(),
            cell)) : (React.createElement(React.Fragment, null,
            this.renderTreeNodeExpandIcon(),
            cell));
        return (React.createElement("div", Object.assign({}, unhandledProps, { className: classes, style: styles }),
            React.createElement("div", { className: this.addPrefix('content'), style: contentStyles }, content)));
    }
}
Cell.contextType = TableContext;
Cell.propTypes = propTypes;
Cell.defaultProps = {
    classPrefix: defaultClassPrefix('performance-table-cell'),
    headerHeight: 36,
    depth: 0,
    height: 36,
    width: 0,
    left: 0,
};
export default Cell;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3BlcmZvcm1hbmNlLXRhYmxlL0NlbGwudHN4IiwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQy9CLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzNGLE9BQU8sWUFBWSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUc5QixNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUc7SUFDdkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELGFBQWEsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzRCxTQUFTLEVBQUUsU0FBUyxDQUFDLE1BQU07SUFDM0IsV0FBVyxFQUFFLFNBQVMsQ0FBQyxNQUFNO0lBQzdCLE9BQU8sRUFBRSxTQUFTLENBQUMsTUFBTTtJQUN6QixZQUFZLEVBQUUsU0FBUyxDQUFDLElBQUk7SUFDNUIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNO0lBQ3ZCLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0QsSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNO0lBQ3RCLFlBQVksRUFBRSxTQUFTLENBQUMsTUFBTTtJQUM5QixLQUFLLEVBQUUsU0FBUyxDQUFDLE1B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QUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ25DLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtZQUMvQixJQUFJLENBQ0QsQ0FDUCxDQUFDLENBQUMsQ0FBQyxDQUNGLG9CQUFDLEtBQUssQ0FBQyxRQUFRO1lBQ1osSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQy9CLElBQUksQ0FDVSxDQUNsQixDQUFDO1FBRUYsT0FBTyxDQUNMLDZDQUFTLGNBQWMsSUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNO1lBQ3hELDZCQUFLLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxhQUFhLElBQzVELE9BQU8sQ0FDSixDQUNGLENBQ1AsQ0FBQztJQUNKLENBQUM7O0FBbEpNLGdCQUFXLEdBQUcsWUFBWSxDQUFDO0FBQzNCLGNBQVMsR0FBRyxTQUFTLENBQUM7QUFDdEIsaUJBQVksR0FBRztJQUNwQixXQUFXLEVBQUUsa0JBQWtCLENBQUMsd0JBQXdCLENBQUM7SUFDekQsWUFBWSxFQUFFLEVBQUU7SUFDaEIsS0FBSyxFQUFFLENBQUM7SUFDUixNQUFNLEVBQUUsRUFBRTtJQUNWLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxFQUFFLENBQUM7Q0FDUixDQUFDO0FBNElKLGVBQWUsSUFBSSxDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9odWlodWF3ay9Eb2N1bWVudHMvb3B0L2Nob2Vyb2Rvbi11aS9jb21wb25lbnRzLXByby9wZXJmb3JtYW5jZS10YWJsZS9DZWxsLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBMQVlFUl9XSURUSCB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGlzTnVsbE9yVW5kZWZpbmVkLCBkZWZhdWx0Q2xhc3NQcmVmaXgsIGdldFVuaGFuZGxlZFByb3BzLCBwcmVmaXggfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBUYWJsZUNvbnRleHQgZnJvbSAnLi9UYWJsZUNvbnRleHQnO1xuaW1wb3J0IENvbHVtbiBmcm9tICcuL0NvbHVtbic7XG5pbXBvcnQgeyBDZWxsUHJvcHMgfSBmcm9tICcuL0NlbGwuZCc7XG5cbmV4cG9ydCBjb25zdCBwcm9wVHlwZXMgPSB7XG4gIGFsaWduOiBQcm9wVHlwZXMub25lT2YoWydsZWZ0JywgJ2NlbnRlcicsICdyaWdodCddKSxcbiAgdmVydGljYWxBbGlnbjogUHJvcFR5cGVzLm9uZU9mKFsndG9wJywgJ21pZGRsZScsICdib3R0b20nXSksXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRhdGFLZXk6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlzSGVhZGVyQ2VsbDogUHJvcFR5cGVzLmJvb2wsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5udW1iZXIsIFByb3BUeXBlcy5mdW5jXSksXG4gIGxlZnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGhlYWRlckhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGZpcnN0Q29sdW1uOiBQcm9wVHlwZXMuYm9vbCxcbiAgbGFzdENvbHVtbjogUHJvcFR5cGVzLmJvb2wsXG4gIGhhc0NoaWxkcmVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hbnksXG4gIHJvd0tleTogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLm51bWJlcl0pLFxuICByb3dJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgcm93RGF0YTogUHJvcFR5cGVzLm9iamVjdCxcbiAgZGVwdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uVHJlZVRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMsXG4gIHJlbmRlclRyZWVUb2dnbGU6IFByb3BUeXBlcy5mdW5jLFxuICByZW5kZXJDZWxsOiBQcm9wVHlwZXMuZnVuYyxcbiAgd29yZFdyYXA6IFByb3BUeXBlcy5ib29sLFxuICByZW1vdmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgdHJlZUNvbDogUHJvcFR5cGVzLmJvb2wsXG4gIGV4cGFuZGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZ3JvdXBIZWFkZXI6IFByb3BUeXBlcy5ub2RlLFxuICBncm91cENvdW50OiBQcm9wVHlwZXMubnVtYmVyLFxufTtcblxuY2xhc3MgQ2VsbCBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQ8Q2VsbFByb3BzPiB7XG4gIHN0YXRpYyBjb250ZXh0VHlwZSA9IFRhYmxlQ29udGV4dDtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHByb3BUeXBlcztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjbGFzc1ByZWZpeDogZGVmYXVsdENsYXNzUHJlZml4KCdwZXJmb3JtYW5jZS10YWJsZS1jZWxsJyksXG4gICAgaGVhZGVySGVpZ2h0OiAzNixcbiAgICBkZXB0aDogMCxcbiAgICBoZWlnaHQ6IDM2LFxuICAgIHdpZHRoOiAwLFxuICAgIGxlZnQ6IDAsXG4gIH07XG5cbiAgLy8gQHRzLWlnbm9yZVxuICBhZGRQcmVmaXggPSAobmFtZTogc3RyaW5nKSA9PiBwcmVmaXgodGhpcy5wcm9wcy5jbGFzc1ByZWZpeCkobmFtZSk7XG5cbiAgaXNUcmVlQ29sKCkge1xuICAgIGNvbnN0IHsgdHJlZUNvbCwgZmlyc3RDb2x1bW4gfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBoYXNDdXN0b21UcmVlQ29sIH0gPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAodHJlZUNvbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFoYXNDdXN0b21UcmVlQ29sICYmIGZpcnN0Q29sdW1uKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRIZWlnaHQoKSB7XG4gICAgY29uc3QgeyBoZWlnaHQsIHJvd0RhdGEgfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiB0eXBlb2YgaGVpZ2h0ID09PSAnZnVuY3Rpb24nID8gaGVpZ2h0KHJvd0RhdGEpIDogaGVpZ2h0O1xuICB9XG5cbiAgaGFuZGxlRXhwYW5kQ2xpY2sgPSAoZXZlbnQ6IFJlYWN0Lk1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB7IHJvd0tleSwgcm93SW5kZXgsIHJvd0RhdGEgfSA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy5wcm9wcy5vblRyZWVUb2dnbGU/Lihyb3dLZXksIHJvd0luZGV4LCByb3dEYXRhLCBldmVudCk7XG4gIH07XG5cbiAgcmVuZGVyVHJlZU5vZGVFeHBhbmRJY29uKCkge1xuICAgIGNvbnN0IHsgcm93RGF0YSwgcmVuZGVyVHJlZVRvZ2dsZSwgaGFzQ2hpbGRyZW4sIGV4cGFuZGVkIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGV4cGFuZEJ1dHRvbiA9IDxpIGNsYXNzTmFtZT17dGhpcy5hZGRQcmVmaXgoJ2V4cGFuZC1pY29uIGljb24nKX0gLz47XG5cbiAgICBpZiAodGhpcy5pc1RyZWVDb2woKSAmJiBoYXNDaGlsZHJlbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICB0YWJJbmRleD17LTF9XG4gICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLmFkZFByZWZpeCgnZXhwYW5kLXdyYXBwZXInKX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUV4cGFuZENsaWNrfVxuICAgICAgICA+XG4gICAgICAgICAge3JlbmRlclRyZWVUb2dnbGUgPyByZW5kZXJUcmVlVG9nZ2xlKGV4cGFuZEJ1dHRvbiwgcm93RGF0YSwgZXhwYW5kZWQpIDogZXhwYW5kQnV0dG9ufVxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgbGVmdCxcbiAgICAgIHN0eWxlLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZmlyc3RDb2x1bW4sXG4gICAgICBsYXN0Q29sdW1uLFxuICAgICAgaXNIZWFkZXJDZWxsLFxuICAgICAgaGVhZGVySGVpZ2h0LFxuICAgICAgYWxpZ24sXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHJvd0RhdGEsXG4gICAgICBkYXRhS2V5LFxuICAgICAgcm93SW5kZXgsXG4gICAgICByZW5kZXJDZWxsLFxuICAgICAgcmVtb3ZlZCxcbiAgICAgIHdvcmRXcmFwLFxuICAgICAgY2xhc3NQcmVmaXgsXG4gICAgICBkZXB0aCxcbiAgICAgIHZlcnRpY2FsQWxpZ24sXG4gICAgICBleHBhbmRlZCxcbiAgICAgIC4uLnJlc3RcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc2VzID0gY2xhc3NOYW1lcyhjbGFzc1ByZWZpeCwgY2xhc3NOYW1lLCB7XG4gICAgICBbdGhpcy5hZGRQcmVmaXgoJ2V4cGFuZGVkJyldOiBleHBhbmRlZCAmJiB0aGlzLmlzVHJlZUNvbCgpLFxuICAgICAgW3RoaXMuYWRkUHJlZml4KCdmaXJzdCcpXTogZmlyc3RDb2x1bW4sXG4gICAgICBbdGhpcy5hZGRQcmVmaXgoJ2xhc3QnKV06IGxhc3RDb2x1bW4sXG4gICAgfSk7XG4gICAgY29uc3QgeyBydGwgfSA9IHRoaXMuY29udGV4dDtcblxuICAgIGNvbnN0IG5leHRIZWlnaHQgPSBpc0hlYWRlckNlbGwgPyBoZWFkZXJIZWlnaHQgOiB0aGlzLmdldEhlaWdodCgpO1xuICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0OiBuZXh0SGVpZ2h0LFxuICAgICAgekluZGV4OiBkZXB0aCxcbiAgICAgIFtydGwgPyAncmlnaHQnIDogJ2xlZnQnXTogbGVmdCxcbiAgICB9O1xuXG4gICAgY29uc3QgY29udGVudFN0eWxlczogUmVhY3QuQ1NTUHJvcGVydGllcyA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0OiBuZXh0SGVpZ2h0LFxuICAgICAgdGV4dEFsaWduOiBhbGlnbixcbiAgICAgIFtydGwgPyAncGFkZGluZ1JpZ2h0JyA6ICdwYWRkaW5nTGVmdCddOiB0aGlzLmlzVHJlZUNvbCgpID8gZGVwdGggKiBMQVlFUl9XSURUSCArIDEwIDogbnVsbCxcbiAgICAgIC4uLnN0eWxlLFxuICAgIH07XG5cbiAgICBpZiAodmVydGljYWxBbGlnbikge1xuICAgICAgY29udGVudFN0eWxlcy5kaXNwbGF5ID0gJ3RhYmxlLWNlbGwnO1xuICAgICAgY29udGVudFN0eWxlcy52ZXJ0aWNhbEFsaWduID0gdmVydGljYWxBbGlnbjtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgbGV0IGNlbGxDb250ZW50ID0gaXNOdWxsT3JVbmRlZmluZWQoY2hpbGRyZW4pICYmIHJvd0RhdGEgPyByb3dEYXRhW2RhdGFLZXldIDogY2hpbGRyZW47XG5cbiAgICBpZiAodHlwZW9mIGNoaWxkcmVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBnZXRDaGlsZHJlbiA9IGNoaWxkcmVuIGFzIEZ1bmN0aW9uO1xuICAgICAgY2VsbENvbnRlbnQgPSBnZXRDaGlsZHJlbihyb3dEYXRhLCByb3dJbmRleCk7XG4gICAgfVxuXG4gICAgY29uc3QgdW5oYW5kbGVkUHJvcHMgPSBnZXRVbmhhbmRsZWRQcm9wcyhDZWxsLCBnZXRVbmhhbmRsZWRQcm9wcyhDb2x1bW4sIHJlc3QpKTtcbiAgICBjb25zdCBjZWxsID0gcmVuZGVyQ2VsbCA/IHJlbmRlckNlbGwoY2VsbENvbnRlbnQpIDogY2VsbENvbnRlbnQ7XG4gICAgY29uc3QgY29udGVudCA9IHdvcmRXcmFwID8gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuYWRkUHJlZml4KCd3cmFwJyl9PlxuICAgICAgICB7dGhpcy5yZW5kZXJUcmVlTm9kZUV4cGFuZEljb24oKX1cbiAgICAgICAge2NlbGx9XG4gICAgICA8L2Rpdj5cbiAgICApIDogKFxuICAgICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgICB7dGhpcy5yZW5kZXJUcmVlTm9kZUV4cGFuZEljb24oKX1cbiAgICAgICAge2NlbGx9XG4gICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiB7Li4udW5oYW5kbGVkUHJvcHN9IGNsYXNzTmFtZT17Y2xhc3Nlc30gc3R5bGU9e3N0eWxlc30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmFkZFByZWZpeCgnY29udGVudCcpfSBzdHlsZT17Y29udGVudFN0eWxlc30+XG4gICAgICAgICAge2NvbnRlbnR9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDZWxsO1xuIl0sInZlcnNpb24iOjN9