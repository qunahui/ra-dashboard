import React, { Component, Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, useRoutes, Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { request, setToken } from '../../config/axios'

//routes
import { routes } from '../../_routes'

//antd components
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
//
import './DashboardLayout.scss'

//app components
import PageHeader from '../../components/PageHeader'
import AppbarMenu from '../../components/AppbarMenu'
import Spinners from '../../components/Spinners'
import PrivateRoute from '../../privateRoute'
import { MainListItems, SecondaryListItems } from '../../components/listItems'
import UserCreators from '../../redux/user'
import AppCreators from '../../redux/app'

//
const { Content, Sider } = Layout;
const { SubMenu } = Menu;
//

const DashboardLayout = (props) => {
  const [open, setOpen] = React.useState(true)
  const [theme, setTheme] = React.useState(props.auth.user.theme || true)

  useEffect(() => {
    console.log("Token: ", props.auth.user.token)
    setToken(props.auth.user.token)

    async function getStorages() {
      const result = await request.post("/api/storage/get-storages", { storageId: props.auth.user.storages[0].storage.storageId })
      if(result.code === 200) {
        const {storage} = result.data
        props.loadStorage({storage})
      } else {
        message.error('Something went wrong. Try again later!')
      }
    }

    getStorages()
  },[])

  const renderRoutes = (routes = {}, userRole = '') =>
    routes.map((route) =>
      Component && route.rolesAccess.includes(userRole) ? (
        <PrivateRoute key={route.key || route.path} {...route} />
      ) : null,
    )

  console.log('Rendering layout......')

  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<VideoCameraOutlined />}>
            <Link to="/app/dashboard">Dashboard</Link>
          </Menu.Item>
          <SubMenu key="Level" icon={<UserOutlined />} title="Lessons">
            <Menu.Item key="2"><Link to="/app/customers">Beginer</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/app/lessons/2">Intermediate</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/app/lessons/3">Advance</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200, height: '100vh' }}>
        <PageHeader />
        <Content style={{ margin: '0px 16px 0', overflow: 'auto', minHeight: '80vh' }}>
          <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
            <Suspense fallback={<></>}>
              <Switch>
                {renderRoutes(routes)}
                <Redirect to="/404" />
              </Switch>
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

DashboardLayout.propTypes = {}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
})

const mapDispatchToProps = (dispatch) => ({
  push: (location) => dispatch(push(location)),
  loadStorage: (payload) => dispatch(AppCreators.loadStorage(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)
