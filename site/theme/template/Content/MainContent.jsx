import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import { Affix, Col, Icon, Menu, Row } from 'choerodon-ui';
import classNames from 'classnames';
import MobileMenu from 'rc-drawer';
import Article from './Article';
import PrevAndNext from './PrevAndNext';
import Footer from '../Layout/Footer';
import ComponentDoc from './ComponentDoc';
import * as utils from '../utils';

const { SubMenu } = Menu;

function getActiveMenuItem(props) {
  const { children } = props.params;
  return (
    (children && children.replace('-cn', '')) || props.location.pathname.replace(/(^\/|-cn$)/g, '')
  );
}

function getModuleDataByCategory(props) {
  const { location: { pathname }, picked } = props;
  const matches = pathname.match(/^\/?(components[^/]*)/);
  const moduleName = matches
    ? matches[1]
    : pathname
      .split('/')
      .filter(item => item)
      .slice(0, 2)
      .join('/');
  switch (moduleName) {
    case 'components':
      return picked.components.filter(cmp => cmp.meta.category === 'Components');
    case 'components-pro':
      return picked.components.filter(cmp => cmp.meta.category === 'Pro Components');
    case 'docs/react':
    case 'changelog':
    case 'changelog-cn':
      return [...picked['docs/react'], ...picked.changelog];
    default:
      return picked[moduleName];
  }
}

function getModuleData(props) {
  const moduleData = getModuleDataByCategory(props);
  const excludedSuffix = utils.isZhCN(props.location.pathname) ? 'en-US.md' : 'zh-CN.md';
  return moduleData.filter(({ meta }) => !meta.filename.endsWith(excludedSuffix));
}

function fileNameToPath(filename) {
  const snippets = filename.replace(/(\/index)?((\.zh-CN)|(\.en-US))?\.md$/i, '').split('/');
  return snippets[snippets.length - 1];
}

