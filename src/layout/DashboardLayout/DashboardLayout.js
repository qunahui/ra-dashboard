import React, { Component, Suspense, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, useRoutes, Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { request, setToken } from '../../config/axios'
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
//

const DashboardLayout = (props) => {
  const defaultSelectedKey = props.location.pathname
  const [collapsed, setCollaped] = React.useState(false)
  const [isStoreFetched, setStoreFetched] = useState(false)

  useEffect(() => {
    setToken(props.auth.token)
    props.getStoresStart()
  },[])

  const renderRoutes = (routes = {}, userRole = '') =>
    routes.map((route) =>
      Component && route.rolesAccess.includes(userRole) ? (
        <PrivateRoute key={route.key || route.path} {...route} />
      ) : null,
    )


    // <SocketIOProvider url="http://localhost:5050" opts={{ query: `uid=${props.auth.user.uid}`}}>
  return (
    <Layout>
      <PageHeader/>
      <Layout>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0
          }}
          collapsed={collapsed}
          collapsible={true}
          onCollapse={() => setCollaped(!collapsed)}
          theme={'light'}
        > 
          <Menu theme="light" mode="inline" defaultSelectedKeys={[defaultSelectedKey]}>
            <Menu.Item key="/app/dashboard" icon={<VideoCameraOutlined />}>
              <Link to="/app/dashboard">Trang chính</Link>
            </Menu.Item>
            <SubMenu key="/app/market_place" icon={<UserOutlined />} title="Sàn TMĐT">
              <Menu.Item key="/app/market_place/products"><Link to="/app/market_place/products">Tất cả sản phẩm</Link></Menu.Item>
              <Menu.Item key="/app/market_place/products/create"><Link to="/app/market_place/products/create">Đăng bán sản phẩm</Link></Menu.Item>
              <Menu.Item key="/app/market_place/orders"><Link to="/app/market_place/orders">Đơn hàng</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="/app/products" icon={<DropboxOutlined />} title="Sản phẩm">
              <Menu.Item key="/app/products"><Link to="/app/products">Tất cả sản phẩm</Link></Menu.Item>
              <SubMenu key="/app/variants" title="Quản lý kho">
                <Menu.Item key="/app/variants"><Link to="/app/variants">Toàn bộ phiên bản</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="/app/purchase_orders"><Link to="/app/purchase_orders">Đơn nhập hàng</Link></Menu.Item>
              <Menu.Item key="/app/supplier_refund_orders"><Link to="/app/supplier_refund_orders">Đơn hoàn trả NCC</Link></Menu.Item>
              <Menu.Item key="/app/suppliers"><Link to="/app/suppliers">Quản lý nhà cung cấp</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="/app/orders" icon={<ShoppingOutlined />} title="Đơn hàng">
              <Menu.Item key="/app/orders/create"><Link to="/app/orders/create">Tạo đơn hàng</Link></Menu.Item>
              <Menu.Item key="/app/orders"><Link to="/app/orders">Tất cả đơn hàng</Link></Menu.Item>
              <Menu.Item key="/app/refund_orders"><Link to="/app/refund_orders">Đơn hoàn trả</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ minHeight: '100vh' }}>
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
    </Layout>
  )
  {/* </SocketIOProvider> */}
}

DashboardLayout.propTypes = {}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  push: (location) => dispatch(push(location)),
  getStoresStart: () => dispatch(AppCreators.getStoresStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)
