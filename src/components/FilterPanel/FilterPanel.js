import React, { useState, useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
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
    const stores = useSelector(state => {
        const app = state.app.toJS()
        if(app) {
            const { storage } = app
            return [].concat(storage.sendoCredentials).concat(storage.lazadaCredentials)
        } else {
            return []
        }
    }) 

    const [visible, setVisible] = useState(false)
    const initialFilter =  {
        orderId: '',
        dateFrom: null,
        dateTo: null,
        customerName: '',
        customerPhone: '',
        orderStatus: null
    }
    const [filter, setFilter] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        initialFilter
    )

    // const menu = <Menu>
    //     <Menu.Item>
    //         <Col key="customerName" span={24}>
    //           <Input size={"large"} value={filter.customerName} placeholder={"Tên khách hàng"} suffix={<UserOutlined/>} allowClear onChange={e => setFilter({ customerName: e.target.value })}/>
    //         </Col>
    //     </Menu.Item>
    //     <Menu.Item>
    //         <Divider style={{ padding: 0, margin: '8px 0'}}/>   
    //     </Menu.Item>
    // </Menu>
    const menu = (
        <Menu gutter={16} key={"overlay-filter"}>
            <Menu.Item key="store_id" span={24} style={{ marginTop: 8 }}>
                {/* <Select
                    mode={"tags"}
                    size={"large"}
                    style={{ width: '100%'}}
                    suffixIcon={<HddOutlined/>}
                    placeholder={"Lọc theo gian hàng"}
                    options={[]}
                /> */}
            </Menu.Item>
            <Menu.Item key="customerName" span={24}>
                <Input size={"large"} value={filter.customerName} placeholder={"Tên khách hàng"} suffix={<UserOutlined/>} allowClear onChange={e => setFilter({ customerName: e.target.value })}/>
            </Menu.Item>
            <Menu.Item key="customerPhone" span={24}>
                <Input size={"large"} value={filter.customerPhone} placeholder={"SĐT khách hàng"} suffix={<PhoneOutlined/>} allowClear onChange={e => setFilter({ customerPhone: e.target.value })}/>
            </Menu.Item>
            <Menu.Item key="orderStatus" span={24}>
                <Select size={"large"} value={filter.orderStatus || 'Đang xử lý'} allowClear placeholder={"Trạng thái"} style={{ width: '100%', }} onChange={(value) => setFilter({ orderStatus: value })}>
                    <Option value={"Đang chờ xác nhận giao hàng"}>Đang chờ xác nhận thanh toán</Option>
                    <Option value={"Chờ xác nhận"}>Chờ xác nhận</Option>
                    <Option value={"Chờ giao hàng"}>Chờ giao hàng</Option>
                    <Option value={"Đã đóng gói"}>Đã đóng gói</Option>
                    <Option value={"Sẵn sàng giao hàng"}>Sẵn sàng giao hàng</Option>
                    <Option value={"Đang giao hàng"}>Đang giao hàng</Option>
                    <Option value={"Đã giao hàng"}>Đã giao hàng</Option>
                    <Option value={"Đã hủy"}>Đã hủy</Option>
                    <Option value={"Gặp sự cố"}>Gặp sự cố</Option>
                    <Option value={"Đã hoàn trả"}>Đã hoàn trả</Option>
                    <Option value={"Mất hàng"}>Mất hàng</Option>
                </Select>
            </Menu.Item>
            <Menu.Item style={{ padding: 0, margin: 0}} key={"divider"}>
                <Divider style={{ padding: 0, margin: '8px 0'}}/>   
            </Menu.Item>
            <Menu.Item gutter={16} style={{ padding: 8 }} key={"extra-button-filter"}>
                <Row>
                    <Col span={12}><Button style={{ width: '100%'}} onClick={() => {
                        setVisible(false)
                        setFilter({
                            customerName: '',
                            customerPhone: '',
                            orderStatus: null
                        })
                    }}>Hủy</Button></Col>
                    <Col span={12}><Button style={{ width: '100%'}} type={'primary'} onClick={() => {
                        setVisible(false)
                        handleFilterOrder()
                    }}>Áp dụng</Button></Col>
                </Row>
            </Menu.Item>
        </Menu>
    );

    const handleFilterOrder = () => {
        // console.log("Filter: ", filter)
        let finalFilter = {
            ...filter,
            dateFrom: new Date(filter.dateFrom).setHours(0), 
            dateTo: (new Date((new Date(new Date(filter.dateTo).setHours(23))).setMinutes(59))).setSeconds(59) // end of day
        }
        // dateFrom: new Date(dateStrings[0]).setHours(0), 
        // dateTo: (new Date((new Date(new Date(dateStrings[1]).setHours(23))).setMinutes(59))).setSeconds(59) // end of day
        alert(JSON.stringify(finalFilter, null, 2))
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
                    <Row>
                        <Col span={8}>
                            <Input size={'large'} name={"orderId"} value={filter.orderId} onChange={e => setFilter({ orderId: e.target.value })} style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} suffix={<BarcodeOutlined/>} placeholder={"Mã đơn hàng"} allowClear/>
                        </Col>
                        <Col span={8}>
                            <RangePicker value={[ filter.dateFrom && moment(filter.dateFrom, 'YYYY/MM/DD'),  filter.dateTo && moment(filter.dateTo, 'YYYY/MM/DD')]} suffixIcon={<CalendarOutlined style={{ color: 'black' }}/>} size={"large"} placeholder={["Từ ngày", "Đến ngày"]} onCalendarChange={handleCalendarChange}/>
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
                        <Button size={'large'} style={{ width: '100%'}} onClick={() => setFilter({ ...initialFilter })}><UndoOutlined /></Button>
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
