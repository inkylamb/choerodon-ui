import { __decorate } from "tslib";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, computed, get, set } from 'mobx';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import measureScrollbar from 'choerodon-ui/lib/_util/measureScrollbar';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import TableContext from './TableContext';
import { minColumnWidth } from './Column';
import TableEditor from './TableEditor';
import TableCol from './TableCol';
import { getColumnKey } from './utils';
import autobind from '../_util/autobind';
import { DRAG_KEY } from './TableStore';
let TableWrapper = class TableWrapper extends Component {
    get leafColumnsWidth() {
        const { tableStore } = this.context;
        const { lock } = this.props;
        switch (lock) {
            case "left" /* left */:
            case true:
                return tableStore.leftLeafColumnsWidth;
            case "right" /* right */:
                return tableStore.rightLeafColumnsWidth;
            default:
                if (tableStore.overflowX) {
                    return tableStore.totalLeafColumnsWidth;
                }
        }
        return undefined;
    }
    get leafEditorColumns() {
        const { tableStore } = this.context;
        const { lock } = this.props;
        switch (lock) {
            case "left" /* left */:
            case true:
                return tableStore.leftLeafColumns.filter(({ editor, name, hidden }) => editor && name && !hidden);
            case "right" /* right */:
                return tableStore.rightLeafColumns.filter(({ editor, name, hidden }) => editor && name && !hidden);
            default:
                return tableStore.leafColumns.filter(({ editor, name, hidden, lock: columnLock }) => editor && name && !hidden && (!columnLock || !tableStore.overflowX));
        }
    }
    get leafColumns() {
        const { tableStore } = this.context;
        const { lock } = this.props;
        switch (lock) {
            case "left" /* left */:
            case true:
                return tableStore.leftLeafColumns.filter(({ hidden }) => !hidden);
            case "right" /* right */:
                return tableStore.rightLeafColumns.filter(({ hidden }) => !hidden);
            default:
                return tableStore.leafColumns.filter(({ hidden }) => !hidden);
        }
    }
    handleResizeEnd() {
        const { tableStore } = this.context;
        if (tableStore.rowHeight === 'auto') {
            this.syncFixedTableRowHeight();
        }
    }
    getCol(column, width) {
        if (!column.hidden) {
            const { prefixCls } = this.props;
            return (React.createElement(TableCol, { key: getColumnKey(column), prefixCls: prefixCls, width: width, minWidth: minColumnWidth(column), onResizeEnd: this.handleResizeEnd }));
        }
    }
    getColGroup() {
        const { lock, hasHeader, hasFooter } = this.props;
        const { tableStore: { overflowY, overflowX }, } = this.context;
        let hasEmptyWidth = false;
        const filterDrag = (columnItem) => {
            const { dragColumnAlign } = this.props;
            if (dragColumnAlign) {
                return columnItem.key === DRAG_KEY;
            }
            return true;
        };
        const cols = this.leafColumns.filter(filterDrag).map((column, index, array) => {
            let width = get(column, 'width');
            if (!overflowX) {
                if (!hasEmptyWidth && index === array.length - 1) {
                    width = undefined;
                }
                else if (isNil(width)) {
                    hasEmptyWidth = true;
                }
            }
            return this.getCol(column, width);
        });
        if (overflowY && lock !== "left" /* left */ && (hasHeader || hasFooter)) {
            cols.push(React.createElement("col", { key: "fixed-column", style: { width: pxToRem(measureScrollbar()) } }));
        }
        return React.createElement("colgroup", null, cols);
    }
    getEditors() {
        const { prefixCls } = this.props;
        return this.leafEditorColumns.map(column => (React.createElement(TableEditor, { key: column.name, prefixCls: prefixCls, column: column })));
    }
    saveRef(node) {
        this.tableWrapper = node;
    }
    get tableWidth() {
        const { lock, hasBody, dragColumnAlign } = this.props;
        const { tableStore: { overflowY, overflowX, props: { virtual }, columns }, } = this.context;
        if (dragColumnAlign && columns && columns.length > 0) {
            const dragColumns = columns.filter((columnItem) => {
                return columnItem.key === DRAG_KEY;
            });
            if (dragColumns.length > 0) {
                return dragColumns[0].width;
            }
        }
        if (overflowX) {
            let tableWidth = this.leafColumnsWidth;
            if (tableWidth !== undefined && overflowY && lock !== "left" /* left */ && !hasBody) {
                if (!(virtual && lock === "right" /* right */)) {
                    tableWidth += measureScrollbar();
                }
            }
            return pxToRem(tableWidth);
        }
        return '100%';
    }
    render() {
        const { children, lock, hasBody, prefixCls } = this.props;
        const { tableStore: { overflowY, height }, } = this.context;
        const editors = hasBody && this.getEditors();
        const className = classNames({
            [`${prefixCls}-last-row-bordered`]: hasBody && !overflowY && height !== undefined,
        });
        const table = (React.createElement("table", { key: "table", ref: lock ? undefined : this.saveRef, className: className, style: { width: this.tableWidth } },
            this.getColGroup(),
            children));
        return [editors, table];
    }
    syncFixedTableRowHeight() {
        const { prefixCls, hasFooter, hasBody, hasHeader } = this.props;
        if (this.tableWrapper) {
            const { tableStore } = this.context;
            const { lockColumnsHeadRowsHeight, lockColumnsBodyRowsHeight, lockColumnsFootRowsHeight, } = tableStore;
            if (hasHeader) {
                const headRows = Array.from(this.tableWrapper.querySelectorAll('thead tr'));
                headRows.forEach((row, index) => set(lockColumnsHeadRowsHeight, index, row.offsetHeight));
            }
            if (hasBody) {
                const bodyRows = Array.from(this.tableWrapper.querySelectorAll(`.${prefixCls}-row`));
                bodyRows.forEach(row => set(lockColumnsBodyRowsHeight, row.dataset.index, row.offsetHeight));
            }
            if (hasFooter) {
                const footRows = Array.from(this.tableWrapper.querySelectorAll('tfoot tr'));
                footRows.forEach((row, index) => set(lockColumnsFootRowsHeight, index, row.offsetHeight));
            }
        }
    }
};
TableWrapper.contextType = TableContext;
TableWrapper.propTypes = {
    lock: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf(["right" /* right */, "left" /* left */]),
    ]),
    hasBody: PropTypes.bool,
    hasHeader: PropTypes.bool,
    hasFooter: PropTypes.bool,
};
__decorate([
    computed
], TableWrapper.prototype, "leafColumnsWidth", null);
__decorate([
    computed
], TableWrapper.prototype, "leafEditorColumns", null);
__decorate([
    computed
], TableWrapper.prototype, "leafColumns", null);
__decorate([
    autobind
], TableWrapper.prototype, "handleResizeEnd", null);
__decorate([
    autobind
], TableWrapper.prototype, "saveRef", null);
__decorate([
    computed
], TableWrapper.prototype, "tableWidth", null);
__decorate([
    action
], TableWrapper.prototype, "syncFixedTableRowHeight", null);
TableWrapper = __decorate([
    observer
], TableWrapper);
export default TableWrapper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3RhYmxlL1RhYmxlV3JhcHBlci50c3giLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFhLE1BQU0sT0FBTyxDQUFDO0FBQ3BELE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQztBQUNqQyxPQUFPLGdCQUFnQixNQUFNLHlDQUF5QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMvRCxPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxPQUFPLEVBQWUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXZELE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLFFBQVEsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUN2QyxPQUFPLFFBQVEsTUFBTSxtQkFBbUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBV3hDLElBQXFCLFlBQVksR0FBakMsTUFBcUIsWUFBYSxTQUFRLFNBQWlDO0lBZ0J6RSxJQUFJLGdCQUFnQjtRQUNsQixNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM1QixRQUFRLElBQUksRUFBRTtZQUNaLHVCQUFxQjtZQUNyQixLQUFLLElB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QUFJLFNBQVMsRUFBRTtnQkFDYixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUMvQyxDQUFDO2dCQUNGLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2FBQzNGO1NBQ0Y7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQTNOUSx3QkFBVyxHQUFHLFlBQVksQ0FBQztBQUUzQixzQkFBUyxHQUFHO0lBQ2pCLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQ3hCLFNBQVMsQ0FBQyxJQUFJO1FBQ2QsU0FBUyxDQUFDLEtBQUssQ0FBQyx3Q0FBbUMsQ0FBQztLQUNyRCxDQUFDO0lBQ0YsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJO0lBQ3ZCLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSTtJQUN6QixTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUk7Q0FDMUIsQ0FBQztBQUtGO0lBREMsUUFBUTtvREFnQlI7QUFHRDtJQURDLFFBQVE7cURBb0JSO0FBR0Q7SUFEQyxRQUFROytDQWFSO0FBR0Q7SUFEQyxRQUFRO21EQU1SO0FBeUREO0lBREMsUUFBUTsyQ0FHUjtBQUdEO0lBREMsUUFBUTs4Q0F5QlI7QUEyQkQ7SUFEQyxNQUFNOzJEQStCTjtBQTNOa0IsWUFBWTtJQURoQyxRQUFRO0dBQ1ksWUFBWSxDQTROaEM7ZUE1Tm9CLFlBQVkiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3RhYmxlL1RhYmxlV3JhcHBlci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSAnbW9ieC1yZWFjdCc7XG5pbXBvcnQgeyBhY3Rpb24sIGNvbXB1dGVkLCBnZXQsIHNldCB9IGZyb20gJ21vYngnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgaXNOaWwgZnJvbSAnbG9kYXNoL2lzTmlsJztcbmltcG9ydCBtZWFzdXJlU2Nyb2xsYmFyIGZyb20gJ2Nob2Vyb2Rvbi11aS9saWIvX3V0aWwvbWVhc3VyZVNjcm9sbGJhcic7XG5pbXBvcnQgeyBweFRvUmVtIH0gZnJvbSAnY2hvZXJvZG9uLXVpL2xpYi9fdXRpbC9Vbml0Q29udmVydG9yJztcbmltcG9ydCBUYWJsZUNvbnRleHQgZnJvbSAnLi9UYWJsZUNvbnRleHQnO1xuaW1wb3J0IHsgRWxlbWVudFByb3BzIH0gZnJvbSAnLi4vY29yZS9WaWV3Q29tcG9uZW50JztcbmltcG9ydCB7IENvbHVtblByb3BzLCBtaW5Db2x1bW5XaWR0aCB9IGZyb20gJy4vQ29sdW1uJztcbmltcG9ydCB7IENvbHVtbkxvY2ssIERyYWdDb2x1bW5BbGlnbiB9IGZyb20gJy4vZW51bSc7XG5pbXBvcnQgVGFibGVFZGl0b3IgZnJvbSAnLi9UYWJsZUVkaXRvcic7XG5pbXBvcnQgVGFibGVDb2wgZnJvbSAnLi9UYWJsZUNvbCc7XG5pbXBvcnQgeyBnZXRDb2x1bW5LZXkgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBhdXRvYmluZCBmcm9tICcuLi9fdXRpbC9hdXRvYmluZCc7XG5pbXBvcnQgeyBEUkFHX0tFWSB9IGZyb20gJy4vVGFibGVTdG9yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFibGVXcmFwcGVyUHJvcHMgZXh0ZW5kcyBFbGVtZW50UHJvcHMge1xuICBsb2NrPzogQ29sdW1uTG9jayB8IGJvb2xlYW47XG4gIGhhc0JvZHk/OiBib29sZWFuO1xuICBoYXNIZWFkZXI/OiBib29sZWFuO1xuICBoYXNGb290ZXI/OiBib29sZWFuO1xuICBkcmFnQ29sdW1uQWxpZ24/OkRyYWdDb2x1bW5BbGlnbixcbn1cblxuQG9ic2VydmVyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWJsZVdyYXBwZXIgZXh0ZW5kcyBDb21wb25lbnQ8VGFibGVXcmFwcGVyUHJvcHMsIGFueT4ge1xuICBzdGF0aWMgY29udGV4dFR5cGUgPSBUYWJsZUNvbnRleHQ7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBsb2NrOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFByb3BUeXBlcy5ib29sLFxuICAgICAgUHJvcFR5cGVzLm9uZU9mKFtDb2x1bW5Mb2NrLnJpZ2h0LCBDb2x1bW5Mb2NrLmxlZnRdKSxcbiAgICBdKSxcbiAgICBoYXNCb2R5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICBoYXNIZWFkZXI6IFByb3BUeXBlcy5ib29sLFxuICAgIGhhc0Zvb3RlcjogUHJvcFR5cGVzLmJvb2wsXG4gIH07XG5cbiAgdGFibGVXcmFwcGVyOiBIVE1MVGFibGVFbGVtZW50IHwgbnVsbDtcblxuICBAY29tcHV0ZWRcbiAgZ2V0IGxlYWZDb2x1bW5zV2lkdGgoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB7IHRhYmxlU3RvcmUgfSA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCB7IGxvY2sgfSA9IHRoaXMucHJvcHM7XG4gICAgc3dpdGNoIChsb2NrKSB7XG4gICAgICBjYXNlIENvbHVtbkxvY2subGVmdDpcbiAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgcmV0dXJuIHRhYmxlU3RvcmUubGVmdExlYWZDb2x1bW5zV2lkdGg7XG4gICAgICBjYXNlIENvbHVtbkxvY2sucmlnaHQ6XG4gICAgICAgIHJldHVybiB0YWJsZVN0b3JlLnJpZ2h0TGVhZkNvbHVtbnNXaWR0aDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmICh0YWJsZVN0b3JlLm92ZXJmbG93WCkge1xuICAgICAgICAgIHJldHVybiB0YWJsZVN0b3JlLnRvdGFsTGVhZkNvbHVtbnNXaWR0aDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgQGNvbXB1dGVkXG4gIGdldCBsZWFmRWRpdG9yQ29sdW1ucygpOiBDb2x1bW5Qcm9wc1tdIHtcbiAgICBjb25zdCB7IHRhYmxlU3RvcmUgfSA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCB7IGxvY2sgfSA9IHRoaXMucHJvcHM7XG4gICAgc3dpdGNoIChsb2NrKSB7XG4gICAgICBjYXNlIENvbHVtbkxvY2subGVmdDpcbiAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgcmV0dXJuIHRhYmxlU3RvcmUubGVmdExlYWZDb2x1bW5zLmZpbHRlcihcbiAgICAgICAgICAoeyBlZGl0b3IsIG5hbWUsIGhpZGRlbiB9KSA9PiBlZGl0b3IgJiYgbmFtZSAmJiAhaGlkZGVuLFxuICAgICAgICApO1xuICAgICAgY2FzZSBDb2x1bW5Mb2NrLnJpZ2h0OlxuICAgICAgICByZXR1cm4gdGFibGVTdG9yZS5yaWdodExlYWZDb2x1bW5zLmZpbHRlcihcbiAgICAgICAgICAoeyBlZGl0b3IsIG5hbWUsIGhpZGRlbiB9KSA9PiBlZGl0b3IgJiYgbmFtZSAmJiAhaGlkZGVuLFxuICAgICAgICApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRhYmxlU3RvcmUubGVhZkNvbHVtbnMuZmlsdGVyKFxuICAgICAgICAgICh7IGVkaXRvciwgbmFtZSwgaGlkZGVuLCBsb2NrOiBjb2x1bW5Mb2NrIH0pID0+XG4gICAgICAgICAgICBlZGl0b3IgJiYgbmFtZSAmJiAhaGlkZGVuICYmICghY29sdW1uTG9jayB8fCAhdGFibGVTdG9yZS5vdmVyZmxvd1gpLFxuICAgICAgICApO1xuICAgIH1cbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgbGVhZkNvbHVtbnMoKTogQ29sdW1uUHJvcHNbXSB7XG4gICAgY29uc3QgeyB0YWJsZVN0b3JlIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3QgeyBsb2NrIH0gPSB0aGlzLnByb3BzO1xuICAgIHN3aXRjaCAobG9jaykge1xuICAgICAgY2FzZSBDb2x1bW5Mb2NrLmxlZnQ6XG4gICAgICBjYXNlIHRydWU6XG4gICAgICAgIHJldHVybiB0YWJsZVN0b3JlLmxlZnRMZWFmQ29sdW1ucy5maWx0ZXIoKHsgaGlkZGVuIH0pID0+ICFoaWRkZW4pO1xuICAgICAgY2FzZSBDb2x1bW5Mb2NrLnJpZ2h0OlxuICAgICAgICByZXR1cm4gdGFibGVTdG9yZS5yaWdodExlYWZDb2x1bW5zLmZpbHRlcigoeyBoaWRkZW4gfSkgPT4gIWhpZGRlbik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGFibGVTdG9yZS5sZWFmQ29sdW1ucy5maWx0ZXIoKHsgaGlkZGVuIH0pID0+ICFoaWRkZW4pO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBoYW5kbGVSZXNpemVFbmQoKSB7XG4gICAgY29uc3QgeyB0YWJsZVN0b3JlIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgaWYgKHRhYmxlU3RvcmUucm93SGVpZ2h0ID09PSAnYXV0bycpIHtcbiAgICAgIHRoaXMuc3luY0ZpeGVkVGFibGVSb3dIZWlnaHQoKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb2woY29sdW1uLCB3aWR0aCk6IFJlYWN0Tm9kZSB7XG4gICAgaWYgKCFjb2x1bW4uaGlkZGVuKSB7XG4gICAgICBjb25zdCB7IHByZWZpeENscyB9ID0gdGhpcy5wcm9wcztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUYWJsZUNvbFxuICAgICAgICAgIGtleT17Z2V0Q29sdW1uS2V5KGNvbHVtbil9XG4gICAgICAgICAgcHJlZml4Q2xzPXtwcmVmaXhDbHN9XG4gICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgIG1pbldpZHRoPXttaW5Db2x1bW5XaWR0aChjb2x1bW4pfVxuICAgICAgICAgIG9uUmVzaXplRW5kPXt0aGlzLmhhbmRsZVJlc2l6ZUVuZH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29sR3JvdXAoKTogUmVhY3ROb2RlIHtcbiAgICBjb25zdCB7IGxvY2ssIGhhc0hlYWRlciwgaGFzRm9vdGVyIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIHRhYmxlU3RvcmU6IHsgb3ZlcmZsb3dZLCBvdmVyZmxvd1ggfSxcbiAgICB9ID0gdGhpcy5jb250ZXh0O1xuICAgIGxldCBoYXNFbXB0eVdpZHRoID0gZmFsc2U7XG5cbiAgICBjb25zdCBmaWx0ZXJEcmFnID0gKGNvbHVtbkl0ZW06Q29sdW1uUHJvcHMpID0+IHtcbiAgICAgIGNvbnN0IHtkcmFnQ29sdW1uQWxpZ259ID0gdGhpcy5wcm9wc1xuICAgICAgaWYoZHJhZ0NvbHVtbkFsaWduKXtcbiAgICAgICAgcmV0dXJuIGNvbHVtbkl0ZW0ua2V5ID09PSBEUkFHX0tFWVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBjb25zdCBjb2xzID0gdGhpcy5sZWFmQ29sdW1ucy5maWx0ZXIoZmlsdGVyRHJhZykubWFwKChjb2x1bW4sIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgbGV0IHdpZHRoID0gZ2V0KGNvbHVtbiwgJ3dpZHRoJyk7XG4gICAgICBpZiAoIW92ZXJmbG93WCkge1xuICAgICAgICBpZiAoIWhhc0VtcHR5V2lkdGggJiYgaW5kZXggPT09IGFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICB3aWR0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmIChpc05pbCh3aWR0aCkpIHtcbiAgICAgICAgICBoYXNFbXB0eVdpZHRoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29sKGNvbHVtbiwgd2lkdGgpO1xuICAgIH0pO1xuICAgIGlmIChvdmVyZmxvd1kgJiYgbG9jayAhPT0gQ29sdW1uTG9jay5sZWZ0ICYmIChoYXNIZWFkZXIgfHwgaGFzRm9vdGVyKSkge1xuICAgICAgY29scy5wdXNoKDxjb2wga2V5PVwiZml4ZWQtY29sdW1uXCIgc3R5bGU9e3sgd2lkdGg6IHB4VG9SZW0obWVhc3VyZVNjcm9sbGJhcigpKSB9fSAvPik7XG4gICAgfVxuICAgIHJldHVybiA8Y29sZ3JvdXA+e2NvbHN9PC9jb2xncm91cD47XG4gIH1cblxuICBnZXRFZGl0b3JzKCkge1xuICAgIGNvbnN0IHsgcHJlZml4Q2xzIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiB0aGlzLmxlYWZFZGl0b3JDb2x1bW5zLm1hcChjb2x1bW4gPT4gKFxuICAgICAgPFRhYmxlRWRpdG9yIGtleT17Y29sdW1uLm5hbWV9IHByZWZpeENscz17cHJlZml4Q2xzfSBjb2x1bW49e2NvbHVtbn0gLz5cbiAgICApKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBzYXZlUmVmKG5vZGUpIHtcbiAgICB0aGlzLnRhYmxlV3JhcHBlciA9IG5vZGU7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IHRhYmxlV2lkdGgoKSB7XG4gICAgY29uc3QgeyBsb2NrLCBoYXNCb2R5LCBkcmFnQ29sdW1uQWxpZ24gfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge1xuICAgICAgdGFibGVTdG9yZTogeyBvdmVyZmxvd1ksIG92ZXJmbG93WCxwcm9wczogeyB2aXJ0dWFsIH0sIGNvbHVtbnMgfSxcbiAgICB9ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYoZHJhZ0NvbHVtbkFsaWduICYmIGNvbHVtbnMgJiYgY29sdW1ucy5sZW5ndGggPiAwKXtcbiAgICAgY29uc3QgZHJhZ0NvbHVtbnMgPSBjb2x1bW5zLmZpbHRlcigoY29sdW1uSXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gY29sdW1uSXRlbS5rZXkgPT09IERSQUdfS0VZXG4gICAgICB9KVxuICAgICAgaWYoZHJhZ0NvbHVtbnMubGVuZ3RoID4gMCl7XG4gICAgICAgIHJldHVybiBkcmFnQ29sdW1uc1swXS53aWR0aCBcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG92ZXJmbG93WCkge1xuICAgICAgbGV0IHRhYmxlV2lkdGggPSB0aGlzLmxlYWZDb2x1bW5zV2lkdGg7XG4gICAgICBpZiAodGFibGVXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG92ZXJmbG93WSAmJiBsb2NrICE9PSBDb2x1bW5Mb2NrLmxlZnQgJiYgIWhhc0JvZHkgKSB7XG4gICAgICAgIGlmKCEodmlydHVhbCAmJiBsb2NrID09PSBDb2x1bW5Mb2NrLnJpZ2h0KSl7XG4gICAgICAgICAgdGFibGVXaWR0aCArPSBtZWFzdXJlU2Nyb2xsYmFyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBweFRvUmVtKHRhYmxlV2lkdGgpO1xuICAgIH1cbiAgICByZXR1cm4gJzEwMCUnO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2hpbGRyZW4sIGxvY2ssIGhhc0JvZHksIHByZWZpeENscyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7XG4gICAgICB0YWJsZVN0b3JlOiB7IG92ZXJmbG93WSwgaGVpZ2h0IH0sXG4gICAgfSA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCBlZGl0b3JzID0gaGFzQm9keSAmJiB0aGlzLmdldEVkaXRvcnMoKTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBjbGFzc05hbWVzKHtcbiAgICAgIFtgJHtwcmVmaXhDbHN9LWxhc3Qtcm93LWJvcmRlcmVkYF06IGhhc0JvZHkgJiYgIW92ZXJmbG93WSAmJiBoZWlnaHQgIT09IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICBjb25zdCB0YWJsZSA9IChcbiAgICAgIDx0YWJsZVxuICAgICAgICBrZXk9XCJ0YWJsZVwiXG4gICAgICAgIHJlZj17bG9jayA/IHVuZGVmaW5lZCA6IHRoaXMuc2F2ZVJlZn1cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgIHN0eWxlPXt7IHdpZHRoOiB0aGlzLnRhYmxlV2lkdGggfX1cbiAgICAgID5cbiAgICAgICAge3RoaXMuZ2V0Q29sR3JvdXAoKX1cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC90YWJsZT5cbiAgICApO1xuXG4gICAgcmV0dXJuIFtlZGl0b3JzLCB0YWJsZV07XG4gIH1cblxuICBAYWN0aW9uXG4gIHN5bmNGaXhlZFRhYmxlUm93SGVpZ2h0KCkge1xuICAgIGNvbnN0IHsgcHJlZml4Q2xzLCBoYXNGb290ZXIsIGhhc0JvZHksIGhhc0hlYWRlciB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAodGhpcy50YWJsZVdyYXBwZXIpIHtcbiAgICAgIGNvbnN0IHsgdGFibGVTdG9yZSB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgY29uc3Qge1xuICAgICAgICBsb2NrQ29sdW1uc0hlYWRSb3dzSGVpZ2h0LFxuICAgICAgICBsb2NrQ29sdW1uc0JvZHlSb3dzSGVpZ2h0LFxuICAgICAgICBsb2NrQ29sdW1uc0Zvb3RSb3dzSGVpZ2h0LFxuICAgICAgfSA9IHRhYmxlU3RvcmU7XG4gICAgICBpZiAoaGFzSGVhZGVyKSB7XG4gICAgICAgIGNvbnN0IGhlYWRSb3dzID0gQXJyYXkuZnJvbTxIVE1MVGFibGVSb3dFbGVtZW50PihcbiAgICAgICAgICB0aGlzLnRhYmxlV3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCd0aGVhZCB0cicpLFxuICAgICAgICApO1xuICAgICAgICBoZWFkUm93cy5mb3JFYWNoKChyb3csIGluZGV4KSA9PiBzZXQobG9ja0NvbHVtbnNIZWFkUm93c0hlaWdodCwgaW5kZXgsIHJvdy5vZmZzZXRIZWlnaHQpKTtcbiAgICAgIH1cbiAgICAgIGlmIChoYXNCb2R5KSB7XG4gICAgICAgIGNvbnN0IGJvZHlSb3dzID0gQXJyYXkuZnJvbTxIVE1MVGFibGVSb3dFbGVtZW50PihcbiAgICAgICAgICB0aGlzLnRhYmxlV3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKGAuJHtwcmVmaXhDbHN9LXJvd2ApLFxuICAgICAgICApO1xuICAgICAgICBib2R5Um93cy5mb3JFYWNoKHJvdyA9PlxuICAgICAgICAgIHNldChsb2NrQ29sdW1uc0JvZHlSb3dzSGVpZ2h0LCByb3cuZGF0YXNldC5pbmRleCwgcm93Lm9mZnNldEhlaWdodCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoaGFzRm9vdGVyKSB7XG4gICAgICAgIGNvbnN0IGZvb3RSb3dzID0gQXJyYXkuZnJvbTxIVE1MVGFibGVSb3dFbGVtZW50PihcbiAgICAgICAgICB0aGlzLnRhYmxlV3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCd0Zm9vdCB0cicpLFxuICAgICAgICApO1xuICAgICAgICBmb290Um93cy5mb3JFYWNoKChyb3csIGluZGV4KSA9PiBzZXQobG9ja0NvbHVtbnNGb290Um93c0hlaWdodCwgaW5kZXgsIHJvdy5vZmZzZXRIZWlnaHQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLCJ2ZXJzaW9uIjozfQ==