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



const ChannelCreateView = (props) => {
  console.log("props: ", props)
  const [platform, setPlatform] = React.useState('');
  
  // React.useEffect(() => {
  //   //fetch product after authentication
  //   async function fetch() {
  //     if(lazadaCredential) {
  //       console.log("Begin request with credential: ",lazadaCredential)
  //       let options = {
  //         ...lazadaCredential,
  //         filter: 'all'
  //       }
  //       console.log("Option: ", options)
  //       const result = await request.post('/api/lazada/fetch-products', options)
  //       console.log("Data: ", result)
  //       setLoading(false)
  //       props.push('/app/create/lazada/finish', { name: lazadaCredential.name })
  //     }
  //   }

  //   fetch()
  // },[lazadaCredential])

  const renderConnectButton = () => {
    switch(platform) {
      case 'Sendo': 
        return(
          <Link to="/app/create/sendo">
            <Button disabled={platform === ''} type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Connect</Button>
          </Link>
        )
      default: return (
          <a href={`https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${window.location.origin}/app/create/lazada&country=vn&client_id=101074&state=`+ props.auth.user._id + '_' + props.app.storage.id}>
            <Button disabled={platform === ''} type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Connect</Button>
          </a>
        )
    }
  }

  return (
    <Row align="middle" style={{ minHeight: '300px'}}>
      <Col span={24} justify="center">
        <Row justify="center" >
          <Typography.Title level={2} copyable={false} style={{ color: blue[5]}}>Connect a new sales channel</Typography.Title>
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

export default connect(state => ({
  auth: state.auth.toJS(),
  app: state.app.toJS()
}), dispatch => ({
  push: (path, state) => dispatch(push(path, state)),
  goBack: () => dispatch(goBack()),
}))(ChannelCreateView)