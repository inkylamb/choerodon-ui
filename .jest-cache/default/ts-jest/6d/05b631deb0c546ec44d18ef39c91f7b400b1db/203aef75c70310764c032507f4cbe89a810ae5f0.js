import { __decorate } from "tslib";
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classes from 'component-classes';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import TableContext from './TableContext';
import autobind from '../_util/autobind';
export default class TableCol extends PureComponent {
    render() {
        const { width, minWidth } = this.props;
        return (React.createElement("col", { style: { width: pxToRem(width), minWidth: pxToRem(minWidth) }, onTransitionEnd: this.handleTransitionEnd }));
    }
    componentDidMount() {
        const { prefixCls } = this.props;
        const { tableStore: { node: { element }, }, } = this.context;
        if (element && classes(element).has(`${prefixCls}-resizing`)) {
            this.fireResizeEnd();
        }
    }
    componentDidUpdate(prevProps) {
        const { width } = prevProps;
        if (!width || isNaN(width)) {
            this.fireResizeEnd();
        }
    }
    handleTransitionEnd() {
        this.fireResizeEnd();
    }
    fireResizeEnd() {
        const { onResizeEnd } = this.props;
        onResizeEnd();
    }
}
TableCol.displayName = 'TableCol';
TableCol.contextType = TableContext;
TableCol.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onResizeEnd: PropTypes.func.isRequired,
};
__decorate([
    autobind
], TableCol.prototype, "handleTransitionEnd", null);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3RhYmxlL1RhYmxlQ29sLnRzeCIsIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDN0MsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sT0FBTyxNQUFNLG1CQUFtQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUUvRCxPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLFFBQVEsTUFBTSxtQkFBbUIsQ0FBQztBQVF6QyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVMsU0FBUSxhQUE0QjtJQVdoRSxNQUFNO1FBQ0osTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLE9BQU8sQ0FDTCw2QkFDRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFDN0QsZUFBZSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsR0FDekMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELGlCQUFpQjtRQUNmLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2pDLE1BQU0sRUFDSixVQUFVLEVBQUUsRUFDVixJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FDbEIsR0FDRixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDakIsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsV0FBVyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVELGtCQUFrQixDQUFDLFNBQVM7UUFDMUIsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBR0QsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsYUFBYTtRQUNYLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ25DLFdBQVcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7O0FBL0NNLG9CQUFXLEdBQUcsVUFBVSxDQUFDO0FBRXpCLG9CQUFXLEdBQUcsWUFBWSxDQUFDO0FBRTNCLGtCQUFTLEdBQUc7SUFDakIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRSxRQUFRLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLFdBQVcsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7Q0FDdkMsQ0FBQztBQWdDRjtJQURDLFFBQVE7bURBR1IiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3RhYmxlL1RhYmxlQ29sLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgUHVyZUNvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NlcyBmcm9tICdjb21wb25lbnQtY2xhc3Nlcyc7XG5pbXBvcnQgeyBweFRvUmVtIH0gZnJvbSAnY2hvZXJvZG9uLXVpL2xpYi9fdXRpbC9Vbml0Q29udmVydG9yJztcbmltcG9ydCB7IEVsZW1lbnRQcm9wcyB9IGZyb20gJy4uL2NvcmUvVmlld0NvbXBvbmVudCc7XG5pbXBvcnQgVGFibGVDb250ZXh0IGZyb20gJy4vVGFibGVDb250ZXh0JztcbmltcG9ydCBhdXRvYmluZCBmcm9tICcuLi9fdXRpbC9hdXRvYmluZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFibGVDb2xQcm9wcyBleHRlbmRzIEVsZW1lbnRQcm9wcyB7XG4gIHdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuICBtaW5XaWR0aD86IG51bWJlciB8IHN0cmluZztcbiAgb25SZXNpemVFbmQ6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhYmxlQ29sIGV4dGVuZHMgUHVyZUNvbXBvbmVudDxUYWJsZUNvbFByb3BzPiB7XG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdUYWJsZUNvbCc7XG5cbiAgc3RhdGljIGNvbnRleHRUeXBlID0gVGFibGVDb250ZXh0O1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5udW1iZXIsIFByb3BUeXBlcy5zdHJpbmddKSxcbiAgICBtaW5XaWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLm51bWJlciwgUHJvcFR5cGVzLnN0cmluZ10pLFxuICAgIG9uUmVzaXplRW5kOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBtaW5XaWR0aCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGNvbFxuICAgICAgICBzdHlsZT17eyB3aWR0aDogcHhUb1JlbSh3aWR0aCksIG1pbldpZHRoOiBweFRvUmVtKG1pbldpZHRoKSB9fVxuICAgICAgICBvblRyYW5zaXRpb25FbmQ9e3RoaXMuaGFuZGxlVHJhbnNpdGlvbkVuZH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHsgcHJlZml4Q2xzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIHRhYmxlU3RvcmU6IHtcbiAgICAgICAgbm9kZTogeyBlbGVtZW50IH0sXG4gICAgICB9LFxuICAgIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgaWYgKGVsZW1lbnQgJiYgY2xhc3NlcyhlbGVtZW50KS5oYXMoYCR7cHJlZml4Q2xzfS1yZXNpemluZ2ApKSB7XG4gICAgICB0aGlzLmZpcmVSZXNpemVFbmQoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgY29uc3QgeyB3aWR0aCB9ID0gcHJldlByb3BzO1xuICAgIGlmICghd2lkdGggfHwgaXNOYU4od2lkdGgpKSB7XG4gICAgICB0aGlzLmZpcmVSZXNpemVFbmQoKTtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgaGFuZGxlVHJhbnNpdGlvbkVuZCgpIHtcbiAgICB0aGlzLmZpcmVSZXNpemVFbmQoKTtcbiAgfVxuXG4gIGZpcmVSZXNpemVFbmQoKSB7XG4gICAgY29uc3QgeyBvblJlc2l6ZUVuZCB9ID0gdGhpcy5wcm9wcztcbiAgICBvblJlc2l6ZUVuZCgpO1xuICB9XG59XG4iXSwidmVyc2lvbiI6M30=