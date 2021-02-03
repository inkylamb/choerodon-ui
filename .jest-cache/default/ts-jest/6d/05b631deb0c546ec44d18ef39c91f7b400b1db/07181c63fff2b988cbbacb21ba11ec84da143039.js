import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from '../grid';
import { getPrefixCls } from '../configure';
export const Meta = props => {
    const { prefixCls: customizePrefixCls, className, avatar, title, description, ...others } = props;
    const prefixCls = getPrefixCls('list', customizePrefixCls);
    const classString = classNames(`${prefixCls}-item-meta`, className);
    const content = (React.createElement("div", { className: `${prefixCls}-item-meta-content` },
        title && React.createElement("h4", { className: `${prefixCls}-item-meta-title` }, title),
        description && React.createElement("div", { className: `${prefixCls}-item-meta-description` }, description)));
    return (React.createElement("div", Object.assign({}, others, { className: classString }),
        avatar && React.createElement("div", { className: `${prefixCls}-item-meta-avatar` }, avatar),
        (title || description) && content));
};
Meta.displayName = 'ListMeta';
function getGrid(grid, t) {
    return grid[t] && Math.floor(24 / grid[t]);
}
const GridColumns = ['', 1, 2, 3, 4, 6, 8, 12, 24];
export default class Item extends Component {
    render() {
        const { grid } = this.context;
        const { prefixCls: customizePrefixCls, children, actions, extra, className, ...others } = this.props;
        const prefixCls = getPrefixCls('list', customizePrefixCls);
        const classString = classNames(`${prefixCls}-item`, className);
        const metaContent = [];
        const otherContent = [];
        Children.forEach(children, (element) => {
            if (element && element.type && element.type === Meta) {
                metaContent.push(element);
            }
            else {
                otherContent.push(element);
            }
        });
        const contentClassString = classNames(`${prefixCls}-item-content`, {
            [`${prefixCls}-item-content-single`]: metaContent.length < 1,
        });
        const content = otherContent.length > 0 ? React.createElement("div", { className: contentClassString }, otherContent) : null;
        let actionsContent;
        if (actions && actions.length > 0) {
            const actionsContentItem = (action, i) => (React.createElement("li", { key: `${prefixCls}-item-action-${i}` },
                action,
                i !== actions.length - 1 && React.createElement("em", { className: `${prefixCls}-item-action-split` })));
            actionsContent = (React.createElement("ul", { className: `${prefixCls}-item-action` }, actions.map((action, i) => actionsContentItem(action, i))));
        }
        const extraContent = (React.createElement("div", { className: `${prefixCls}-item-extra-wrap` },
            React.createElement("div", { className: `${prefixCls}-item-main` },
                metaContent,
                content,
                actionsContent),
            React.createElement("div", { className: `${prefixCls}-item-extra` }, extra)));
        const mainContent = grid ? (React.createElement(Col, { span: getGrid(grid, 'column'), xs: getGrid(grid, 'xs'), sm: getGrid(grid, 'sm'), md: getGrid(grid, 'md'), lg: getGrid(grid, 'lg'), xl: getGrid(grid, 'xl'), xxl: getGrid(grid, 'xxl') },
            React.createElement("div", Object.assign({}, others, { className: classString }),
                extra && extraContent,
                !extra && metaContent,
                !extra && content,
                !extra && actionsContent))) : (React.createElement("div", Object.assign({}, others, { className: classString }),
            extra && extraContent,
            !extra && metaContent,
            !extra && content,
            !extra && actionsContent));
        return mainContent;
    }
}
Item.displayName = 'ListItem';
Item.Meta = Meta;
Item.propTypes = {
    column: PropTypes.oneOf(GridColumns),
    xs: PropTypes.oneOf(GridColumns),
    sm: PropTypes.oneOf(GridColumns),
    md: PropTypes.oneOf(GridColumns),
    lg: PropTypes.oneOf(GridColumns),
    xl: PropTypes.oneOf(GridColumns),
    xxl: PropTypes.oneOf(GridColumns),
};
Item.contextTypes = {
    grid: PropTypes.any,
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvbGlzdC9JdGVtLnRzeCIsIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQStDLE1BQU0sT0FBTyxDQUFDO0FBQ2hHLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUU5QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBc0I1QyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQTJCLEtBQUssQ0FBQyxFQUFFO0lBQ2xELE1BQU0sRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEdBQUcsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ2xHLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUUzRCxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxTQUFTLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVwRSxNQUFNLE9BQU8sR0FBRyxDQUNkLDZCQUFLLFNBQVMsRUFBRSxHQUFHLFNBQVMsb0JBQW9CO1FBQzdDLEtBQUssSUFBSSw0QkFBSSxTQUFTLEVBQUUsR0FBRyxTQUFTLGtCQUFrQixJQUFHLEtBQUssQ0FBTTtRQUNwRSxXQUFXLElBQUksNkJBQUssU0FBUyxFQUFFLEdBQUcsU0FBUyx3QkFBd0IsSUFBRyxXQUFXLENBQU8sQ0FDckYsQ0FDUCxDQUFDO0lBRUYsT0FBTyxDQUNMLDZDQUFTLE1BQU0sSUFBRSxTQUFTLEVBQUUsV0FBVztRQUNwQyxNQUFNLElBQUksNkJBQUssU0FBUyxFQUFFLEdBQUcsU0FBUyxtQkFBbUIsSUFBRyxNQUFNLENBQU87UUFDekUsQ0FBQyxL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LFNBQUksR0FBZ0IsSUFBSSxDQUFDO0FBRXpCLGNBQVMsR0FBRztJQUNqQixNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7SUFDcEMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ2hDLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNoQyxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7SUFDaEMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ2hDLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNoQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7Q0FDbEMsQ0FBQztBQUVLLGlCQUFZLEdBQUc7SUFDcEIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxHQUFHO0NBQ3BCLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvbGlzdC9JdGVtLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ2hpbGRyZW4sIENvbXBvbmVudCwgQ1NTUHJvcGVydGllcywgUmVhY3RFbGVtZW50LCBSZWFjdE5vZGUsIFNGQyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IENvbCB9IGZyb20gJy4uL2dyaWQnO1xuaW1wb3J0IHsgQ29sdW1uVHlwZSwgTGlzdEdyaWRUeXBlIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgeyBnZXRQcmVmaXhDbHMgfSBmcm9tICcuLi9jb25maWd1cmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpc3RJdGVtUHJvcHMge1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGNoaWxkcmVuPzogUmVhY3ROb2RlO1xuICBwcmVmaXhDbHM/OiBzdHJpbmc7XG4gIHN0eWxlPzogQ1NTUHJvcGVydGllcztcbiAgZXh0cmE/OiBSZWFjdE5vZGU7XG4gIGFjdGlvbnM/OiBBcnJheTxSZWFjdE5vZGU+O1xuICBncmlkPzogTGlzdEdyaWRUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpc3RJdGVtTWV0YVByb3BzIHtcbiAgYXZhdGFyPzogUmVhY3ROb2RlO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGNoaWxkcmVuPzogUmVhY3ROb2RlO1xuICBkZXNjcmlwdGlvbj86IFJlYWN0Tm9kZTtcbiAgcHJlZml4Q2xzPzogc3RyaW5nO1xuICBzdHlsZT86IENTU1Byb3BlcnRpZXM7XG4gIHRpdGxlPzogUmVhY3ROb2RlO1xufVxuXG5leHBvcnQgY29uc3QgTWV0YTogU0ZDPExpc3RJdGVtTWV0YVByb3BzPiA9IHByb3BzID0+IHtcbiAgY29uc3QgeyBwcmVmaXhDbHM6IGN1c3RvbWl6ZVByZWZpeENscywgY2xhc3NOYW1lLCBhdmF0YXIsIHRpdGxlLCBkZXNjcmlwdGlvbiwgLi4ub3RoZXJzIH0gPSBwcm9wcztcbiAgY29uc3QgcHJlZml4Q2xzID0gZ2V0UHJlZml4Q2xzKCdsaXN0JywgY3VzdG9taXplUHJlZml4Q2xzKTtcblxuICBjb25zdCBjbGFzc1N0cmluZyA9IGNsYXNzTmFtZXMoYCR7cHJlZml4Q2xzfS1pdGVtLW1ldGFgLCBjbGFzc05hbWUpO1xuXG4gIGNvbnN0IGNvbnRlbnQgPSAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2Ake3ByZWZpeENsc30taXRlbS1tZXRhLWNvbnRlbnRgfT5cbiAgICAgIHt0aXRsZSAmJiA8aDQgY2xhc3NOYW1lPXtgJHtwcmVmaXhDbHN9LWl0ZW0tbWV0YS10aXRsZWB9Pnt0aXRsZX08L2g0Pn1cbiAgICAgIHtkZXNjcmlwdGlvbiAmJiA8ZGl2IGNsYXNzTmFtZT17YCR7cHJlZml4Q2xzfS1pdGVtLW1ldGEtZGVzY3JpcHRpb25gfT57ZGVzY3JpcHRpb259PC9kaXY+fVxuICAgIDwvZGl2PlxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiB7Li4ub3RoZXJzfSBjbGFzc05hbWU9e2NsYXNzU3RyaW5nfT5cbiAgICAgIHthdmF0YXIgJiYgPGRpdiBjbGFzc05hbWU9e2Ake3ByZWZpeENsc30taXRlbS1tZXRhLWF2YXRhcmB9PnthdmF0YXJ9PC9kaXY+fVxuICAgICAgeyh0aXRsZSB8fCBkZXNjcmlwdGlvbikgJiYgY29udGVudH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk1ldGEuZGlzcGxheU5hbWUgPSAnTGlzdE1ldGEnO1xuXG5mdW5jdGlvbiBnZXRHcmlkKGdyaWQ6IExpc3RHcmlkVHlwZSwgdDogQ29sdW1uVHlwZSkge1xuICByZXR1cm4gZ3JpZFt0XSAmJiBNYXRoLmZsb29yKDI0IC8gZ3JpZFt0XSEpO1xufVxuXG5jb25zdCBHcmlkQ29sdW1ucyA9IFsnJywgMSwgMiwgMywgNCwgNiwgOCwgMTIsIDI0XTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSBleHRlbmRzIENvbXBvbmVudDxMaXN0SXRlbVByb3BzLCBhbnk+IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ0xpc3RJdGVtJztcblxuICBzdGF0aWMgTWV0YTogdHlwZW9mIE1ldGEgPSBNZXRhO1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29sdW1uOiBQcm9wVHlwZXMub25lT2YoR3JpZENvbHVtbnMpLFxuICAgIHhzOiBQcm9wVHlwZXMub25lT2YoR3JpZENvbHVtbnMpLFxuICAgIHNtOiBQcm9wVHlwZXMub25lT2YoR3JpZENvbHVtbnMpLFxuICAgIG1kOiBQcm9wVHlwZXMub25lT2YoR3JpZENvbHVtbnMpLFxuICAgIGxnOiBQcm9wVHlwZXMub25lT2YoR3JpZENvbHVtbnMpLFxuICAgIHhsOiBQcm9wVHlwZXMub25lT2YoR3JpZENvbHVtbnMpLFxuICAgIHh4bDogUHJvcFR5cGVzLm9uZU9mKEdyaWRDb2x1bW5zKSxcbiAgfTtcblxuICBzdGF0aWMgY29udGV4dFR5cGVzID0ge1xuICAgIGdyaWQ6IFByb3BUeXBlcy5hbnksXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZ3JpZCB9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IHtcbiAgICAgIHByZWZpeENsczogY3VzdG9taXplUHJlZml4Q2xzLFxuICAgICAgY2hpbGRyZW4sXG4gICAgICBhY3Rpb25zLFxuICAgICAgZXh0cmEsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICAuLi5vdGhlcnNcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBwcmVmaXhDbHMgPSBnZXRQcmVmaXhDbHMoJ2xpc3QnLCBjdXN0b21pemVQcmVmaXhDbHMpO1xuICAgIGNvbnN0IGNsYXNzU3RyaW5nID0gY2xhc3NOYW1lcyhgJHtwcmVmaXhDbHN9LWl0ZW1gLCBjbGFzc05hbWUpO1xuXG4gICAgY29uc3QgbWV0YUNvbnRlbnQ6IFJlYWN0RWxlbWVudDxhbnk+W10gPSBbXTtcbiAgICBjb25zdCBvdGhlckNvbnRlbnQ6IFJlYWN0RWxlbWVudDxhbnk+W10gPSBbXTtcblxuICAgIENoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4sIChlbGVtZW50OiBSZWFjdEVsZW1lbnQ8YW55PikgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZSA9PT0gTWV0YSkge1xuICAgICAgICBtZXRhQ29udGVudC5wdXNoKGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3RoZXJDb250ZW50LnB1c2goZWxlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250ZW50Q2xhc3NTdHJpbmcgPSBjbGFzc05hbWVzKGAke3ByZWZpeENsc30taXRlbS1jb250ZW50YCwge1xuICAgICAgW2Ake3ByZWZpeENsc30taXRlbS1jb250ZW50LXNpbmdsZWBdOiBtZXRhQ29udGVudC5sZW5ndGggPCAxLFxuICAgIH0pO1xuICAgIGNvbnN0IGNvbnRlbnQgPVxuICAgICAgb3RoZXJDb250ZW50Lmxlbmd0aCA+IDAgPyA8ZGl2IGNsYXNzTmFtZT17Y29udGVudENsYXNzU3RyaW5nfT57b3RoZXJDb250ZW50fTwvZGl2PiA6IG51bGw7XG5cbiAgICBsZXQgYWN0aW9uc0NvbnRlbnQ7XG4gICAgaWYgKGFjdGlvbnMgJiYgYWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBhY3Rpb25zQ29udGVudEl0ZW0gPSAoYWN0aW9uOiBSZWFjdE5vZGUsIGk6IG51bWJlcikgPT4gKFxuICAgICAgICA8bGkga2V5PXtgJHtwcmVmaXhDbHN9LWl0ZW0tYWN0aW9uLSR7aX1gfT5cbiAgICAgICAgICB7YWN0aW9ufVxuICAgICAgICAgIHtpICE9PSBhY3Rpb25zLmxlbmd0aCAtIDEgJiYgPGVtIGNsYXNzTmFtZT17YCR7cHJlZml4Q2xzfS1pdGVtLWFjdGlvbi1zcGxpdGB9IC8+fVxuICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICAgIGFjdGlvbnNDb250ZW50ID0gKFxuICAgICAgICA8dWwgY2xhc3NOYW1lPXtgJHtwcmVmaXhDbHN9LWl0ZW0tYWN0aW9uYH0+XG4gICAgICAgICAge2FjdGlvbnMubWFwKChhY3Rpb24sIGkpID0+IGFjdGlvbnNDb250ZW50SXRlbShhY3Rpb24sIGkpKX1cbiAgICAgICAgPC91bD5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZXh0cmFDb250ZW50ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake3ByZWZpeENsc30taXRlbS1leHRyYS13cmFwYH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtwcmVmaXhDbHN9LWl0ZW0tbWFpbmB9PlxuICAgICAgICAgIHttZXRhQ29udGVudH1cbiAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgICB7YWN0aW9uc0NvbnRlbnR9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7cHJlZml4Q2xzfS1pdGVtLWV4dHJhYH0+e2V4dHJhfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGNvbnN0IG1haW5Db250ZW50ID0gZ3JpZCA/IChcbiAgICAgIDxDb2xcbiAgICAgICAgc3Bhbj17Z2V0R3JpZChncmlkLCAnY29sdW1uJyl9XG4gICAgICAgIHhzPXtnZXRHcmlkKGdyaWQsICd4cycpfVxuICAgICAgICBzbT17Z2V0R3JpZChncmlkLCAnc20nKX1cbiAgICAgICAgbWQ9e2dldEdyaWQoZ3JpZCwgJ21kJyl9XG4gICAgICAgIGxnPXtnZXRHcmlkKGdyaWQsICdsZycpfVxuICAgICAgICB4bD17Z2V0R3JpZChncmlkLCAneGwnKX1cbiAgICAgICAgeHhsPXtnZXRHcmlkKGdyaWQsICd4eGwnKX1cbiAgICAgID5cbiAgICAgICAgPGRpdiB7Li4ub3RoZXJzfSBjbGFzc05hbWU9e2NsYXNzU3RyaW5nfT5cbiAgICAgICAgICB7ZXh0cmEgJiYgZXh0cmFDb250ZW50fVxuICAgICAgICAgIHshZXh0cmEgJiYgbWV0YUNvbnRlbnR9XG4gICAgICAgICAgeyFleHRyYSAmJiBjb250ZW50fVxuICAgICAgICAgIHshZXh0cmEgJiYgYWN0aW9uc0NvbnRlbnR9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Db2w+XG4gICAgKSA6IChcbiAgICAgIDxkaXYgey4uLm90aGVyc30gY2xhc3NOYW1lPXtjbGFzc1N0cmluZ30+XG4gICAgICAgIHtleHRyYSAmJiBleHRyYUNvbnRlbnR9XG4gICAgICAgIHshZXh0cmEgJiYgbWV0YUNvbnRlbnR9XG4gICAgICAgIHshZXh0cmEgJiYgY29udGVudH1cbiAgICAgICAgeyFleHRyYSAmJiBhY3Rpb25zQ29udGVudH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG5cbiAgICByZXR1cm4gbWFpbkNvbnRlbnQ7XG4gIH1cbn1cbiJdLCJ2ZXJzaW9uIjozfQ==