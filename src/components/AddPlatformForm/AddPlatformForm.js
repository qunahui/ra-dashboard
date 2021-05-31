import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Modal, Checkbox, Button, Row, Divider, Col, Typography } from 'antd'
import SendoIcon from 'Assets/sendo-icon.svg'
import LazadaIcon from 'Assets/lazada-icon.svg'
import SystemIcon from 'Assets/system.svg'
import { connect } from 'react-redux'

const { Text } = Typography

export const AddPlatformForm = (props) => {
  const [plats, setPlats] = useState([])
  const [selected, setSelected] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  useEffect(() => {
    let newPlats = []
    const { storage } = props.app
    newPlats = newPlats.concat({
      platform_name: 'system',
      store_name: 'MMS'
    }).concat(storage.sendoCredentials).concat(storage.lazadaCredentials)
    if(!_.isEqual(newPlats, plats)) {
      setPlats(newPlats)
    }    
  }, [])

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChange = (checkedValues) => {
    setSelected(checkedValues)
  }

  const handleOk = () => {
    props.handleSubmit && props.handleSubmit(selected)
    setIsModalVisible(false)
  }

  const onCheckAllChange = e => {
    setSelected(e.target.checked ? plats : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <>
      <Modal
        title="Chọn các gian hàng muốn đăng bán" 
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key={'cancel-add-platform-form'} onClick={handleCancel}>Hủy</Button>,
          <Button key={'submit-add-platform-form'} type={"primary"} onClick={handleOk}>Xác nhận</Button>
        ]}
      >
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Chọn tất cả
        </Checkbox>
        <Divider style={{ margin: 8}}/>
        <Checkbox.Group
          value={selected}
          onChange={onChange} 
        >
          <Row gutter={[16, 8]}>
          {
            plats.map(plat => {
              let icon = plat.platform_name === 'sendo' ? <SendoIcon/> : plat.platform_name === 'lazada' ? <LazadaIcon/> : <SystemIcon/>
              
              return (
                <Col span={24} key={plat.store_name}>
                 <Checkbox defaultChecked={true} key={plat._id} value={plat}><Text>{icon} {plat.store_name}</Text></Checkbox>
                </Col>
              )
            })
          }
          </Row>
        </Checkbox.Group>
      </Modal>
      <Button type={"primary"} onClick={() => setIsModalVisible(true)}>Chọn gian hàng</Button>
    </>  
  )
}

const mapStateToProps = (state) => ({
  app: state.app.toJS(),
  auth: state.auth.toJS()
})

const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(AddPlatformForm)

//     <Option style={{ display: 'none'}}>hidden</Option>

// {plats.map(plat => ({
//   <Row>
//     <Option label={plat.label}>{plat.value}</Option>
//   </Row>
// }))}