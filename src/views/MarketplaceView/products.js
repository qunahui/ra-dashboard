import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Modal, Radio, Spin, Typography, Tabs, Steps } from 'antd'
import Icon from '@ant-design/icons'
import { request } from '../../config/axios'

//Tabs
import AllProductTab from './AllProductTab'
import LinkedSuccessProductTab from './LinkedSuccessProductTab'
import LinkedFailProductTab from './LinkedFailProductTab'
//

import LazadaIcon from '../../assets/lazada-icon.svg'
import SendoIcon from '../../assets/sendo-icon.svg'

const { Step } = Steps
const { TabPane } = Tabs

const Products = (props) => {
  const [dataSource, setDataSource] = React.useState([]);
  const [syncModalVisible, setSyncModalVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [platformCredentials, setPlatformCredentials] = React.useState([])
  const [checkedCredential, setCheckedCredential] = React.useState({})
  const [currentStep, setCurrentStep] = React.useState(0)

  const steps = [
    {
      title: 'Choose the marketplace',
      content: (
        <div style={{ padding: '20px 30px'}}>
            <Radio.Group onChange={(e) => setCheckedCredential(e.target.value)} value={checkedCredential}>
              { 
                platformCredentials.length > 0 && platformCredentials.map((i, index) => {
                  return (
                    <span key={i._id}>
                      <Radio key={i._id} value={i} style={{ marginBottom: '5px', fontSize: '18px'}}>
                        <Icon component={i.platform_name === 'sendo' ? SendoIcon : LazadaIcon} style={{ width: '30px'}}/>
                        {i.store_name}
                      </Radio>
                      <br/>
                    </span>
                  )
                })
              }
            </Radio.Group>
        </div>
      )
    },
    {
      title: 'Synchronize your datas',
      content: (
        <div>
          <div style={{ padding: '30px 30px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Spin/>
          </div>
          <div>The system is updating data from {checkedCredential.store_name}. This may take a while if your store has too many products.  </div>
        </div>
      )
    }
  ]

  React.useEffect(() => {
    console.log(props.storage)
    let updatedPlatformCredentials = []
    let sendoCredentials = props.storage?.sendoCredentials
    let lazadaCredentials = props.storage?.lazadaCredentials
    if(sendoCredentials) {
      sendoCredentials = sendoCredentials.map(i => ({ key: i._id, ...i}))
      updatedPlatformCredentials = updatedPlatformCredentials.concat(sendoCredentials)
    }
    if(lazadaCredentials) {
      lazadaCredentials = lazadaCredentials.map(i => ({ key: i._id, ...i}))
      updatedPlatformCredentials = updatedPlatformCredentials.concat(lazadaCredentials)
    }
    updatedPlatformCredentials.length > 0 && setCheckedCredential(updatedPlatformCredentials[0])
    setPlatformCredentials(updatedPlatformCredentials)

  }, [props.storage])

  const handleSyncProductFromChosenStore = async () => {
    const { platform_name, access_token } = checkedCredential
    if(platform_name === 'lazada') {
      const result = await request.post('/api/lazada/fetch-products', {
        storageId: props.storage.id,
        access_token,
        filter: 'all'
      })
      console.log("Data: ", result)
    }
    if(platform_name === 'sendo') {
      const result = await request.post('/api/sendo/fetch-products', {
        storageId: props.storage.id,
        access_token,
      })

      console.log("Data: ", result)
    }
  }

  const actionButtons = [
    <Button style={{ marginRight: '5px'}}>Test button</Button>,   
    <Button type="primary" onClick={() => setSyncModalVisible(true)}>Sync products</Button>
  ]

  return (
    <>
      <Row>
        <Col align="start">
          <Typography.Title level={3} type="secondary">Quản lý sản phẩm</Typography.Title>
        </Col>
        <Modal
          title="Sync products from marketplace"
          visible={syncModalVisible}
          onOk={handleSyncProductFromChosenStore}
          confirmLoading={confirmLoading}
          closable={false}
          onCancel={() => {
            setSyncModalVisible(false)
            setCurrentStep(0)
          }}
          width={600}
          footer={[
            <Button 
              disabled={currentStep === steps.length - 1} 
              type="primary" 
              onClick={() => {
                setCurrentStep(currentStep + 1)
                handleSyncProductFromChosenStore()
              }}>
              { currentStep === 0 ? 'Next' : 'Done'}
            </Button>
          ]}
        >
          <Steps current={currentStep}>
            {steps.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[currentStep].content}</div>
        </Modal>
      </Row>
      <Row>
        <Col span={24}>
          <Tabs defaultActiveKey="all" destroyInactiveTabPane={true} tabBarExtraContent={actionButtons}>
            <TabPane tab="All products" key="all">
              <AllProductTab credentials={platformCredentials}/>
            </TabPane>
            <TabPane tab="Linked success products" key="linked_success_product_tab">
              <LinkedSuccessProductTab/>
            </TabPane>
            <TabPane tab="Linked fail products" key="linked_failed_product_tab">
              <LinkedFailProductTab/>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  )
}

export default connect(state => ({
  storage: state.app.toJS().storage
}))(Products)