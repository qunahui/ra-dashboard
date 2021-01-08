import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { goBack, push } from 'connected-react-router'
//antd-ui
import { Row, Col, Typography, Button, Radio, message } from 'antd'
import { blue } from '@ant-design/colors'
import Icon, { CheckCircleOutlined } from '@ant-design/icons';
// app component
import LazadaIcon from '../../assets/lazada-icon.svg'
import SendoIcon from '../../assets/sendo-icon.svg'

const ChannelCreateView = (props) => {
  const [platform, setPlatform] = React.useState('');

  const renderConnectButton = () => {
    switch(platform) {
      case 'Sendo': 
        return(
          <Link to="/app/create/sendo">
            <Button disabled={platform === ''} type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Connect</Button>
          </Link>
        )
      default: return (
          <a href={`https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=http://7b3b3f40c364.ngrok.io/api/lazada/call_back&country=vn&client_id=122845`}>
            <Button disabled={platform === ''} type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Connect</Button>
          </a>
        )
    }
  }

  return (
    <Row align="middle" style={{ minHeight: '300px'}}>
      <Col span={24} justify="center">
        <Row justify="center" >
          <Typography.Title level={2} copyable={false} style={{ color: blue[4]}}>Connect a new sales channel</Typography.Title>
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
    </Row>
  )
}

export default connect(undefined, dispatch => ({
  push: (location) => dispatch(push(location)),
  goBack: () => dispatch(goBack()),
}))(ChannelCreateView)