export default class MainContent extends React.Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.getSideBarOpenKeys(props) || [],
    };
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentWillReceiveProps(nextProps) {
    const openKeys = this.getSideBarOpenKeys(nextProps);
    if (openKeys) {
      this.setState({ openKeys });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname },
    } = this.props;
    if (!prevProps || prevProps.location.pathname !== pathname) {
      this.bindScroller();
    }
    if (
      !prevProps ||
      (!window.location.hash && prevProps && prevProps.location.pathname !== pathname)
    ) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (window.location.hash) {
        const demo = document.querySelector(decodeURIComponent(window.location.hash));
        if (demo) {
          demo.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 10);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.scroller.disable();
  }

  bindScroller() {
    if (this.scroller) {
      this.scroller.disable();
    }
    require('intersection-observer'); // eslint-disable-line
    const scrollama = require('scrollama'); // eslint-disable-line
    this.scroller = scrollama();
    this.scroller
      .setup({
        step: '.markdown > h2, .code-box', // required
        offset: 0,
      })
      .onStepEnter(({ element }) => {
        [].forEach.call(document.querySelectorAll('.toc-affix li a'), node => {
          node.className = '';
        });
        const currentNode = document.querySelectorAll(`.toc-affix li a[href="#${element.id}"]`)[0];
        if (currentNode) {
          currentNode.className = 'current';
        }
      });
  }

  handleMenuOpenChange = openKeys => {
    this.setState({ openKeys });
  };

  getSideBarOpenKeys(nextProps) {
    const { themeConfig } = nextProps;
    const { pathname } = nextProps.location;
    const prevModule = this.currentModule;
    this.currentModule = pathname.replace(/^\//).split('/')[1] || 'components';
    if (this.currentModule === 'react') {
      this.currentModule = 'components';
    }
    const locale = utils.isZhCN(pathname) ? 'zh-CN' : 'en-US';
    if (prevModule !== this.currentModule) {
      const moduleData = getModuleData(nextProps);
      const shouldOpenKeys = utils
        .getMenuItems(moduleData, locale, themeConfig.categoryOrder, themeConfig.typeOrder)
        .map(m => m.title[locale] || m.title);
      return shouldOpenKeys;
    }
  }

  generateMenuItem(isTop, item, { before = null, after = null }) {
    const {
      intl: { locale },
    } = this.context;
    const key = fileNameToPath(item.filename);
    const title = item.title[locale] || item.title;
    const text = isTop
      ? title
      : [
          <span key="english">{title}</span>,
          locale === 'zh-CN' && (
            <span className="chinese" key="chinese">
              {item.subtitle}
            </span>
          ),
        ];
    const { disabled } = item;
    const url = item.filename.replace(/(\/index)?((\.zh-CN)|(\.en-US))?\.md$/i, '').toLowerCase();
    const child = !item.link ? (
      <Link
        to={utils.getLocalizedPathname(
          /^components/.test(url) ? `${url}/` : url,
          locale === 'zh-CN',
        )}
        disabled={disabled}
      >
        {before}
        {text}
        {after}
      </Link>
    ) : (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        disabled={disabled}
        className="menu-item-link-outside"
      >
        {before}
        {text} <Icon type="export" />
        {after}
      </a>
    );

    return (
      <Menu.Item key={key.toLowerCase()} disabled={disabled}>
        {child}
      </Menu.Item>
    );
  }

  getMenuItems(footerNavIcons = {}) {
    const { themeConfig } = this.props;
    const {
      intl: { locale },
    } = this.context;
    const moduleData = getModuleData(this.props);
    const menuItems = utils.getMenuItems(
      moduleData,
      locale,
      themeConfig.categoryOrder,
      themeConfig.typeOrder,
    );
    return menuItems.map(menuItem => {
      if (menuItem.children) {
        return (
          <SubMenu title={<h4>{menuItem.title}</h4>} key={menuItem.title}>
            {menuItem.children.map(child => {
              if (child.type === 'type') {
                return (
                  <Menu.ItemGroup title={child.title} key={child.title}>
                    {child.children
                      .sort((a, b) => {
                        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
                      })
                      .map(leaf => this.generateMenuItem(false, leaf, footerNavIcons))}
                  </Menu.ItemGroup>
                );
              }
              return this.generateMenuItem(false, child, footerNavIcons);
            })}
          </SubMenu>
        );
      }
      return this.generateMenuItem(true, menuItem, footerNavIcons);
    });
  }

  flattenMenu(menu) {
    if (menu && menu.type && menu.type.isMenuItem) {
      return menu;
    }
    if (Array.isArray(menu)) {
      return menu.reduce((acc, item) => acc.concat(this.flattenMenu(item)), []);
    }
    return this.flattenMenu((menu.props && menu.props.children) || menu.children);
  }

  getFooterNav(menuItems, activeMenuItem) {
    const menuItemsList = this.flattenMenu(menuItems);
    let activeMenuItemIndex = -1;
    menuItemsList.forEach((menuItem, i) => {
      if (menuItem && menuItem.key === activeMenuItem) {
        activeMenuItemIndex = i;
      }
    });
    const prev = menuItemsList[activeMenuItemIndex - 1];
    const next = menuItemsList[activeMenuItemIndex + 1];
    return { prev, next };
  }

  render() {
    const { props } = this;
    const { isMobile } = this.context;
    const { openKeys } = this.state;
    const activeMenuItem = getActiveMenuItem(props);
    const menuItems = this.getMenuItems();
    const menuItemsForFooterNav = this.getMenuItems({
      before: <Icon className="footer-nav-icon-before" type="navigate_before" />,
      after: <Icon className="footer-nav-icon-after" type="navigate_next" />,
    });
    const { prev, next } = this.getFooterNav(menuItemsForFooterNav, activeMenuItem);
    const { localizedPageData } = props;
    const mainContainerClass = classNames('main-container', {
      'main-container-component': !!props.demos,
    });
    const menuChild = (
      <Menu
        inlineIndent="40"
        className="aside-container menu-site"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={[activeMenuItem]}
        onOpenChange={this.handleMenuOpenChange}
      >
        {menuItems}
      </Menu>
    );
    return (
      <div className="main-wrapper">
        <Row>
          {isMobile ? (
            <MobileMenu
              iconChild={[
                <Icon key="menu-unfold" type="menu-unfold" />,
                <Icon key="menu-fold" type="menu-fold" />,
              ]}
              key="Mobile-menu"
              wrapperClassName="drawer-wrapper"
            >
              {menuChild}
            </MobileMenu>
          ) : (
            <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} className="main-menu">
              <Affix>
                <section className="main-menu-inner">{menuChild}</section>
              </Affix>
            </Col>
          )}
          <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
            <section className={mainContainerClass}>
              {props.demos ? (
                <ComponentDoc {...props} doc={localizedPageData} demos={props.demos} />
              ) : (
                <Article {...props} content={localizedPageData} />
              )}
            </section>
            <PrevAndNext prev={prev} next={next} />
            <Footer />
          </Col>
        </Row>
      </div>
    );
  }
}
