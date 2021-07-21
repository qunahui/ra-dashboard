import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Creators from '../../redux/user'
import { PageHeader, Button, Dropdown, Menu, Typography, Image } from 'antd';
import THEME from 'Theme'
import SystemIcon from 'Assets/system.svg'

import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import './PageHeader.scss'

const { Text } = Typography

const CustomPageHeader = (props) => {
  const history = useHistory()
  const userMenu = (
    <Menu>
      <Menu.Item key="/app/logout" icon={<LogoutOutlined />} onClick={() => props.signOut()}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <Menu theme="light" mode="inline" style={{
      position: 'absolute',
      bottom: 48,
      background: 'white',
      border: 'none',
    }}>
      <Menu.Item key="/app/config" icon={<SettingOutlined />} onClick={() => history.push('/app/config')}>
        <span style={{ paddingLeft: 8}}>Thông tin cửa hàng</span>
      </Menu.Item>
      <Menu.Item key="/app/logout" icon={<LogoutOutlined />} onClick={() => props.signOut()}>
        <span style={{ paddingLeft: 8}}>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  )

  // return (
  //   <div className="site-page-header">
  //     <PageHeader
  //       title={
  //         <div style={{ display: 'grid', placeItems: 'center'}}>
  //           <SystemIcon style={{ padding: 0, marginLeft: 8, height: 30, width: 30, cursor: 'pointer'}} onClick={() => history.push('/app/dashboard')}/>
  //         </div>
  //       }
  //       extra={[
  //         <div style={{ marginTop: 1}} key="page-header-menu">
  //           <Button key="configMenu" onClick={() => history.push('/app/config')}><SettingOutlined /></Button>,
  //           <Dropdown key="userMenu" overlay={userMenu} trigger={['click']}>
  //             <Button type="primary">
  //               {props.auth.user.displayName} <UserOutlined />
  //             </Button>
  //           </Dropdown>
  //         </div>
  //       ]}
  //       style={{ 
  //         padding: '0 16px',
  //         position: 'absolute',
  //         bottom: 48,
  //         background: 'white',
  //         // border: `1px solid ${THEME.borderColorBase}`,
  //       }}
  //     />
  //   </div>
  // )
}

export default connect(state => ({
  auth: state.auth.toJS()
}), dispatch => ({
  signOut: () => dispatch(Creators.signOutStart())
}))(CustomPageHeader)
