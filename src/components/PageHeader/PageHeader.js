import React from 'react'
import { connect } from 'react-redux'
import Creators from '../../redux/user'
import { PageHeader, Button, Dropdown, Menu, Divider, message } from 'antd';

import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import './PageHeader.scss'

const CustomPageHeader = (props) => {
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<LogoutOutlined />} onClick={() => props.signOut()}>
        Sign out
      </Menu.Item>
    </Menu>
  );


  return (
    <div className="site-page-header">
      <PageHeader
        extra={[
          <Button key="2"><SettingOutlined /></Button>,
          <Dropdown key="1" overlay={userMenu}>
            <Button type="primary">
              Username <UserOutlined />
            </Button>
          </Dropdown>
        ]}
        style={{ padding: '4px 16px'}}
      />
    </div>
  )
}

export default connect(state => ({

}), dispatch => ({
  signOut: () => dispatch(Creators.signOutStart())
}))(CustomPageHeader)
