import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Row, Col, Table, Typography } from 'antd'

import './CheckInstockModal.styles.scss'

const { Text } = Typography

export const CheckInstockModal = (props) => {
  const { disabled, dataSource } = props;
  const [showModal, setShowModal] = useState(false)

  const columns = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
      key: 'sku'
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Có thể bán',
      dataIndex: 'sellableAmount',
      key: 'sellableAmount',
      render: (value, record) => <Text>{record.inventories.available}</Text>
    },
    {
      title: 'Tồn kho',
      dataIndex: 'onHand',
      key: 'onHand',
      render: (value, record) => <Text>{record.inventories.onHand}</Text>
    },
    {
      title: 'Hàng đang về',
      dataIndex: 'incoming',
      key: 'incoming',
      render: (value, record) => <Text>{record.inventories.incoming}</Text>
    },
    {
      title: 'Hàng đang giao',
      dataIndex: 'onway',
      key: 'onway',
      render: (value, record) => <Text>{record.inventories.onway}</Text>
    },
    {
      title: 'Đang giao dịch',
      dataIndex: 'trading',
      key: 'trading',
      render: (value, record) => <Text>{record.inventories.trading}</Text>
    },
  ]

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleHideModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <Button disabled={disabled} onClick={handleShowModal}>Kiểm tra tồn kho</Button>
      <Modal
        title={"Kiểm tra tồn kho"}
        id={"check-instock-modal"}
        visible={showModal}
        width={'90%'}
        bodyStyle={{ padding: 0}}
        onCancel={handleHideModal}
      >
        <Table
          id={"check-instock-table"}
          bordered
          columns={columns}
          dataSource={dataSource}
        />
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInstockModal)
