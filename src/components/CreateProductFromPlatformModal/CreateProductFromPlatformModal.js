import React, { useState, useReducer, useEffect, useContext, useRef } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Tooltip, Row, Col, Image, Input, InputNumber, Table, Typography, Form, Checkbox } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { blue } from '@ant-design/colors'
import './CreateProductFromPlatformModal.styles.scss'
import { removeVI } from 'jsrmvi'
import ProductCreators from 'Redux/product'
import TextEditor from 'Components/TextEditor'
import { amountFormatter, amountParser } from 'Utils/inputFormatter'

const { Text, Title } = Typography

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};


const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps}) => {
  const [editing, setEditing] = useState(false);
  const type = restProps.type || 'text'
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      let values = await form.validateFields();
      ['retailPrice', 'wholeSalePrice', 'importPrice', 'weightValue', 'initStock', 'initPrice'].map(tag => {
        values.hasOwnProperty(tag) && (values[tag] = parseFloat(values[tag]))
      })

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        { 
          type === 'number' ?
            <InputNumber 
              ref={inputRef} 
              onPressEnter={save} 
              onBlur={save} 
              formatter={amountFormatter}
              parser={amountParser}
              style={{ width: '100% '}}
            />
            :
            <Input 
              ref={inputRef} 
              onPressEnter={save} 
              onBlur={save} 
            />
        }
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export const CreateProductFromPlatformModal = (props) => {
  const { record } = props
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [formValues, setFormValues] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
  {})
  const [showModal, setShowModal] = useState(false)
  const [firstMount, setFirstMount] = useState(false)

  const createVariantFromSendo = (record) => {
    if(record.variants.length > 0) {
      let variants = []
      for(let senVar of record.variants) { 
        variants.push({
          options: senVar.variant_attributes.map(i => ({ optionName: i.attribute_name, optionValue: i.option_value })), //
          avatar: senVar.variant_attributes.find(i => i.attribute_code === 'mau_sac')?.attribute_img,
          name: record.name,
          sku: senVar.sku,
          key: senVar.sku,
          importPrice: senVar.price,
          wholeSalePrice: senVar.price,
          retailPrice: senVar.price,
          unit: record?.unit || 'Cái',
          weightValue: record.weight,
          weightUnit: 'g',
          initPrice: record.price,
          initStock: senVar.quantity,
          inventories: {
            initPrice: senVar.price,
            onHand: senVar.quantity,
            available: 0,
            incoming: 0,
            onway: 0,
            trading: 0
          },
          sellable: senVar.Status === 'active',
        })
      }

      return variants
    } else {
      return [{
        ...record,
        options: [], //
        importPrice: record.price,
        wholeSalePrice: record.price,
        retailPrice: record.price,
        unit: record?.unit || 'Cái',
        weightValue: record.weight,
        weightUnit: 'g',
        initPrice: record.price,
        initStock: record.stock_quantity,
        inventories: {
          initPrice: record.price,
          onHand: record.stock_quantity,
          available: 0,
          incoming: 0,
          onway: 0,
          trading: 0
        },
        sellable: record.status === '2',
      }]
    }
  }

  const createVariantFromLazada = (record) => {
    if(record.variants.length > 0) {
      let variants = []
      for(let lazVar of record.variants) { 
        variants.push({
          options: lazVar.variant_attributes.map(i => ({ optionName: i.attribute_name, optionValue: i.option_value })),
          avatar: lazVar.avatar[0],
          name: record.attributes.name,
          sku: lazVar.sku,
          key: lazVar.sku,
          importPrice: lazVar.price,
          wholeSalePrice: lazVar.price,
          retailPrice: lazVar.price,
          unit: 'Cái',
          weightValue: lazVar.package_weight,
          weightUnit: 'g',
          initPrice: lazVar.price,
          initStock: lazVar.quantity,
          inventories: {
            initPrice: lazVar.price,
            onHand: lazVar.quantity,
            available: 0,
            incoming: 0,
            onway: 0,
            trading: 0
          },
          sellable: lazVar.Status === 'active',
        })
      }

      return variants
    } else {
      return []
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const variantColumns = [
    {
      title: 'Tên phiên bản',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => {
        return (
          <Tooltip placement="topLeft" title={text} arrowPointAtCenter>
            <Text style={{ width: 150 }} ellipsis={true}>{text}</Text>
          </Tooltip>
        )
      }
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      editable: true,
      width: 200,
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      editable: true,
      type: "number",
      width: 200,
      render: (text) => <div style={{ width: '100%', textAlign: 'right'}}>{amountFormatter(text)}</div>
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weightValue',
      key: 'weightValue',
      editable: true,
      width: 200,
      type: "number",
      render: (text, record) => <div style={{ width: '100%', textAlign: 'right'}}>{amountFormatter(text)}{record.platform === 'sendo' ? 'g' : 'kg'}</div>
    },
    {
      title: 'Tồn kho',
      dataIndex: 'initStock',
      key: 'initStock',
      editable: true,
      width: 200,
      type: "number",
      render: (value, record) => <div style={{ width: '100%', textAlign: 'right'}}>{amountFormatter(value)}</div>
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        type: col.type,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    }; 
  })

  const handleSave = (row) => {
    const newData = [...formValues.variants];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    console.log(newData)
    setFormValues({ variants: newData });
  };

  useEffect(() => {
    if(firstMount) {
      // const sku = record.sku
      const sku = record.platform === 'sendo' ? record.sku : record.attributes.name.trim().replace('-', '').split(/(\s+)/).filter(e => e.trim().length > 0).map(i => removeVI(i, { replaceSpecialCharacters: false })).join('-')
      const variants = record.platform === 'sendo' ? createVariantFromSendo(record) : createVariantFromLazada(record)
      setFormValues({
        productType: 'normal',
        key: sku,
        sku,
        name: record.platform === 'sendo' ? record.name : record.attributes.name,
        categoryName: record.platform === 'sendo' ? record.category_4_name : record.primary_category_name,
        categoryId: record.platform === 'sendo' ? record.cat_4_id : parseInt(record.primary_category),
        brand: '',
        description: record.platform === 'sendo' ? record.description : record.attributes.description,
        shortDescription: '',
        tags: '',
        retailPrice: record.platform === 'sendo' ? record.price : record.variants[0].price, // gia ban le
        wholeSalePrice: record.platform === 'sendo' ? record.price : record.variants[0].price, // gia ban buon
        importPrice: record.platform === 'sendo' ? record.price : record.variants[0].price, //gia nhap
        weightValue: record.platform === 'sendo' ? record.weight : record.variants[0].package_weight, //khoi luong
        unit: record.platform === 'sendo' && record.unit || 'Cái', // don vi tinh
        weightUnit: record.platform === 'sendo' ? 'g' : 'kg', //don vi khoi luong
        fileList: [],
        avatar: record.platform === 'sendo' ? record.avatar : record.variants[0].avatar[0],
        isConfigInventory: true,
        options: [],
        variants,
        sellable: record.platform === 'sendo' ? record.status === '2' : variants.some(variant => variant.sellable === true),
        autoLink: true,
        createFrom: record.platform
      })
    }
  }, [firstMount])

  const handleShowModal = () => {
    setShowModal(true)
    setFirstMount(true)
  }

  const handleHideModal = () => {
    setShowModal(false)
  }

  const handleFormSubmit = () => {
    console.log("record variants: ", record.variants)
    const finalData = {
      ...formValues,
      variants: formValues.variants.filter(i => selectedRowKeys.includes(i.key)),
      platformVariants: !!formValues.autoLink && record.variants.length > 0 ? record.variants.filter(i => selectedRowKeys.includes(i.sku)).map(i => ({ ...i, platform: record.platform })) : [record]
    }


    console.log(finalData)
    // props.createProductStart(finalData)
    props.createProductFromPlatformStart(finalData)
    setShowModal(false)
  }

  return (
    <>
      <Tooltip placement="topLeft" title="Tạo sản phẩm dưới hệ thống dựa trên sản phẩm sàn" arrowPointAtCenter>
        <Button key={`createProductFrom-${record._id}`} onClick={handleShowModal}><DownloadOutlined style={{ color: blue[5]}}/></Button>
      </Tooltip>
        <Modal
          title={"Tạo sản phẩm về hệ thống"}
          style={{ zIndex: 999999 }}
          id={"download-product-modal"}
          visible={showModal}
          width={1200}
          bodyStyle={{ padding: 0}}
          onCancel={handleHideModal}
          onOk={handleFormSubmit}
        >
          <div style={{ padding: '8px 32px'}}>
            <Row gutter={8}> 
              <Col span={8}>
                <div style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}><Text style={{ fontWeight: 400, color: 'black' }}>Ảnh sản phẩm</Text></div>
                <Image src={formValues.avatar || (record.platform === 'lazada' ? '/assets/LazadaBanner.png' : undefined)} width={120} height={120} style={{ padding: 5, border: '1px solid #ccc', borderRadius: 5 }}/>
              </Col>
              <Col span={16}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 400, color: 'black' }}>Tên sản phẩm</Text>
                  </div>
                  <Input style={{ width: '100%' }} value={formValues.name} onChange={(e) => setFormValues({ name: e.target.value })}/>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 400, color: 'black' }}>Mã sản phẩm/SKU</Text>
                  </div>
                  <Input style={{ width: '100%' }} value={formValues.sku} onChange={(e) => setFormValues({ name: e.target.value })}/>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 400, color: 'black' }}>Tự động liên kết</Text> &nbsp; <Checkbox checked={formValues.autoLink} onChange={(e) => setFormValues({ autoLink: e.target.checked })}/>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 400, color: 'black' }}>Mô tả sản phẩm</Text>
                  </div>
                  <TextEditor
                    initialValue={formValues.description}
                    handleChange={(value) => setFormValues({ description: value })}
                    style={{ maxHeight: 400, overflow: 'scroll' }}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 400, color: 'black' }}>Khối lượng</Text>
                  </div>
                  <Input className={'number-align'} type={'number'} suffix={formValues.weightUnit} value={formValues.weightValue} onChange={(e) => !isNaN(parseFloat(e.target.value)) && setFormValues({ weightValue: e.target.value })}/>
                </div>
              </Col>
              {
                formValues.variants?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Col span={24}>
                      <Title level={4}>{formValues.variants?.length} phiên bản sản phẩm</Title>
                    </Col>
                    <Col span={24}>
                      <Table 
                        components={components}
                        columns={variantColumns}
                        rowSelection={{
                          type: 'checkbox',
                          ...rowSelection,
                          selectedRowKeys
                        }}
                        className={'download-variant-confirm'}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={formValues.variants}
                        style={{
                          width: '100%',
                          wordWrap: 'break-word'
                        }}
                      />
                    </Col>
                  </div>
                )
              }  
            </Row>
          </div>
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = dispatch => ({
  createProductFromPlatformStart: (payload) => dispatch(ProductCreators.createProductFromPlatformStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductFromPlatformModal)
