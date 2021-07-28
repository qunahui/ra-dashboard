import React, { Component, Suspense, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, useHistory, Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { request, setToken } from '../../config/axios'
import THEME from 'Theme'
import SystemIcon from 'Assets/system.svg'
import WhoAmI from 'Components/WhoAmI'
//routes
import { routes } from '../../_routes'

//antd components
import { Layout, Menu, Image, Button } from 'antd';
import { geekblue } from '@ant-design/colors'
import Icon, {
  UserOutlined,
  VideoCameraOutlined,
  DropboxOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
//
import './DashboardLayout.scss'

//app components
import PageHeader from '../../components/PageHeader'
import PrivateRoute from '../../privateRoute'
import UserCreators from '../../redux/user'
import AppCreators from '../../redux/app'

//
const { Content, Sider, Header } = Layout;
const { SubMenu } = Menu;
const rootSubmenuKeys = [
  '/app/dashboard',
  '/app/market_place',
  '/app/products',
  '/app/orders',
];
//
const selectParentKey = (key) => {
  switch(key) {
    case '/app/dashboard':
      return '/app/dashboard'
    case '/app/market_place/products':
    case '/app/market_place/products/create':
    case '/app/market_place/orders':
      return '/app/market_place'
    case '/app/products':
    case '/app/products/variants':
    case '/app/products/purchase_orders':
    case '/app/products/supplier_refund_orders':
    case '/app/products/suppliers':
      return '/app/products'
    case '/app/orders/create':
    case '/app/orders':
    case '/app/orders/refund':
      return '/app/orders'
    default: return;
  }
}

const DashboardLayout = (props) => {
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState('')
  const [collapsed, setCollaped] = React.useState(false)
  const [isTokenSetted, setTokenSetted] = React.useState(false)
  const history = useHistory()

  useEffect(() => {
    setToken(props.auth.token)
    setTokenSetted(true)
    props.getStoresStart()
  },[])

  
  useEffect(() => {
    const subPathname = props.location.pathname
    setSelectedKey(subPathname)
    setOpenKeys([selectParentKey(subPathname)])
  }, [])

  useEffect(() => {
    const { app } = props
    if(app?.storage) {
      const isMarketplacePath = window.location.pathname.includes('/app/market_place')
      if(isMarketplacePath) {
        const stores = [].concat(app?.storage?.sendoCredentials).concat(app?.storage?.lazadaCredentials)
        if(stores.length === 0) {
          history.push('/app/not-connected')
        }
      }
    }
  }, [props.app])

  const renderRoutes = (routes = {}, userRole = '') =>
    routes.map((route) =>
      Component && route.rolesAccess.includes(userRole) ? (
        <PrivateRoute key={route.key || route.path} {...route} />
      ) : null,
    )
  
  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Layout>
      <Layout>
        <Sider
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
          }}
          collapsed={collapsed}
          // collapsible={true}
          onCollapse={() => setCollaped(!collapsed)}
          theme={'light'}
          className={'sider'}
        > 
          <div style={{ display: 'grid', placeItems: 'center', padding: 8}} className={'sider-header'}>
            <SystemIcon style={{ padding: 0, height: 35, width: 35, cursor: 'pointer'}} onClick={() => history.push('/app/dashboard')}/>
          </div>
          <Menu theme="light" mode="inline" 
            openKeys={
              openKeys?.length > 0 ? openKeys : [rootSubmenuKeys.find((i) => selectedKey.includes(i))]
            } 
            selectedKeys={[selectedKey]}
            onOpenChange={onOpenChange} 
            onSelect={(e) => e.key !== selectedKey && setSelectedKey(e.key)}
          >
              <Menu.Item key="/app/dashboard" icon={<VideoCameraOutlined />}>
                <Link to="/app/dashboard"><span style={{ paddingLeft: 8, fontWeight: 500 }}>Trang chính</span></Link>
              </Menu.Item>
              <SubMenu key="/app/market_place" icon={<UserOutlined />} title={<span style={{ paddingLeft: 8, fontWeight: 500 }}>Sàn TMĐT</span>}>
                <Menu.Item key="/app/market_place/products"><Link to="/app/market_place/products">Tất cả sản phẩm</Link></Menu.Item>
                <Menu.Item key="/app/market_place/products/create"><Link to="/app/market_place/products/create">Đăng bán sản phẩm</Link></Menu.Item>
                <Menu.Item key="/app/market_place/orders"><Link to="/app/market_place/orders">Đơn hàng</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="/app/products" icon={<DropboxOutlined />} title={<span style={{ paddingLeft: 8, fontWeight: 500 }}>Sản phẩm</span>}>
                <Menu.Item key="/app/products"><Link to="/app/products">Tất cả sản phẩm</Link></Menu.Item>
                <Menu.Item key="/app/products/variants"><Link to="/app/products/variants">Quản lý kho</Link></Menu.Item>
                <Menu.Item key="/app/products/purchase_orders"><Link to="/app/products/purchase_orders">Đơn nhập hàng</Link></Menu.Item>
                <Menu.Item key="/app/products/supplier_refund_orders"><Link to="/app/products/supplier_refund_orders">Đơn hoàn trả NCC</Link></Menu.Item>
                <Menu.Item key="/app/products/suppliers"><Link to="/app/products/suppliers">Quản lý nhà cung cấp</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="/app/orders" icon={<ShoppingOutlined />} title={<span style={{ paddingLeft: 8, fontWeight: 500 }}>Đơn hàng</span>}>
                <Menu.Item key="/app/orders/create"><Link to="/app/orders/create">Tạo đơn hàng</Link></Menu.Item>
                <Menu.Item key="/app/orders"><Link to="/app/orders">Tất cả đơn hàng</Link></Menu.Item>
                <Menu.Item key="/app/orders/refund"><Link to="/app/orders/refund">Đơn hoàn trả</Link></Menu.Item>
              </SubMenu>
            </Menu>
          <PageHeader/>
        </Sider>
        <Layout className="site-layout" style={{ minHeight: '100vh', background: 'rgba(255,255,255, 0.6)' }}>
          <Content style={{ margin: '0px 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 24, paddingLeft: 48 }}>
              <Suspense fallback={<></>}>
                <Switch>
                  { renderRoutes(routes) }
                  <Redirect to="/404" />
                </Switch>
              </Suspense>
            </div>
          </Content>
        </Layout>
      </Layout>
      {isTokenSetted &&<WhoAmI/>}
    </Layout>
  )
  {/* </SocketIOProvider> */}
}

DashboardLayout.propTypes = {}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),
  app: state.app.toJS()
})

const mapDispatchToProps = (dispatch) => ({
  push: (location) => dispatch(push(location)),
  getStoresStart: () => dispatch(AppCreators.getStoresStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)
