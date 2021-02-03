import React, { Children, cloneElement, isValidElement, PureComponent, } from 'react';
import Animate from '../animate';
import MouseDown from './MouseDown';
export default class RippleChild extends PureComponent {
    constructor() {
        super(...arguments);
        this.handleMouseDown = (child, size) => {
            const { prefixCls } = this.props;
            const { children, style } = child.props;
            const componentProps = {
                className: `${prefixCls}-wrapper`,
            };
            if (size) {
                const { x, y, width, height } = size;
                const maxWidth = Math.max(width - x, x);
                const maxHeight = Math.max(height - y, y);
                const max = Math.sqrt(maxWidth * maxWidth + maxHeight * maxHeight);
                this.currentCircleStyle = {
                    width: max + max,
                    height: max + max,
                    left: x - max,
                    top: y - max,
                };
            }
            const newProps = {
                children: [
                    children,
                    React.createElement(Animate, { key: "ripple", component: "div", componentProps: componentProps, transitionName: size ? 'zoom-small-slow' : 'fade', hiddenProp: "hidden" }, this.currentCircleStyle && (React.createElement("div", { hidden: !size, className: prefixCls, key: "circle", style: this.currentCircleStyle }))),
                ],
                style: this.currentStyle || style,
            };
            if (size && size.position === 'static') {
                newProps.style = { ...style, position: 'relative' };
                this.currentStyle = newProps.style;
            }
            return cloneElement(child, newProps);
        };
        this.ripple = (child) => {
            if (isValidElement(child)) {
                return React.createElement(MouseDown, { rippleChild: child }, this.handleMouseDown);
            }
            return child;
        };
    }
    render() {
        const { children } = this.props;
        return this.ripple(Children.only(children));
    }
}
RippleChild.displayName = 'RippleChild';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvcmlwcGxlL1JpcHBsZUNoaWxkLnRzeCIsIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssRUFBRSxFQUNaLFFBQVEsRUFDUixZQUFZLEVBQ1osY0FBYyxFQUNkLGFBQWEsR0FHZCxNQUFNLE9BQU8sQ0FBQztBQUNmLE9BQU8sT0FBTyxNQUFNLFlBQVksQ0FBQztBQUNqQyxPQUFPLFNBQW1CLE1BQU0sYUFBYSxDQUFDO0FBTTlDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBWSxTQUFRLGFBQStCO0lBQXhFOztRQVlFLG9CQUFlLEdBQUcsQ0FBQyxLQUF3QixFQUFFLElBQVcsRUFBRSxFQUFFO1lBQzFELE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2pDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QyxNQUFNLGNBQWMsR0FBUTtnQkFDMUIsU0FBUyxFQUFFLEdBQUcsU0FBUyxVQUFVO2FBQ2xDLENBQUM7WUFDRixJQUFJLElBQUksRUFBRTtnQkFDUixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQztnQkFDbkUsSUFBSSxDQUFDLGtCQUFrQixHQUFHO29CQUN4QixLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUc7b0JBQ2hCLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FBRztvQkFDakIsSUFBSSxFQUFFLENBQUMsR0FBRyxHQUFHO29CQUNiLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRztpQkFDYixDQUFDO2FBQ0g7WUFDRCxNQUFNLFFBQVEsR0FBUTtnQkFDcEIsUUFBUSxFQUFFO29CQUNSLFFBQVE7b0JBQ1Isb0JBQUMsT0FBTyxJQUNOLEdBQUcsRUFBQyxRQUFRLEVBQ1osU0FBUyxFQUFDLEtBQUssRUFDZixjQUFjLEVBQUUsY0FBYyxFQUM5QixjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUNqRCxVQUFVLEVBQUMsUUFBUSxJQUVsQixJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FDMUIsNkJBQ0UsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUNiLFNBQVMsRUFBRSxTQUFTLEVBQ3BCLEdBQUcsRUFBQyxRQUFRLEVBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsR0FDOUIsQ0FDSCxDQUNPO2lCQUNYO2dCQUNELEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxJQUFJLEtBQUs7YUFDbEMsQ0FBQztZQUNGLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO2dCQUN0QyxRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDO2dCQUNwRCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7YUFDcEM7WUFDRCxPQUFPLFlBQVksQ0FBTSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDO1FBRUYsV0FBTSxHQUFHLENBQUMsS0FBZ0IsRUFBRSxFQUFFO1lBQzVCLElBQUksY0FBYyxDQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixPQUFPLG9CQUFDLFNBQVMsSUFBQyxXQUFXLEVBQUUsS0FBSyxJQUFHLElBQUksQ0FBQyxlQUFlLENBQWEsQ0FBQzthQUMxRTtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQTFEQyxNQUFNO1FBQ0osTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDOztBQVRNLHVCQUFXLEdBQUcsYUFBYSxDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9odWlodWF3ay9Eb2N1bWVudHMvb3B0L2Nob2Vyb2Rvbi11aS9jb21wb25lbnRzL3JpcHBsZS9SaXBwbGVDaGlsZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7XG4gIENoaWxkcmVuLFxuICBjbG9uZUVsZW1lbnQsXG4gIGlzVmFsaWRFbGVtZW50LFxuICBQdXJlQ29tcG9uZW50LFxuICBSZWFjdE5vZGUsXG4gIFJlYWN0RWxlbWVudCxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFuaW1hdGUgZnJvbSAnLi4vYW5pbWF0ZSc7XG5pbXBvcnQgTW91c2VEb3duLCB7IFNpemUgfSBmcm9tICcuL01vdXNlRG93bic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlQ2hpbGRQcm9wcyB7XG4gIHByZWZpeENscz86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmlwcGxlQ2hpbGQgZXh0ZW5kcyBQdXJlQ29tcG9uZW50PFJpcHBsZUNoaWxkUHJvcHM+IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ1JpcHBsZUNoaWxkJztcblxuICBjdXJyZW50Q2lyY2xlU3R5bGU6IGFueTtcblxuICBjdXJyZW50U3R5bGU6IGFueTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gdGhpcy5yaXBwbGUoQ2hpbGRyZW4ub25seShjaGlsZHJlbikpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duID0gKGNoaWxkOiBSZWFjdEVsZW1lbnQ8YW55Piwgc2l6ZT86IFNpemUpID0+IHtcbiAgICBjb25zdCB7IHByZWZpeENscyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBzdHlsZSB9ID0gY2hpbGQucHJvcHM7XG4gICAgY29uc3QgY29tcG9uZW50UHJvcHM6IGFueSA9IHtcbiAgICAgIGNsYXNzTmFtZTogYCR7cHJlZml4Q2xzfS13cmFwcGVyYCxcbiAgICB9O1xuICAgIGlmIChzaXplKSB7XG4gICAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IHNpemU7XG4gICAgICBjb25zdCBtYXhXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0geCwgeCk7XG4gICAgICBjb25zdCBtYXhIZWlnaHQgPSBNYXRoLm1heChoZWlnaHQgLSB5LCB5KTtcbiAgICAgIGNvbnN0IG1heCA9IE1hdGguc3FydChtYXhXaWR0aCAqIG1heFdpZHRoICsgbWF4SGVpZ2h0ICogbWF4SGVpZ2h0KTtcbiAgICAgIHRoaXMuY3VycmVudENpcmNsZVN0eWxlID0ge1xuICAgICAgICB3aWR0aDogbWF4ICsgbWF4LFxuICAgICAgICBoZWlnaHQ6IG1heCArIG1heCxcbiAgICAgICAgbGVmdDogeCAtIG1heCxcbiAgICAgICAgdG9wOiB5IC0gbWF4LFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgbmV3UHJvcHM6IGFueSA9IHtcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICA8QW5pbWF0ZVxuICAgICAgICAgIGtleT1cInJpcHBsZVwiXG4gICAgICAgICAgY29tcG9uZW50PVwiZGl2XCJcbiAgICAgICAgICBjb21wb25lbnRQcm9wcz17Y29tcG9uZW50UHJvcHN9XG4gICAgICAgICAgdHJhbnNpdGlvbk5hbWU9e3NpemUgPyAnem9vbS1zbWFsbC1zbG93JyA6ICdmYWRlJ31cbiAgICAgICAgICBoaWRkZW5Qcm9wPVwiaGlkZGVuXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLmN1cnJlbnRDaXJjbGVTdHlsZSAmJiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGhpZGRlbj17IXNpemV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17cHJlZml4Q2xzfVxuICAgICAgICAgICAgICBrZXk9XCJjaXJjbGVcIlxuICAgICAgICAgICAgICBzdHlsZT17dGhpcy5jdXJyZW50Q2lyY2xlU3R5bGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQW5pbWF0ZT4sXG4gICAgICBdLFxuICAgICAgc3R5bGU6IHRoaXMuY3VycmVudFN0eWxlIHx8IHN0eWxlLFxuICAgIH07XG4gICAgaWYgKHNpemUgJiYgc2l6ZS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgIG5ld1Byb3BzLnN0eWxlID0geyAuLi5zdHlsZSwgcG9zaXRpb246ICdyZWxhdGl2ZScgfTtcbiAgICAgIHRoaXMuY3VycmVudFN0eWxlID0gbmV3UHJvcHMuc3R5bGU7XG4gICAgfVxuICAgIHJldHVybiBjbG9uZUVsZW1lbnQ8YW55PihjaGlsZCwgbmV3UHJvcHMpO1xuICB9O1xuXG4gIHJpcHBsZSA9IChjaGlsZDogUmVhY3ROb2RlKSA9PiB7XG4gICAgaWYgKGlzVmFsaWRFbGVtZW50PGFueT4oY2hpbGQpKSB7XG4gICAgICByZXR1cm4gPE1vdXNlRG93biByaXBwbGVDaGlsZD17Y2hpbGR9Pnt0aGlzLmhhbmRsZU1vdXNlRG93bn08L01vdXNlRG93bj47XG4gICAgfVxuICAgIHJldHVybiBjaGlsZDtcbiAgfTtcbn1cbiJdLCJ2ZXJzaW9uIjozfQ==