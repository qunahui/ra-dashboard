import React, { useState, useEffect, useRef} from 'react'
import { Modal, Table, Input, Button, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { request } from 'Config/axios'
import { amountFormatter, amountParser } from 'Utils/inputFormatter'
import './SearchProductModal.styles.scss'

const { Text } = Typography

export const SearchProductModal = (props) => {
  //<--------------------------------------- search product modal handler -------------------------------------------->
  const [loaded, setLoaded] = useState(false)
  const [variantList, setVariantList] = useState([])
  const [searchProductFilter, setSearchProductFilter] = useState('')
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([])
  const [showSearchProductModal, setShowSearchProductModal] = useState(props.visible || false)
  

  async function fetchAllVariant() {
    const result = await request.get('/variants')

    if(result.code === 200) {
      setVariantList(result.data.map(variant => ({
        key: variant._id,
        ...variant
      })))
    }
  }

  useEffect(() => {
    const { visible } = props;
    if (visible === true && loaded === false) {
      fetchAllVariant()
      setLoaded(true)
    }
    setShowSearchProductModal(visible)
  }, [props.visible])

  const productColumns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (value, record) => {
        return (
          <>
            <img 
              src={value || value?.[0] || "data:image/png;base64,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"}
              style={{ width: 30, height: 30}}
            />
            &nbsp; {record.name}
          </> 
        )
      },
      width: '80%'
    },
    {
      title: 'inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      render: (text, record) => {
        return (
          <div key={record._id}>
            {amountFormatter(record.retailPrice)}đ<br/>
            <Text>Số lượng: {record.inventories.onHand}</Text>
          </div>
        )
      }
    }
  ]

  const handleHideSearchProductModal = () => {
    setSelectedProductRowKeys([])
    setShowSearchProductModal(false)
    props.onCancel()
  }

  const handleChooseMultiProduct = () => {
    let filteredVariants = variantList;
    filteredVariants = filteredVariants.filter(i => (selectedProductRowKeys.includes(i.key)))
    filteredVariants = filteredVariants.filter(i => ![...purchaseOrderDataSource].map(p => p._id).includes(i.key))
    const finalDataSource = [...purchaseOrderDataSource, ...filteredVariants]
    setPurchaseOrderDataSource(finalDataSource)
    handleHideSearchProductModal()
  }

  const handleChooseProduct = (row, rowIndex) => {
    setShowSearchProductModal(false)
    props.onCancel && props.onCancel()
    props.onOk && props.onOk(row, rowIndex)
  }
  //<--------------------------------------- search product modal handler -------------------------------------------->

  return (
    <>
      {
        props.mode === 'select-multiple' ? (
          <Modal 
            width={800}
            title={'Chọn sản phẩm'}
            id="Search products modal"
            visible={showSearchProductModal}
            onCancel={handleHideSearchProductModal}
            footer={[
              <Button key={"cancel-search-modal"} onClick={handleHideSearchProductModal}>Thoát</Button>,
              <Button key={"submit-search-modal"} type="primary" onClick={handleChooseMultiProduct}>Thêm vào đơn</Button>
            ]}
          >
            <Input prefix={<SearchOutlined/>} value={searchProductFilter} onChange={(e) => setSearchProductFilter(e.target.value)}/> <br/><br/>
            <Table
              id={"search-product-table"}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => setSelectedProductRowKeys(selectedRowKeys),
                selectedRowKeys: selectedProductRowKeys
              }}
              rowClassName={'search-product-row-cursor'}
              onRow={(record, rowIndex) => ({
                onClick: (e) => {
                  if(selectedProductRowKeys.includes(record._id)) {
                    setSelectedProductRowKeys([...selectedProductRowKeys].filter(key => key !== record._id))
                  } else {
                    setSelectedProductRowKeys([...selectedProductRowKeys, record._id])
                  }
                }
              })}
              scroll={{ y: 350 }} 
              showHeader={false}
              columns={productColumns}
              dataSource={variantList.filter(variant => variant.name.includes(searchProductFilter))}
            />
          </Modal>
        ) : (
          <Modal 
            width={800}
            title={'Chọn sản phẩm'}
            id="Search products modal"
            visible={showSearchProductModal}
            onCancel={handleHideSearchProductModal}
            footer={[
              <Button key={"cancel-search-modal"} onClick={handleHideSearchProductModal}>Thoát</Button>,
            ]}
          >
            <Input prefix={<SearchOutlined/>} value={searchProductFilter} onChange={(e) => setSearchProductFilter(e.target.value)}/> <br/><br/>
            <Table
              id={"search-product-table"}
              rowClassName={'search-product-row-cursor'}
              onRow={(record, rowIndex) => ({
                onClick: (e) => handleChooseProduct(record, rowIndex)
              })}
              scroll={{ y: 350 }} 
              showHeader={false}
              columns={productColumns}
              dataSource={variantList.filter(variant => variant.name.includes(searchProductFilter))}
            />
          </Modal>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  product: state.product.toJS()
})

const mapDispatchToProps = dispatch => ({
  // getVariantStart: () => dispatch(ProductCreators.getVariantStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchProductModal)
