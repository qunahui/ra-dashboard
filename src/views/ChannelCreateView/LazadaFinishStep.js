import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Row, Col, Typography, Input,Radio, Button, Divider, Modal} from 'antd'
import Icon from '@ant-design/icons'
import { ShopOutlined } from '@ant-design/icons'
import Spinner from '../../assets/spinner.svg'
import { blue } from '@ant-design/colors'
import { toast } from 'react-toastify'
import AppCreators from '../../redux/app'
import customToast from '../../components/Helpers/ShowToast'
import { request } from '../../config/axios'

const LazadaFinishStep = props => {
  const [shopName, setShopName] = useState(props.location.state?.store_name || '...')

  useEffect(() => {
    console.log(props.location)
  }, [])

  return (
    <>
        <Row justify="center" align="middle">
          <Col span={16} justify="center">
            <Row justify="center">
              <Typography.Title level={2} copyable={false} style={{ color: blue[4]}}>Cập nhật thông tin cửa hàng</Typography.Title>
            </Row>
            <Row justify="center">
              <Typography.Text type="secondary" copyable={false}>Chỉ một bước để hoàn thiện quá trình kết nối.</Typography.Text>
            </Row>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col span={8} style={{ textAlign: 'start', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', padding: '10px 20px'}}>
            <Typography.Text strong copyable={false}>Đặt tên rút gọn cho gian hàng: </Typography.Text>
            <Typography.Text copyable={false}>Tên rút gọn sẽ giúp định danh và phân biệt giữa các gian hàng với nhau</Typography.Text>
          </Col>
          <Col span={16} justify="center" style={{backgroundColor: '#fff', minHeight: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' , boxShadow: '0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15)', border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '4px'}}>
            <Input disabled={true} size="large" placeholder="Your shop name" prefix={<ShopOutlined />}  style={{width: '90%' }} value={shopName} onChange={(e) => setShopName(e.target.value)}/>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col span={8} style={{ textAlign: 'start', height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', padding: '0px 20px'}}>
            <Typography.Text strong copyable={false}>Cấu hình đồng bộ: </Typography.Text>
            <Typography.Text copyable={false}>Chọn cấu hình đồng bộ cho gian hàng</Typography.Text>
          </Col>
          <Col span={16} style={{ textCenter: 'start', backgroundColor: '#fff', height: '50px', display: 'flex', justifyContent: 'flex-start', padding: '10px 20px', boxShadow: '0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15)', border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '4px'}}>
            <Radio defaultChecked={true}>
              Cấu hình mặc định
            </Radio><br/>
          </Col>
        </Row>
        <Divider/>
        <Row justify="end">
          <Button 
            onClick={() => props.push('/app/create/success', { store_name: shopName })} 
            size="large" type="primary" style={{ fontSize: '18px'}}
          >Lưu</Button>
        </Row>
    </>
  )
}  

export default connect(state => ({
}), dispatch => ({ 
  push: (location, state) => dispatch(push(location,state))
}))(LazadaFinishStep)