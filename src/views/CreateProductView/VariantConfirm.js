import React, { useEffect, useReducer, useContext, useState, useRef } from 'react'
import { connect } from 'react-redux'
import firebase from '../../utils/firebase'
import { Table, Input, Button, Select, Form, Row, Col, Divider, Modal, Image, InputNumber, Upload } from 'antd';
import { options } from 'less';
import { PlusOutlined } from '@ant-design/icons'
import ImagePicker from 'Components/ImagePicker'
import { amountFormatter, amountParser } from 'Utils/inputFormatter'
import { removeVI } from 'jsrmvi'
import './VariantConfirm.styles.scss'

const { Option } = Select;
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

export const VariantConfirm = (props) => {
  const [dataSource, setDataSource] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = [
    {
      title: 'Tên phiên bản',
      dataIndex: 'name',
      key: 'name',
      custom: 'qewewq',
      render: (text, record) => {
        return (
          <>
            <Row gutter={[0, 16]}>
              <Col span={4}>
                <img 
                  src={record.avatar || "data:image/png;base64,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"}
                  style={{ width: 30, height: 30}}
                  />
              </Col>
              <Col span={20}>
                {text}
              </Col>
            </Row>
          </>
        )
      }
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      editable: true,
    },
    {
      title: 'Giá bán lẻ',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      editable: true,
      type: "number",
      render: (text) => amountFormatter(text)
    },
    {
      title: 'Giá bán buôn',
      dataIndex: 'wholeSalePrice',
      key: 'wholeSalePrice',
      editable: true,
      type: "number",
      render: (text) => amountFormatter(text)
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weightValue',
      key: 'weightValue',
      editable: true,
      colSpan: 2,
      type: "number",
      render: (text) => amountFormatter(text)
    },
    {
      dataIndex: 'weightUnit',
      key: 'weightUnit',
      editable: true,
      colSpan: 0,
      editable: false,
    },
    {
      title: (
        <>
          <Row justify={"center"} style={{ borderBottom: '1px solid #ddd'}}>Chi nhánh mặc định</Row>
          <Row gutter={16}>
            <Col span={12} style={{ textAlign: 'center'}}>
              Tồn kho
            </Col>
            <Col span={12} style={{ textAlign: 'center'}}>
              Giá vốn
            </Col>
          </Row>
        </>
      ),
      colSpan: 2,
      dataIndex: 'initStock',
      key: 'initStock',
      editable: true,
      type: "number",
      render: (text) => amountFormatter(text)
    },
    {
      key: 'initPrice',
      dataIndex: 'initPrice',
      colSpan: 0,
      editable: true,
      type: "number",
      render: (text) => amountFormatter(text)
    }
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
  });
  
  const createDataSource = (generalData) => {
    const { options } = generalData
    const arr = options.map(option => option.optionValue)
    let variants = []
    let n = arr.length
 
    let indices = []
 
    for (let i = 0; i < n; i++) {
      indices[i] = 0;
    }

    while (1) {
        let variantName = ''
        for (let i = 0; i < n; i++) {
          variantName += ' - ' + arr[i][indices[i]]
        }

        const variantNameArr = variantName.split(' - ')
        variantNameArr.shift()

        variants.push({
          avatar: '',
          name: generalData.name + variantName,
          key: variantName,
          sku: generalData.sku + '-' + variantNameArr.map(i => removeVI(i, { replaceSpecialCharacters: false })).join('-'),
          options: variantNameArr,
          importPrice: generalData.importPrice,
          wholeSalePrice: generalData.wholeSalePrice,
          retailPrice: generalData.retailPrice,
          unit: generalData.unit,
          weightValue: generalData.weightValue,
          weightUnit: generalData.weightUnit,
          initPrice: generalData.initPrice || 0,
          initStock: generalData.initStock || 0,
          inventories: {
            initPrice: generalData.initPrice || 0,
            onHand: generalData.initStock || 0,
            // onHand: 0,
            available: 0,
            incoming: 0,
            onway: 0,
            trading: 0
          },
          sellable: generalData.sellable || true,
        })
 
        let next = n - 1;
        while (next >= 0 && (indices[next] + 1 >= arr[next].length)) {
          next--;
        }
 
        if (next < 0) {
          break;
        }
 
        indices[next]++;
 
        for (let i = next + 1; i < n; i++) {
          indices[i] = 0;
        }
    }

    setDataSource(props.initialFormValues.isStockDivided ? variants.map(i => ({
      ...i,
      initStock: Math.floor(i.initStock / variants.length),
        inventories: {
          ...i.inventories,
          onHand: Math.floor(i.inventories.onHand / variants.length),
          // available: Math.floor(i.inventories.onHand / variants.length),
        }
    })) : variants)
    setSelectedRowKeys(variants.map(i => i.key))
 }

  useEffect(() => {
    createDataSource(props.initialFormValues)
  }, [])

  const handleDelete = (key) => {
    const dataSource = [...dataSource];
    setDataSource({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
 
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    console.log(newData)
    setDataSource(newData);
    console.log("save")
  };

  //<-------------------------------------------image handler----------------------------------------->

  const [uploaderState, setUploaderState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: props.initialFormValues.fileList || [],
      imageUrlList: props.initialFormValues.avatar || [],
    }
  )

  const { previewVisible, previewImage, fileList, imageUrlList, previewTitle } = uploaderState;

  const handleImageChange = ({ fileList }) => setUploaderState({ fileList });

  const handleChooseImage = async file => {
    const chosenUrl = imageUrlList[fileList.findIndex(item => item.name === file.name)]
    // fileList.map(file => ({ ...file, avatar: chosenUrl}))
    setDataSource(dataSource.map(item => ({ 
      ...item,
      avatar: chosenUrl
    })))
  }

  const handleImageUpload = async ({ onSuccess, file, onError }) => {
    const storage = firebase.storage()
    const metadata = {
      contentType: 'image/jpeg'
    }

    const storageRef = storage.ref()
    const imgFile = storageRef.child(`${props.auth.user._id}/${Date.now() + '_' + file.name}`);
    try {
      const image = await imgFile.put(file, metadata);
      await imgFile.getDownloadURL().then(url => {
        setUploaderState({ imageUrlList: [...imageUrlList, url] })
      })
      onSuccess(null, image);
    } catch(e) {
      onError(e);
    }
  }

  //<----------------------------------------image handler-------------------------------------->

  //<----------------------------------------set avatar handler--------------------------------->
  const onSetAllAvatar = (url) => {
    setDataSource(dataSource.map(item => ({ 
      ...item,
      avatar: url
    })))
  }
  //<----------------------------------------set avatar handler--------------------------------->

  //<----------------------------------------form submit handler--------------------------------->
  const handleSubmit = () => {
    const submitData = dataSource.filter(i => selectedRowKeys.includes(i.key))

    console.log(submitData)
    props.handleSubmit(submitData)
  }
  //<----------------------------------------form submit handler--------------------------------->

  return (
    <>
      <Row style={{ marginBottom: 10}}>
        <ImagePicker
          defaultFileList={[...imageUrlList].map((file, index) => ({ key: index, url: file}))}
          onOk={onSetAllAvatar}
          className={"upload-list-inline"}
          label={"Chọn ảnh cho tất cả phiên bản"}
          render={Button}
        />
      </Row>
      <Row gutter={16} id="Variant product confirm">
        <Table 
          components={components}
          columns={columns}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
            selectedRowKeys
          }}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          style={{
            width: '100%'
          }}
        />
      </Row>
      <Divider />
      <Row id="create product footer" justify="end">
        <Col>
          <Button style={{ marginRight: '10px'}} onClick={() => props.prev()}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit}>Tiếp theo</Button>
        </Col>
      </Row>
    </>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantConfirm)
