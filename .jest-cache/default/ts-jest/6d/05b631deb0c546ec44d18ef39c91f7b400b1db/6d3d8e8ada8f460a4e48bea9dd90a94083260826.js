import { __decorate } from "tslib";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowequal from 'lodash/isEqual';
import Icon from '../icon';
import autobind from '../_util/autobind';
export default class ExpandIcon extends Component {
    shouldComponentUpdate(nextProps) {
        return !shallowequal(nextProps, this.props);
    }
    handleClick(e) {
        e.stopPropagation();
        const { onChange } = this.props;
        onChange(e);
    }
    render() {
        const { prefixCls, expanded, expandable } = this.props;
        const iconPrefixCls = `${prefixCls}-expand-icon`;
        const classString = classNames(iconPrefixCls, {
            [`${iconPrefixCls}-expanded`]: expanded,
            [`${iconPrefixCls}-spaced`]: !expandable,
        });
        return (React.createElement(Icon, { type: "baseline-arrow_right", className: classString, onClick: expandable ? this.handleClick : undefined, tabIndex: expandable ? 0 : -1 }));
    }
}
ExpandIcon.propTypes = {
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};
__decorate([
    autobind
], ExpandIcon.prototype, "handleClick", null);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3RhYmxlL0V4cGFuZEljb24udHN4IiwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUN6QyxPQUFPLFNBQVMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sWUFBWSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUUzQixPQUFPLFFBQVEsTUFBTSxtQkFBbUIsQ0FBQztBQVF6QyxNQUFNLENBQUMsT0FBTyxPQUFPLFVBQVcsU0FBUSxTQUEwQjtJQU9oRSxxQkFBcUIsQ0FBQyxTQUFTO1FBQzdCLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBR0QsV0FBVyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDaEMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLEdBQUcsU0FBUyxjQUFjLENBQUM7UUFDakQsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLGFBQWEsRUFBRTtZQUM1QyxDQUFDLEdBQUcsYUFBYSxXQUFXLENBQUMsRUFBRSxRQUFRO1lBQ3ZDLENBQUMsR0FBRyxhQUFhLFNBQVMsQ0FBQyxFQUFFLENBQUMsVUFBVTtTQUN6QyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQ0wsb0JBQUMsSUFBSSxJQUNILElBQUksRUFBQyxzQkFBc0IsRUFDM0IsU0FBUyxFQUFFLFdBQVcsRUFDdEIsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUNsRCxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUM3QixDQUNILENBQUM7SUFDSixDQUFDOztBQWhDTSxvQkFBUyxHQUFHO0lBQ2pCLFVBQVUsRUFBRSxTQUFTLENBQUMsSUFBSTtJQUMxQixRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUk7SUFDeEIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVTtDQUNwQyxDQUFDO0FBT0Y7SUFEQyxRQUFROzZDQUtSIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9odWlodWF3ay9Eb2N1bWVudHMvb3B0L2Nob2Vyb2Rvbi11aS9jb21wb25lbnRzLXByby90YWJsZS9FeHBhbmRJY29uLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHNoYWxsb3dlcXVhbCBmcm9tICdsb2Rhc2gvaXNFcXVhbCc7XG5pbXBvcnQgSWNvbiBmcm9tICcuLi9pY29uJztcbmltcG9ydCB7IEVsZW1lbnRQcm9wcyB9IGZyb20gJy4uL2NvcmUvVmlld0NvbXBvbmVudCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnLi4vX3V0aWwvYXV0b2JpbmQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEV4cGFuZEljb25Qcm9wcyBleHRlbmRzIEVsZW1lbnRQcm9wcyB7XG4gIGV4cGFuZGFibGU/OiBib29sZWFuO1xuICBleHBhbmRlZD86IGJvb2xlYW47XG4gIG9uQ2hhbmdlOiAoZSkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwYW5kSWNvbiBleHRlbmRzIENvbXBvbmVudDxFeHBhbmRJY29uUHJvcHM+IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBleHBhbmRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBleHBhbmRlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgIHJldHVybiAhc2hhbGxvd2VxdWFsKG5leHRQcm9wcywgdGhpcy5wcm9wcyk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgeyBvbkNoYW5nZSB9ID0gdGhpcy5wcm9wcztcbiAgICBvbkNoYW5nZShlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByZWZpeENscywgZXhwYW5kZWQsIGV4cGFuZGFibGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaWNvblByZWZpeENscyA9IGAke3ByZWZpeENsc30tZXhwYW5kLWljb25gO1xuICAgIGNvbnN0IGNsYXNzU3RyaW5nID0gY2xhc3NOYW1lcyhpY29uUHJlZml4Q2xzLCB7XG4gICAgICBbYCR7aWNvblByZWZpeENsc30tZXhwYW5kZWRgXTogZXhwYW5kZWQsXG4gICAgICBbYCR7aWNvblByZWZpeENsc30tc3BhY2VkYF06ICFleHBhbmRhYmxlLFxuICAgIH0pO1xuICAgIHJldHVybiAoXG4gICAgICA8SWNvblxuICAgICAgICB0eXBlPVwiYmFzZWxpbmUtYXJyb3dfcmlnaHRcIlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzU3RyaW5nfVxuICAgICAgICBvbkNsaWNrPXtleHBhbmRhYmxlID8gdGhpcy5oYW5kbGVDbGljayA6IHVuZGVmaW5lZH1cbiAgICAgICAgdGFiSW5kZXg9e2V4cGFuZGFibGUgPyAwIDogLTF9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdLCJ2ZXJzaW9uIjozfQ==