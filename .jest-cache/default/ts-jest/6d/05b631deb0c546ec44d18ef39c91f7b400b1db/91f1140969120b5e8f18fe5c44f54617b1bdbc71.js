import * as React from 'react';
import classNames from 'classnames';
class Paragraph extends React.Component {
    getWidth(index) {
        const { width, rows = 2 } = this.props;
        if (Array.isArray(width)) {
            return width[index];
        }
        // last paragraph
        if (rows - 1 === index) {
            return width;
        }
        return undefined;
    }
    render() {
        const { prefixCls, className, style, rows } = this.props;
        const rowList = [...Array(rows)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        React.createElement("li", { key: index, style: { width: this.getWidth(index) } })));
        return (React.createElement("ul", { className: classNames(prefixCls, className), style: style }, rowList));
    }
}
export default Paragraph;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvc2tlbGV0b24vUGFyYWdyYXBoLnRzeCIsIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFZcEMsTUFBTSxTQUFVLFNBQVEsS0FBSyxDQUFDLFNBQXFDO0lBQ2pFLFFBQVEsQ0FBQyxLQUFhO1FBQ3BCLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsaUJBQWlCO1FBQ2pCLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDdEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1FBQ2pELG9EQUFvRDtRQUNwRCw0QkFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUksQ0FDM0QsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUNMLDRCQUFJLFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLElBQzFELE9BQU8sQ0FDTCxDQUNOLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxlQUFlLFNBQVMsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIvVXNlcnMvaHVpaHVhd2svRG9jdW1lbnRzL29wdC9jaG9lcm9kb24tdWkvY29tcG9uZW50cy9za2VsZXRvbi9QYXJhZ3JhcGgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG50eXBlIHdpZHRoVW5pdCA9IG51bWJlciB8IHN0cmluZztcblxuZXhwb3J0IGludGVyZmFjZSBTa2VsZXRvblBhcmFncmFwaFByb3BzIHtcbiAgcHJlZml4Q2xzPzogc3RyaW5nO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIHN0eWxlPzogb2JqZWN0O1xuICB3aWR0aD86IHdpZHRoVW5pdCB8IEFycmF5PHdpZHRoVW5pdD47XG4gIHJvd3M/OiBudW1iZXI7XG59XG5cbmNsYXNzIFBhcmFncmFwaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxTa2VsZXRvblBhcmFncmFwaFByb3BzLCB7fT4ge1xuICBnZXRXaWR0aChpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgcm93cyA9IDIgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkod2lkdGgpKSB7XG4gICAgICByZXR1cm4gd2lkdGhbaW5kZXhdO1xuICAgIH1cbiAgICAvLyBsYXN0IHBhcmFncmFwaFxuICAgIGlmIChyb3dzIC0gMSA9PT0gaW5kZXgpIHtcbiAgICAgIHJldHVybiB3aWR0aDtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByZWZpeENscywgY2xhc3NOYW1lLCBzdHlsZSwgcm93cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCByb3dMaXN0ID0gWy4uLkFycmF5KHJvd3MpXS5tYXAoKF8sIGluZGV4KSA9PiAoXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3Qvbm8tYXJyYXktaW5kZXgta2V5XG4gICAgICA8bGkga2V5PXtpbmRleH0gc3R5bGU9e3sgd2lkdGg6IHRoaXMuZ2V0V2lkdGgoaW5kZXgpIH19IC8+XG4gICAgKSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBjbGFzc05hbWU9e2NsYXNzTmFtZXMocHJlZml4Q2xzLCBjbGFzc05hbWUpfSBzdHlsZT17c3R5bGV9PlxuICAgICAgICB7cm93TGlzdH1cbiAgICAgIDwvdWw+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJhZ3JhcGg7XG4iXSwidmVyc2lvbiI6M30=