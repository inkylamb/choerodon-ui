import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import DropDown from '../dropdown';
import { getPrefixCls } from '../configure';
import Icon from '../icon';
import List from '../list';
import buildPlacements from './placements';
const BreadcrumbItem = ({ prefixCls: customizePrefixCls, separator = '/', menuList = [], children, overlay, listProps, dropdownProps, ...restProps }) => {
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
    const [active, setActive] = useState(false);
    const isMenuListOn = !!(menuList && menuList.length > 0);
    const onVisibleChange = async (visible) => {
        if (menuList.length > 0) {
            setActive(visible);
        }
    };
    /**
     * 渲染Link
     * @param childrenLink
     * @param restPropsLink
     */
    const renderLink = (childrenLink, restPropsLink, classNameLink, key) => {
        if (key in restPropsLink) {
            return (React.createElement("a", Object.assign({ className: `${prefixCls}-${classNameLink}` }, restPropsLink), childrenLink));
        }
        return (React.createElement("span", Object.assign({ className: `${prefixCls}-${classNameLink}` }, restPropsLink), childrenLink));
    };
    /**
     * 渲染List列表
     */
    const renderList = (React.createElement(List, Object.assign({ className: `${prefixCls}-overlay-menu-list`, grid: { gutter: 0, column: 3 } }, listProps, { dataSource: menuList, renderItem: item => {
            const { href } = item;
            const { listChildren, listItemName, ...listRestProps } = item;
            let titleItem = listItemName || href;
            titleItem = listChildren ? listChildren({ href, listItemName }) : listItemName;
            return (React.createElement(List.Item, null, renderLink(titleItem, listRestProps, 'overlay-menu-list-item', 'href')));
        } })));
    const overlayMenu = overlay || (isMenuListOn && renderList);
    const onOverlayClick = useCallback(() => {
        setTimeout(() => {
            setActive(false);
        }, 300);
    }, []);
    const renderBreadcrumbMenu = (linkItem) => {
        if (overlayMenu) {
            const buildASPlacements = buildPlacements;
            const dropDownProps = {
                overlayClassName: isMenuListOn ? `${prefixCls}-overlay-popup` : undefined,
                onOverlayClick,
                overlay: overlayMenu,
                placement: isMenuListOn ? "bottomLeft" /* bottomLeft */ : "bottomCenter" /* bottomCenter */,
                onVisibleChange,
                overlayPlacements: buildASPlacements,
                ...dropdownProps,
            };
            return (React.createElement(DropDown, Object.assign({}, dropDownProps),
                React.createElement("span", { className: classNames(`${prefixCls}-overlay-link`, {
                        [`${prefixCls}-overlay-border`]: active,
                        [`${prefixCls}-overlay-menu`]: isMenuListOn,
                    }) },
                    linkItem,
                    isMenuListOn || React.createElement(Icon, { type: "arrow_drop_down" }),
                    React.createElement("i", { className: classNames(`${prefixCls}-overlay-cover`, {
                            [`${prefixCls}-overlay-cover-active`]: active,
                        }) }))));
        }
        return linkItem;
    };
    let link = renderLink(children, restProps, `link`, 'href');
    // wrap to dropDown
    link = renderBreadcrumbMenu(link);
    if (children) {
        return (React.createElement("span", null,
            link,
            separator && separator !== '' && (React.createElement("span", { className: `${prefixCls}-separator` }, separator))));
    }
    return null;
};
BreadcrumbItem.__ANT_BREADCRUMB_ITEM = true;
export default BreadcrumbItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvYnJlYWRjcnVtYi9CcmVhZGNydW1iSXRlbS50c3giLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEVBQUUsRUFBYSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ2hFLE9BQU8sVUFBVSxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLFFBQTJCLE1BQU0sYUFBYSxDQUFDO0FBRXRELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQzNCLE9BQU8sSUFBbUIsTUFBTSxTQUFTLENBQUM7QUFDMUMsT0FBTyxlQUFlLE1BQU0sY0FBYyxDQUFBO0FBeUIxQyxNQUFNLGNBQWMsR0FBNEIsQ0FBQyxFQUMvQyxTQUFTLEVBQUUsa0JBQWtCLEVBQzdCLFNBQVMsR0FBRyxHQUFHLEVBQ2YsUUFBUSxHQUFHLEVBQUUsRUFDYixRQUFRLEVBQ1IsT0FBTyxFQUNQLFNBQVMsRUFDVCxhQUFhLEVBQ2IsR0FBRyxTQUFTLEVBQ2IsRUFBRSxFQUFFO0lBQ0gsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzNDLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxPQUFnQixFQUFFLEVBQUU7UUFDakQsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDbkI7SUFDSCxDQUFDLENBQUE7SUFDRDs7OztPQUlHO0lBQ0gsTUFBTSxVQUFVLEdB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QUMsR0FBSSxDQUNELENBQ0UsQ0FDWixDQUFBO1NBQ0Y7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDLENBQUE7SUFFRCxJQUFJLElBQUksR0FBNkIsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBSXJGLG1CQUFtQjtJQUNuQixJQUFJLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbEMsSUFBSSxRQUFRLEVBQUU7UUFDWixPQUFPLENBQ0w7WUFDRyxJQUFJO1lBQ0osU0FBUyxJQUFJLFNBQVMsS0FBSyxFQUFFLElBQUksQ0FDaEMsOEJBQU0sU0FBUyxFQUFFLEdBQUcsU0FBUyxZQUFZLElBQUcsU0FBUyxDQUFRLENBQzlELENBQ0ksQ0FDUixDQUFDO0tBQ0g7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQTtBQUVELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7QUFFNUMsZUFBZSxjQUFjLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvYnJlYWRjcnVtYi9CcmVhZGNydW1iSXRlbS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFJlYWN0Tm9kZSwgdXNlU3RhdGUsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgRHJvcERvd24sIHsgRHJvcERvd25Qcm9wcyB9IGZyb20gJy4uL2Ryb3Bkb3duJztcbmltcG9ydCB7IFBsYWNlbWVudHMgfSBmcm9tICcuLi9kcm9wZG93bi9lbnVtJztcbmltcG9ydCB7IGdldFByZWZpeENscyB9IGZyb20gJy4uL2NvbmZpZ3VyZSc7XG5pbXBvcnQgSWNvbiBmcm9tICcuLi9pY29uJztcbmltcG9ydCBMaXN0LCB7IExpc3RQcm9wcyB9IGZyb20gJy4uL2xpc3QnO1xuaW1wb3J0IGJ1aWxkUGxhY2VtZW50cyBmcm9tICcuL3BsYWNlbWVudHMnXG5cblxuZXhwb3J0IGludGVyZmFjZSBtZW51TGlzdEl0ZW1Qcm9wcyB7XG4gIGhyZWY/OiBzdHJpbmc7XG4gIGxpc3RJdGVtTmFtZT86IHN0cmluZztcbiAgbGlzdENoaWxkcmVuPzogKHsgbGlzdEl0ZW1OYW1lLCBocmVmIH06IHsgbGlzdEl0ZW1OYW1lOiBzdHJpbmcsIGhyZWY6IHN0cmluZyB9KSA9PiBSZWFjdC5SZWFjdE5vZGU7XG4gIG9uQ2xpY2s/OiBSZWFjdC5Nb3VzZUV2ZW50SGFuZGxlcjxIVE1MQW5jaG9yRWxlbWVudCB8IEhUTUxTcGFuRWxlbWVudD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnJlYWRjcnVtYkl0ZW1Qcm9wcyB7XG4gIHByZWZpeENscz86IHN0cmluZztcbiAgc2VwYXJhdG9yPzogUmVhY3ROb2RlO1xuICBocmVmPzogc3RyaW5nO1xuICBvdmVybGF5PzogRHJvcERvd25Qcm9wc1snb3ZlcmxheSddO1xuICBkcm9wZG93blByb3BzPzogRHJvcERvd25Qcm9wcztcbiAgbGlzdFByb3BzPzogTGlzdFByb3BzO1xuICBtZW51TGlzdD86IG1lbnVMaXN0SXRlbVByb3BzW107XG4gIG9uQ2xpY2s/OiBSZWFjdC5Nb3VzZUV2ZW50SGFuZGxlcjxIVE1MQW5jaG9yRWxlbWVudCB8IEhUTUxTcGFuRWxlbWVudD47XG59XG5cbmludGVyZmFjZSBCcmVhZGNydW1iSXRlbUludGVyZmFjZSBleHRlbmRzIFJlYWN0LkZDPEJyZWFkY3J1bWJJdGVtUHJvcHM+IHtcbiAgX19BTlRfQlJFQURDUlVNQl9JVEVNOiBib29sZWFuO1xufVxuXG5jb25zdCBCcmVhZGNydW1iSXRlbTogQnJlYWRjcnVtYkl0ZW1JbnRlcmZhY2UgPSAoe1xuICBwcmVmaXhDbHM6IGN1c3RvbWl6ZVByZWZpeENscyxcbiAgc2VwYXJhdG9yID0gJy8nLFxuICBtZW51TGlzdCA9IFtdLFxuICBjaGlsZHJlbixcbiAgb3ZlcmxheSxcbiAgbGlzdFByb3BzLFxuICBkcm9wZG93blByb3BzLFxuICAuLi5yZXN0UHJvcHNcbn0pID0+IHtcbiAgY29uc3QgcHJlZml4Q2xzID0gZ2V0UHJlZml4Q2xzKCdicmVhZGNydW1iJywgY3VzdG9taXplUHJlZml4Q2xzKTtcbiAgY29uc3QgW2FjdGl2ZSwgc2V0QWN0aXZlXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBpc01lbnVMaXN0T24gPSAhIShtZW51TGlzdCAmJiBtZW51TGlzdC5sZW5ndGggPiAwKTtcbiAgY29uc3Qgb25WaXNpYmxlQ2hhbmdlID0gYXN5bmMgKHZpc2libGU6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAobWVudUxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgc2V0QWN0aXZlKHZpc2libGUpXG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiDmuLLmn5NMaW5rXG4gICAqIEBwYXJhbSBjaGlsZHJlbkxpbmtcbiAgICogQHBhcmFtIHJlc3RQcm9wc0xpbmtcbiAgICovXG4gIGNvbnN0IHJlbmRlckxpbmsgPSAoY2hpbGRyZW5MaW5rLCByZXN0UHJvcHNMaW5rLCBjbGFzc05hbWVMaW5rLCBrZXkpOiBSZWFjdC5SZWFjdE5vZGUgPT4ge1xuICAgIGlmIChrZXkgaW4gcmVzdFByb3BzTGluaykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGEgY2xhc3NOYW1lPXtgJHtwcmVmaXhDbHN9LSR7Y2xhc3NOYW1lTGlua31gfSB7Li4ucmVzdFByb3BzTGlua30+XG4gICAgICAgICAge2NoaWxkcmVuTGlua31cbiAgICAgICAgPC9hPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgJHtwcmVmaXhDbHN9LSR7Y2xhc3NOYW1lTGlua31gfSB7Li4ucmVzdFByb3BzTGlua30+XG4gICAgICAgIHtjaGlsZHJlbkxpbmt9XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIOa4suafk0xpc3TliJfooahcbiAgICovXG4gIGNvbnN0IHJlbmRlckxpc3QgPSAoXG4gICAgPExpc3RcbiAgICAgIGNsYXNzTmFtZT17YCR7cHJlZml4Q2xzfS1vdmVybGF5LW1lbnUtbGlzdGB9XG4gICAgICBncmlkPXt7IGd1dHRlcjogMCwgY29sdW1uOiAzIH19XG4gICAgICB7Li4ubGlzdFByb3BzfVxuICAgICAgZGF0YVNvdXJjZT17bWVudUxpc3R9XG4gICAgICByZW5kZXJJdGVtPXtpdGVtID0+IHtcbiAgICAgICAgY29uc3QgeyBocmVmIH0gPSBpdGVtXG4gICAgICAgIGNvbnN0IHsgbGlzdENoaWxkcmVuLCBsaXN0SXRlbU5hbWUsIC4uLmxpc3RSZXN0UHJvcHMgfSA9IGl0ZW1cbiAgICAgICAgbGV0IHRpdGxlSXRlbSA9IGxpc3RJdGVtTmFtZSB8fCBocmVmO1xuICAgICAgICB0aXRsZUl0ZW0gPSBsaXN0Q2hpbGRyZW4gPyBsaXN0Q2hpbGRyZW4oeyBocmVmLCBsaXN0SXRlbU5hbWUgfSkgOiBsaXN0SXRlbU5hbWU7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPExpc3QuSXRlbT5cbiAgICAgICAgICAgIHtyZW5kZXJMaW5rKHRpdGxlSXRlbSwgbGlzdFJlc3RQcm9wcywgJ292ZXJsYXktbWVudS1saXN0LWl0ZW0nLCAnaHJlZicpfVxuICAgICAgICAgIDwvTGlzdC5JdGVtPlxuICAgICAgICApXG4gICAgICB9fVxuICAgIC8+XG4gICk7XG5cbiAgY29uc3Qgb3ZlcmxheU1lbnUgPSBvdmVybGF5IHx8IChpc01lbnVMaXN0T24gJiYgcmVuZGVyTGlzdCk7XG5cbiAgY29uc3Qgb25PdmVybGF5Q2xpY2sgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRBY3RpdmUoZmFsc2UpXG4gICAgfSwgMzAwKVxuICB9LCBbXSlcblxuICBjb25zdCByZW5kZXJCcmVhZGNydW1iTWVudSA9IChsaW5rSXRlbTogUmVhY3QuUmVhY3ROb2RlKSA9PiB7XG4gICAgaWYgKG92ZXJsYXlNZW51KSB7XG4gICAgICBjb25zdCBidWlsZEFTUGxhY2VtZW50cyA9IGJ1aWxkUGxhY2VtZW50cyBhcyB1bmtub3duIGFzIFBsYWNlbWVudHNcbiAgICAgIGNvbnN0IGRyb3BEb3duUHJvcHMgPSB7XG4gICAgICAgIG92ZXJsYXlDbGFzc05hbWU6IGlzTWVudUxpc3RPbiA/IGAke3ByZWZpeENsc30tb3ZlcmxheS1wb3B1cGAgOiB1bmRlZmluZWQsXG4gICAgICAgIG9uT3ZlcmxheUNsaWNrLFxuICAgICAgICBvdmVybGF5OiBvdmVybGF5TWVudSxcbiAgICAgICAgcGxhY2VtZW50OiBpc01lbnVMaXN0T24gPyBQbGFjZW1lbnRzLmJvdHRvbUxlZnQgOiBQbGFjZW1lbnRzLmJvdHRvbUNlbnRlcixcbiAgICAgICAgb25WaXNpYmxlQ2hhbmdlLFxuICAgICAgICBvdmVybGF5UGxhY2VtZW50czogYnVpbGRBU1BsYWNlbWVudHMsXG4gICAgICAgIC4uLmRyb3Bkb3duUHJvcHMsXG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJvcERvd24gey4uLmRyb3BEb3duUHJvcHN9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhgJHtwcmVmaXhDbHN9LW92ZXJsYXktbGlua2AsIHtcbiAgICAgICAgICAgIFtgJHtwcmVmaXhDbHN9LW92ZXJsYXktYm9yZGVyYF06IGFjdGl2ZSxcbiAgICAgICAgICAgIFtgJHtwcmVmaXhDbHN9LW92ZXJsYXktbWVudWBdOiBpc01lbnVMaXN0T24sXG4gICAgICAgICAgfSl9PlxuICAgICAgICAgICAge2xpbmtJdGVtfVxuICAgICAgICAgICAge2lzTWVudUxpc3RPbiB8fCA8SWNvbiB0eXBlPVwiYXJyb3dfZHJvcF9kb3duXCIgLz59XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoYCR7cHJlZml4Q2xzfS1vdmVybGF5LWNvdmVyYCwge1xuICAgICAgICAgICAgICBbYCR7cHJlZml4Q2xzfS1vdmVybGF5LWNvdmVyLWFjdGl2ZWBdOiBhY3RpdmUsXG4gICAgICAgICAgICB9KX0gLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvRHJvcERvd24+XG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBsaW5rSXRlbTtcbiAgfVxuXG4gIGxldCBsaW5rOiBzdHJpbmcgfCBSZWFjdC5SZWFjdE5vZGUgPSByZW5kZXJMaW5rKGNoaWxkcmVuLCByZXN0UHJvcHMsIGBsaW5rYCwgJ2hyZWYnKTtcblxuXG5cbiAgLy8gd3JhcCB0byBkcm9wRG93blxuICBsaW5rID0gcmVuZGVyQnJlYWRjcnVtYk1lbnUobGluayk7XG5cbiAgaWYgKGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuPlxuICAgICAgICB7bGlua31cbiAgICAgICAge3NlcGFyYXRvciAmJiBzZXBhcmF0b3IgIT09ICcnICYmIChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2Ake3ByZWZpeENsc30tc2VwYXJhdG9yYH0+e3NlcGFyYXRvcn08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuQnJlYWRjcnVtYkl0ZW0uX19BTlRfQlJFQURDUlVNQl9JVEVNID0gdHJ1ZTtcblxuZXhwb3J0IGRlZmF1bHQgQnJlYWRjcnVtYkl0ZW07XG4iXSwidmVyc2lvbiI6M30=