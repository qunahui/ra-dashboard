import React, { useEffect, useState, useRef, useReducer } from 'react'
import { connect } from 'react-redux' 
import PlatformCreators from 'Redux/platform'
import AppCreators from 'Redux/app'
import _ from 'lodash'
import { Table, Button, Empty, Typography, Tooltip, Row, Col, List, Popconfirm } from 'antd'
import Icon, { LinkOutlined, PlusCircleOutlined, DownloadOutlined, DoubleRightOutlined, SmileOutlined, DisconnectOutlined } from '@ant-design/icons'
import { blue, red } from '@ant-design/colors'
import './AllProductTab.styles.scss'
import SendoIcon from 'Assets/sendo-icon.svg'
import LazadaIcon from 'Assets/lazada-icon.svg'
import { request } from 'Config/axios'
import toast from 'Helpers/ShowToast'
import NProgress from 'nprogress'

import SearchProductModal from 'Components/SearchProductModal'
import CreateProductFromPlatformModal from 'Components/CreateProductFromPlatformModal'
import { amountFormatter } from 'Utils/inputFormatter'

const { Text, Title } = Typography

const AllProductTab = (props) => {
  const [dataSource, setDataSource] = React.useState([])
  const [chosenPlatformVariant, setChosenPlatformVariant] = useState(null)
  const [credentials, setCredentials] = useState([])

  //<--------------------------------------- search product modal handler -------------------------------------------->
  const [showSearchProductModal, setShowSearchProductModal] = useState(false)

  const handleShowSearchProductModal = (platV) => {
    setChosenPlatformVariant(platV)
    setShowSearchProductModal(true)
  }
  
  const handleHideSearchProductModal = () => {
    setChosenPlatformVariant(null)
    setShowSearchProductModal(false)
  }
  //<--------------------------------------- search product modal handler -------------------------------------------->
  
  //<--------------------------------------- link product modal handler -------------------------------------------->
  const handleLinkProduct = (row, rowIndex) => {
    props.linkDataStart({
      variant: row,
      platformVariant: chosenPlatformVariant
    })
  }

  const handleUnlinkProduct = (row, rowIndex) => {
    props.unlinkDataStart({
      variant: row.linkedDetails,
      platformVariant: row
    })
  }
  //<--------------------------------------- link product modal handler -------------------------------------------->

  //<--------------------------------------- link details table handler -------------------------------------------->

  //<--------------------------------------- link details table handler -------------------------------------------->
  useEffect(() => {
    if(!_.isEqual(props.credentials, credentials)) {
      setCredentials(props.credentials)
    }
  }, [props.credentials])

  useEffect(() => {
    fetchPlatformProduct()
  }, [credentials])

  const fetchPlatformProduct = () => {
    let sendoStoreIds = [];
    let lazadaStoreIds = [];

    credentials.map(credential => {
      if(credential.platform_name === 'sendo') {
        sendoStoreIds = [...sendoStoreIds, credential.store_id]
      }
      if(credential.platform_name === 'lazada') {
        lazadaStoreIds = [...lazadaStoreIds, credential.store_id]
      }
    }) 

    sendoStoreIds.concat(lazadaStoreIds).length > 0 && props.getPlatformProductStart({ 
      sendoStoreIds,
      lazadaStoreIds,
    }) 
  }

  useEffect(() => {
    const { isWorking, products } = props.platform 

    if(!isWorking && credentials?.length > 0) {
      const transformProducts = products.map((product, index) => {
        const matchedCre = credentials.find(cre => cre.store_id === product.store_id)
        
        const children = matchedCre.platform_name === 'sendo' 
          ? (product.variants?.length > 0 && product.variants.map(variant => ({
            ...variant,
            key: variant._id,
            name: product.name,
            productId: product._id,
            store_name: matchedCre.store_name,
            avatar: variant.avatar[0],
            isChildren: true,
            platform: 'sendo'
          })))

        : (product.variants?.length > 0 && product.variants.map(variant => ({
            ...variant, 
            key: variant._id,
            name: product.attributes.name,
            productId: product._id,
            store_name: matchedCre.store_name,
            isChildren: true,
            avatar: variant.avatar[0],
            platform: 'lazada'
          })))

        return ({
          ...product,
          name: matchedCre.platform_name === 'sendo' ? product.name : product.attributes.name,
          key: product._id,
          store_name: matchedCre.store_name,
          platform: matchedCre.platform_name,
          children,
          isChildren: product.variants.length === 0
        })
      })

      props?.onTransformProductsCreated(transformProducts)
      setDataSource([...transformProducts])
    }
  }, [props.platform])

  const columns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (value, record) => {
        const style = { 
          marginLeft: !record.isChildren ? 16 : 32,
          height: !record.isChildren ? 70: 50, 
          width: !record.isChildren ? 70: 50,
          borderRadius: '5px',
          border: '1px solid #ccc'
        }

        return <img 
          // src={value || "data:image/png;base64,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"} 
          src={value || (record.platform === 'lazada' ? '/assets/LazadaBanner.png' : '/assets/sendo-banner.jpg')}
          style={style}
        />
      },
      width: 100
    },
    {
      title: (<div>Tên sản phẩm</div>),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <>
          <a href={record.link || (record.variants?.length > 0 && record.variants[0].Url) || '#'} target="_blank">{record.name}</a> <br/>
            {
              (record.isChildren || (record.platform === 'sendo' && record.variants?.length === 0) || (record.platform === 'lazada' && record.variants?.length === 0)) ? <Text>{record.sku}</Text> : <Text>{record.variants?.length} phiên bản</Text>
            }
          </>
        )
      },
      width: '20%'
    },
    {
      title: <div>Gian hàng</div>,
      dataIndex: 'store_name',
      key: 'store_name',
      render: (text, record) => {
        return <>
          <Text>{record.platform === 'sendo' ? <SendoIcon/> : <LazadaIcon/>} &nbsp; {record.store_name && record.store_name}</Text>
        </>
      },
      width: '20%'
    },
    {
      title: <div>Trạng thái liên kết</div>,
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (record) => {
        return <p>Chưa kết nối</p>
      }
    },
    {
      title: <div>Sản phẩm liên kết</div>,
      dataIndex: 'linkedId',
      key: 'linkedId',
      render: (value, record) => {
        return <Text style={{ maxWidth: 150 }} ellipsis={true}>{record.linkedDetails?.name}</Text>
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        return <>
          { (record.isChildren === true) && (
            <>
              <span  style={{ marginRight: 1 }}>
                <Tooltip placement="topLeft" title="Liên kết sản phẩm tự động" arrowPointAtCenter>
                  <Button disabled={record.linkedId} key={`link-${record._id}`} onClick={() => props.autoLinkDataStart({ variants: [record] })}><LinkOutlined style={{ color: blue[5]}}/></Button>
                </Tooltip>
              </span>
              {
                !record.linkedId ? (
                  <span  style={{ marginRight: 1 }}>
                    <Tooltip placement="topLeft" title="Liên kết sản phẩm thủ công" arrowPointAtCenter>
                      <Button key={`findProductToLink-${record._id}`} onClick={() => handleShowSearchProductModal(record)}><PlusCircleOutlined style={{ color: blue[5]}}/></Button>
                    </Tooltip>
                  </span>
                ) : (
                  <span  style={{ marginRight: 1 }}>
                    <Tooltip placement="topLeft" title="Gỡ liên kết sản phẩm" arrowPointAtCenter>
                      <Popconfirm
                        title={`Xác nhận gỡ liên kết sản phẩm: ${record.name}`}
                        onConfirm={() => handleUnlinkProduct(record)}
                        cancelText={"Hủy"}
                      >
                        <Button danger key={`findProductToLink-${record._id}`}><DisconnectOutlined /></Button>
                      </Popconfirm>
                    </Tooltip>
                  </span>
                )
              }
              <CreateProductFromPlatformModal record={record.productId ? { ...dataSource.find(i => i._id === record.productId) } : {...record} }/>
            </>
            )
          }
        </>
      }
    },
  ]

  const handleSyncStock = async (record) => {
    try {
      NProgress.start()
      console.log("RecorD: ", record)
      const response = await request.post('/variants/push-api', { variant: record?.linkedDetails })
      
      if(response.code === 200) {
        toast({ type: 'success', message: 'Đồng bộ tồn kho thành công!' })
        console.log("kết quả: ", response.data)
      }

    } catch(e) {
      toast({ type: 'error', message: 'Đồng bộ tồn kho thất bại. Vui lòng thử lại sau!' })
    } finally {
      NProgress.done()
    }
  }

  return (
    <>
      {/* { !props?.platform?.isWorking && dataSource.length > 0 ? ( */}
          <Table
            loading={props?.platform?.isWorking}
            key={"marketplace-product-table"}
            expandable={{
              defaultExpandedRowKeys: dataSource.map(i => i._id),
              expandedRowRender: (record, index, indent, expanded) => {
                if((!!record.isChildren === true) && !!record.linkedId) {
                  return (
                    <List
                      size="large"
                      header={
                        <Row style={{ width: '100%'}}>
                          <Col span={3}><Text strong>Chi tiết gian hàng</Text></Col>
                          <Col span={4}><Text strong>Mã SKU</Text></Col>
                          <Col span={5}><Text strong>Tên sản phẩm</Text></Col>
                          <Col span={4}><Text strong>Giá bán</Text></Col>
                          <Col span={4}><Text strong>Tồn kho</Text></Col>
                          <Col span={4}><Text strong>Trạng thái</Text></Col>
                        </Row>
                      }
                      footer={
                        <Row align="end">
                          <Popconfirm
                            title={"Xác nhận gỡ liên kết sản phẩm này ?"}
                            onConfirm={() => handleUnlinkProduct(record)}
                          >
                            <Button type={"primary"} danger style={{ marginRight: 8, }}>Gỡ liên kết</Button>
                          </Popconfirm>
                          <Button type={"primary"} style={{ marginRight: 8}} onClick={() => handleSyncStock(record)}>Đồng bộ tồn kho</Button>
                        </Row>
                      }
                      bordered
                      style={{ background: 'white'}}
                      dataSource={record.linkedDetails ? [record, record.linkedDetails] : []}
                      renderItem={item => {
                        console.log("itemmmmmmm, ", item)
                        return (
                          <List.Item>
                            <Row style={{ width: '100%'}}>
                              <Col style={{ paddingLeft: 16}} span={3}><img style={{ height: 30}} src={item.platform === 'sendo' ? '/assets/sendo-banner.jpg' : item.platform === 'lazada' ? '/assets/lazada-banner.jpg' : '/assets/system.svg'}/></Col>
                              <Col span={4}>{item?.sku || 0}</Col>
                              <Col span={5}>{item?.name || 0}</Col>
                              <Col span={4}>{amountFormatter(item?.retailPrice || item?.price || 0)}</Col>
                              <Col span={4}>{item?.quantity || item.inventories?.onHand || item?.stock_quantity || 0}</Col>
                              <Col span={4}>{item?.Status ? item.Status === 'active' ? 'Đang giao dịch' : 'Ngừng giao dịch' : item.sellable ? item.sellable === true ? 'Đang giao dịch' : 'Ngừng giao dịch': item.status ? item.status === '2' ? 'Đang giao dịch' : 'Ngừng giao dịch' : ' --- '  }</Col>
                            </Row>
                          </List.Item>
                        )
                      }}
                    />
                  )
                } else {
                  return (
                    <Row style={{ width: '100%' }} justify="center"> 
                      <Col><Title level={5} style={{ color: blue[3] }}><SmileOutlined/> &nbsp; Sản phẩm chưa được liên kết</Title></Col>
                    </Row>
                  )
                }
              },
              expandRowByClick: true,
              rowExpandable: (record) => (record.isChildren || (record.variants.length === 0)),
              expandIcon: ({ expanded, onExpand, record }) => {
                  return expanded ? (
                    <DoubleRightOutlined style={{ color: blue[5], transform: 'rotate(90deg)' }}  onClick={e => onExpand(record, e)} />
                  ) : (
                    <DoubleRightOutlined style={{ color: blue[5] }} onClick={e => onExpand(record, e)} />
                  )
                },
              }
            }
            dataSource={dataSource}
            columns={columns}
            className={"all-marketplace-product-table"}
            rowClassName={(record, index) => record.isChildren === true ? 'marketplace-children-row' : 'marketplace-parent-row'}
          />
       {/* ) : (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <Typography.Text strong>
              Sản phẩm từ các sàn chưa được đồng bộ
            </Typography.Text>
          }
        >
        </Empty>
      )} */}
      <SearchProductModal
        visible={showSearchProductModal}
        onCancel={handleHideSearchProductModal}
        mode={"select-single"}
        onOk={handleLinkProduct}
      />
    </>
  )
}

const mapStateToProps = state => ({
  auth: state.auth.toJS(),
  storage: state.app.toJS().storage,
  platform: state.platform.toJS(),
})

const mapDispatchToProps = dispatch => ({
  getPlatformProductStart: (payload) => dispatch(PlatformCreators.getPlatformProductStart(payload)),
  linkDataStart: (payload) => dispatch(PlatformCreators.linkDataStart(payload)),
  unlinkDataStart: (payload) => dispatch(PlatformCreators.unlinkDataStart(payload)),
  autoLinkDataStart: (payload) => dispatch(AppCreators.autoLinkDataStart(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllProductTab)