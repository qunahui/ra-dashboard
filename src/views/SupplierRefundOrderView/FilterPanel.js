import React, { useState, useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { Input, Select, Row, Col, Typography, DatePicker, Dropdown, Menu, Button, Divider, Tooltip } from 'antd'
import Icon, { BarcodeOutlined, UserOutlined, CalendarOutlined, FilterOutlined, PhoneOutlined, UndoOutlined, HddOutlined } from '@ant-design/icons'
import moment from 'moment'
// import { connect } from 'react-redux'
import './FilterPanel.styles.scss'

const { Option } = Select
const { Text, Title } = Typography
const { RangePicker } = DatePicker;
const { Submenu } = Menu

export const FilterPanel = (props) => {
    useEffect(() => {
        if(!_.isEqual(props.filter, filter)) {
            setFilter({ ... props.filter })
        }
    }, [props])

    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        props?.defaultFilter
    )

    const menu = (
        <Menu gutter={16} key={"overlay-filter"}>
            <Menu.Item key="supplierName" span={24}>
                <Input size={"large"} value={filter.supplierName} placeholder={"Tên nhà cung cấp"} suffix={<UserOutlined/>} allowClear onChange={e => setFilter({ supplierName: e.target.value })}/>
            </Menu.Item>
            <Menu.Item key="supplierPhone" span={24}>
                <Input size={"large"} value={filter.supplierPhone} placeholder={"SĐT nhà cung cấp"} suffix={<PhoneOutlined/>} allowClear onChange={e => setFilter({ supplierPhone: e.target.value })}/>
            </Menu.Item>
            <Menu.Item key="orderStatus" span={24}>
                <Select size={"large"} value={filter.orderStatus} allowClear placeholder={"Trạng thái"} style={{ width: '100%', }} onChange={(value) => setFilter({ orderStatus: value })}>
                    <Option value={"Đặt hàng"}>Đặt hàng</Option>
                    <Option value={"Duyệt"}>Duyệt</Option>
                    <Option value={"Đóng gói"}>Đóng gói</Option>
                    <Option value={"Xuất kho/Đang giao hàng"}>Xuất kho/Đang giao hàng</Option>
                    <Option value={"Đã giao hàng"}>Đã giao hàng</Option>
                    <Option value={"Hoàn thành"}>Hoàn thành</Option>
                    <Option value={"Đã hủy"}>Đã hủy</Option>
                    <Option value={"Đang hoàn trả"}>Đang hoàn trả</Option>
                    <Option value={"Đã hoàn trả"}>Đã hoàn trả</Option>
                </Select>
            </Menu.Item>
            <Menu.Item style={{ padding: 0, margin: 0}} key={"divider"}>
                <Divider style={{ padding: 0, margin: '8px 0'}}/>   
            </Menu.Item>
            <Menu.Item gutter={16} style={{ padding: 8 }} key={"extra-button-filter"}>
                <Row>
                    <Col span={11}><Button style={{ width: '100%'}} onClick={() => {
                        setVisible(false)
                        setFilter({
                            supplierName: '',
                            supplierPhone: '',
                            orderStatus: null
                        })
                    }}>Hủy</Button></Col>
                    <Col offset={1} span={11}><Button style={{ width: '100%'}} type={'primary'} onClick={() => {
                        setVisible(false)
                        handleFilterOrder()
                    }}>Áp dụng</Button></Col>
                </Row>
            </Menu.Item>
        </Menu>
    );

    const handleFilterOrder = () => {
        let finalFilter = {
            ...filter,
            dateFrom: new Date(new Date(filter.dateFrom).setHours(0, 0, 0, 0)), 
            dateTo: new Date(new Date(filter.dateTo).setHours(23, 59, 59, 59)), 
        }
        props.handleFilterSubmit && props.handleFilterSubmit(finalFilter)
    }
    

    const handleCalendarChange = (dates, dateStrings, info) => {
        console.log("Dates: ", new Date(dateStrings[0]), info)
        console.log("Dates: ", new Date(dateStrings[1]), info)
        if(dateStrings[0] && dateStrings[1]) {
            setFilter({
                dateFrom: dateStrings[0],
                dateTo: dateStrings[1]
            })
        }
    }

    return (
        <div style={{
            padding: '8px 16px',
            borderRadius: 2,
            fontWeight: 700
        }}>
            <Row gutter={8}>
                <Col span={16}>
                    <Row gutter={8}>
                        <Col span={8}>
                            <Input size={'large'} name={"code"} value={filter.code} onChange={e => setFilter({ code: e.target.value })} style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} suffix={<BarcodeOutlined/>} placeholder={"Mã đơn hàng"} allowClear/>
                        </Col>
                        <Col span={8}>
                            <RangePicker style={{ width: '100%'}} value={[ filter.dateFrom && moment(filter.dateFrom, 'YYYY/MM/DD'),  filter.dateTo && moment(filter.dateTo, 'YYYY/MM/DD')]} suffixIcon={<CalendarOutlined style={{ color: 'black' }}/>} size={"large"} placeholder={["Từ ngày", "Đến ngày"]} onCalendarChange={handleCalendarChange}/>
                        </Col>
                        <Col span={8}>
                            <Dropdown 
                                overlay={menu} 
                                trigger={["click"]}
                                visible={visible}
                            >
                                <span
                                    className={"ant-input-affix-wrapper ant-input-affix-wrapper-lg"}
                                    style={{ borderBottomRightRadius: 5, borderTopRightRadius: 5 }}
                                    onClick={() => setVisible(true)}
                                >
                                    <Row justify={"space-between"} style={{ width: '100%' }}>
                                        <Text style={{ fontWeight: 450, color: "black" }}>Bộ lọc nâng cao</Text>
                                        <span className={"ant-input-suffix"}>
                                            <FilterOutlined style={{ fontSize: 16 }}/>
                                        </span>
                                    </Row>
                                </span>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
                <Col span={2}>
                    {/* RESET */}
                    <Tooltip placement="topLeft" title={"Cài đặt lại"} arrowPointAtCenter>
                        <Button size={'large'} style={{ width: '100%'}} onClick={() => setFilter({ ...props?.defaultFilter })}><UndoOutlined /></Button>
                    </Tooltip>
                </Col>
                <Col span={6}>
                    <Button type={'primary'} style={{ width: '100%'}} size={"large"} onClick={handleFilterOrder}>Tìm kiếm</Button>
                </Col>
            </Row>
        </div>
    )
}

export default FilterPanel

// const mapStateToProps = (state) => ({
    
// })

// const mapDispatchToProps = {
    
// }

// export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel)
