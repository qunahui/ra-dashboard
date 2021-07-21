import React, { useState, useEffect } from 'react'
import { Select, Row, Col, Typography, Card } from 'antd'
import { connect } from 'react-redux'
import { cardBorder } from './styles'
import SendoIcon from 'Assets/sendo-icon.svg'
import LazadaIcon from 'Assets/lazada-icon.svg'
import Icon from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

export const item = (props) => {
  const { creds } = props
  return (
    <Card
      title={<Title level={4} style={{ marginLeft: 8 }}>Cấu hình gian hàng</Title>}
      style={{ ...cardBorder }}
    >
      <Row>
        <Col span={24}>
          <Select
            style={{ minWidth: 150 }}
            placeholder={'Chọn gian hàng'}
          >
            {
              creds?.map(i => (
                <Option value={i._id} style={{ display: 'flex', justifyContent: 'center' }}><Icon component={i.platform_name === 'sendo' ? SendoIcon : LazadaIcon} style={{ marginRight: 4 }}/>{i.store_name}</Option>
              ))
            }
          </Select>
        </Col>
      </Row>
    </Card>
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(item)
