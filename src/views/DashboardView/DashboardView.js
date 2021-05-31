import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { push } from 'connected-react-router'
import theme from 'Theme'

//ant ui
import { Row, Col, Image, Button, Typography, Card, Skeleton } from 'antd'
import { RightOutlined } from '@ant-design/icons'
//scss
import './DashboardView.styles.scss'

const { Title } = Typography

const LoadingSkeleton = props => {
  const { title } = props; 
  return (
    <>
      <Card
        style={{
          width: props.width || 350,
          width: props.width || 350,
          height: props.height && props.height,
          borderRadius: '10px'
        }}
      >
        <Title level={5} type={'secondary'}>{title}</Title>
        <Skeleton
          loading={true}
          round={true}
          active
          title={false}
          paragraph={{ rows: props.rows && props.rows }}
        >
          {props.children}
        </Skeleton>
      </Card>
    </>
  )
}

function DashboardView(props) {
  const history = useHistory()

  useEffect(() => {
    // console.log(props.storage?.sendoCredentials?.length > 0 || props.storage?.lazadaCredentials?.length > 0)
  }, [props.storage])

  return (
    <>
      <Row
        className={'connect-paper'}
      >
        <Col span={20} className={'paper-text'}>
          <Title level={2}>Chào mừng đến với hệ thống MMS</Title>
          <Title level={4}>Kết nối ngay với gian hàng để trải nghiệm những tính năng tuyệt vời của MMS</Title>
          <Button shape="round" className={'paper-button'} size={'large'} style={{ marginTop: '10px' }} onClick={() => history.push('/app/create')}>Kết nối gian hàng</Button>
        </Col>
        <Col span={4} className={'paper-image'}>
        </Col>
      </Row>
      <Row gutter={[16,16]} style={{ marginTop: '16px'}}>
        <Col span={6}><LoadingSkeleton width={'100%'} center={true} title={'Doanh thu'}></LoadingSkeleton></Col>
        <Col span={6}><LoadingSkeleton width={'100%'} center={true} title={'Đơn hàng mới'}></LoadingSkeleton></Col>
        <Col span={6}><LoadingSkeleton width={'100%'} center={true} title={'Mã giảm giá đang áp dụng'}></LoadingSkeleton></Col>
        <Col span={6}><LoadingSkeleton width={'100%'} center={true} title={'Reviews'}></LoadingSkeleton></Col>
        <Col span={16}><LoadingSkeleton rows={7} width={'100%'} height={300} marginLeft={5}title={'Tổng quan bán hàng'}></LoadingSkeleton></Col>
        <Col span={8}><LoadingSkeleton rows={7} width={'100%'} height={300} title={'Tổng quan bán hàng'}></LoadingSkeleton></Col>
      </Row>
    </>
  )
}
export default connect(state => ({
  auth: state.auth.toJS(),
  storage: state.app.toJS().storage
}), dispatch => ({
  push: (path, state = undefined) => dispatch(push(path, state))
}))(DashboardView)