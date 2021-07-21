import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { goBack, push } from 'connected-react-router'
import { request } from '../../config/axios'
//antd-ui
import { Modal, Row, Col, Typography, Button, Radio, Spin, message } from 'antd'
import { blue, purple } from '@ant-design/colors'
import Icon, { CheckCircleOutlined, FileDoneOutlined } from '@ant-design/icons';
// app component
import LazadaIcon from '../../assets/lazada-icon.svg'
import SendoIcon from '../../assets/sendo-icon.svg'

import './styles.scss'

const style = { 
  minHeight: '300px'
}

const ChannelCreateView = (props) => {
  console.log("props: ", props)
  const [platform, setPlatform] = React.useState('');

  const renderConnectButton = () => {
    switch(platform) {
      case 'Sendo': 
        return(
          <Link to="/app/create/sendo">
            <Button disabled={platform === ''} type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Kết nối</Button>
          </Link>
        )
      default: return (
          <a href={`https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${window.location.origin}/app/create/lazada&country=vn&client_id=101074&state=`+ props.auth.user._id + '_' + props.app.storage.id}>
            <Button disabled={platform === ''} type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Kết nối</Button>
          </a>
        )
    }
  }

  return (
    <Row align="middle" className={'channel-connect-container'} style={style}>
      <Col span={8} justify="center" className={'channel-connect-content'}>
        <Row justify="center" >
          <Typography.Title level={2} copyable={false} style={{ color: blue[5]}}>Kết nối gian hàng mới</Typography.Title>
        </Row>
        <Row justify="center" style={{ marginTop: '20px'}}>
          <Radio.Group
              onChange={(e) => setPlatform(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              size="large"
            >
            <Radio.Button
              value="Lazada" 
              style={{ height: '80px', width:'160px', lineHeight: '80px', fontSize: '24px', marginRight:'10px'}}
              >
              <Icon component={LazadaIcon} style={{ width: '24px', margin: '10px'}}/>Lazada
            </Radio.Button>
            <Radio.Button 
              value="Sendo"
              style={{ height: '80px', width:'160px', lineHeight: '80px', fontSize: '24px'}}
            >
            <Icon component={SendoIcon} style={{ width: '24px', margin: '10px'}}/>Sendo
            </Radio.Button>
          </Radio.Group>
        </Row>
        <Row justify="center" style={{ marginTop: '40px'}}>
          <Col span={8}>
            {renderConnectButton()} 
          </Col>
        </Row>
      </Col>
      <Col span={16} className={'channel-connect-background'}>
      </Col>
    </Row>
  )
}

export default connect(state => ({
  auth: state.auth.toJS(),
  app: state.app.toJS()
}), dispatch => ({
  push: (path, state) => dispatch(push(path, state)),
  goBack: () => dispatch(goBack()),
}))(ChannelCreateView)