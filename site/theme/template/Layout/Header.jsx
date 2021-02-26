import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Button, Col, Icon, Menu, Popover, Row, Select } from 'choerodon-ui';
import { Button as ButtonPro } from 'choerodon-ui/pro';
import * as utils from '../utils';
import { version as c7nUIVersion } from '../../../../package.json';
import logo from '../../static/images/logo-title.svg';

const { Option } = Select;

function getStyle() {
  return `
    #header .c7n-select-selection {
      height: 24px;
      padding-top: 0;
    }
  `;
}

function getPathnameRegExp(pathname) {
  if (pathname === '/') {
    return /\/$/;
  }
  if (pathname.startsWith('/')) {
    return new RegExp(pathname);
  }
  return new RegExp(`/${pathname}`);
}

export default class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequiprimary,
    intl: PropTypes.object.isRequiprimary,
    isMobile: PropTypes.bool.isRequiprimary,
  };

  state = {
    menuVisible: false,
  };

  componentDidMount() {
    const { router } = this.context;
    router.listen(this.handleHideMenu);
  }

  handleShowMenu = () => {
    this.setState({
      menuVisible: true,
    });
  };

  handleHideMenu = () => {
    this.setState({
      menuVisible: false,
    });
  };

  onMenuVisibleChange = (visible) => {
    this.setState({
      menuVisible: visible,
    });
  };

  handleVersionChange = (url) => {
    const currentUrl = window.location.href;
    const currentPathname = window.location.pathname;
    window.location.href = currentUrl.replace(window.location.origin, url)
      .replace(currentPathname, utils.getLocalizedPathname(currentPathname));
  };

  handleLangChange = () => {
    const { location } = window;
    const { location: { pathname } } = this.props;
    const isZhCn = utils.isZhCN(pathname);

    if (utils.isLocalStorageNameSupported()) {
      localStorage.setItem('locale', isZhCn ? 'en-US' : 'zh-CN');
    }

    location.href = location.href.replace(
      getPathnameRegExp(pathname),
      utils.getLocalizedPathname(pathname, !isZhCn),
    );
  };

  handleButtonColorChange = (color) => {
    const root = document.querySelector(':root');
    let colorContent = ``;
    switch (color) {
      case 'green':
        colorContent = `
        --primary-1: #e6fff5;
        --primary-2: #9bf2d4;
        --primary-3: #6ee6c0;
        --primary-4: #45d9af;
        --primary-5: #21cca1;
        --primary-6: #00bf96;
        --primary-7: #00997d;
        --primary-8: #007362;
        --primary-9: #004d44;
        --primary-10: #002623;`
        break;
      case 'red':
        colorContent = `
        --primary-1: #ffeae6;
        --primary-2: #ffafa3;
        --primary-3: #fc8679;
        --primary-4: #f0584d;
        --primary-5: #e32b24;
        --primary-6: #d50000;
        --primary-7: #b00006;
        --primary-8: #8a0009;
        --primary-9: #63000a;
        --primary-10: #3d0008;
        `;
        break;
      case 'purple':
        colorContent = `
        --primary-1: #ebdfed;
        --primary-2: #ded3e0;
        --primary-3: #ceb8d4;
        --primary-4: #b98dc7;
        --primary-5: #a466ba;
        --primary-6: #8e44ad;
        --primary-7: #692e87;
        --primary-8: #481c61;
        --primary-9: #290e3b;
        --primary-10: #0e0514;
        `;
        break;
      default:
        colorContent = `
        --primary-1: #e6ebf5;
        --primary-2: #dadee8;
        --primary-3: #b6bfdb;
        --primary-4: #8a99cf;
        --primary-5: #6374c2;
        --primary-6: #3f51b5;
        --primary-7: #2b378f;
        --primary-8: #1a2169;
        --primary-9: #0d1042;
        --primary-10: #05061c;
        `;
    }

    root.setAttribute('style', colorContent)

  }

  render() {
    const { menuVisible } = this.state;
    const { isMobile } = this.context;
    const menuMode = isMobile ? 'inline' : 'horizontal';
    const {
      location, themeConfig,
    } = this.props;
    const docVersions = { ...themeConfig.docVersions, [c7nUIVersion]: c7nUIVersion };
    const versionOptions = Object.keys(docVersions)
      .map(version => <Option value={docVersions[version]} key={version}>{version}</Option>);
    const module = location.pathname.replace(/(^\/|\/$)/g, '').split('/').slice(0, -1).join('/');
    let activeMenuItem = module || 'home';
    if (activeMenuItem === 'components' || location.pathname === 'changelog') {
      activeMenuItem = 'docs/react';
    }
    const { intl: { locale } } = this.context;
    const isZhCN = locale === 'zh-CN';

    const headerClassName = classNames({
      clearfix: true,
    });

    const ButtonColor = () => {
      return ['blue', 'green', 'red', 'purple'].map(item => <ButtonPro onClick={() => { this.handleButtonColorChange(item) }} key={item} color={item}>{item}</ButtonPro>)
    }

    const menu = [
      <ButtonColor key="1212" />,
      <Select
        key="version"
        className="version"
        size="small"
        dropdownMatchSelectWidth={false}
        defaultValue={c7nUIVersion}
        onChange={this.handleVersionChange}
        getPopupContainer={trigger => trigger.parentNode}
      >
        {versionOptions}
      </Select>,
      <Menu className="menu-site" mode={menuMode} selectedKeys={[activeMenuItem]} id="nav" key="nav">
        <Menu.Item key="home">
          <Link to={utils.getLocalizedPathname('/', isZhCN)}>
            <FormattedMessage id="app.header.menu.home" />
          </Link>
        </Menu.Item>
        <Menu.Item key="gitee">
          <a href="https://graysheep.gitee.io/choerodon-ui/index-cn">
            <FormattedMessage id="app.header.menu.gitee" />
          </a>
        </Menu.Item>
        <Menu.Item key="docs/react">
          <Link to={utils.getLocalizedPathname('/docs/react/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.components" />
          </Link>
        </Menu.Item>
      </Menu>,
    ];

    // const searchPlaceholder = locale === 'zh-CN' ? '在 choerodon-ui 中搜索' : 'Search in choerodon-ui';
    return (
      <header id="header" className={headerClassName}>
        {isMobile && (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon
              className="nav-phone-icon"
              type="menu"
              onClick={this.handleShowMenu}
            />
          </Popover>
        )}
        <Row>
          <Col xxl={4} xl={5} lg={5} md={5} sm={24} xs={24}>
            <Link to={utils.getLocalizedPathname('/', isZhCN)} id="logo">
              <img
                alt="logo"
                src={logo}
              />
            </Link>
          </Col>
          <Col xxl={20} xl={19} lg={19} md={18} sm={0} xs={0}>
            {!isMobile && menu}
          </Col>
        </Row>
        <style dangerouslySetInnerHTML={{ __html: getStyle() }} />
      </header>
    );
  }
}
