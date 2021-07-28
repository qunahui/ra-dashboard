import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Row, Col, Tooltip, Typography, Select, Menu, DatePicker, Dropdown, Button } from 'antd'
import { request } from 'Config/axios'
import { connect } from 'react-redux'
import { InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import './styles.scss'
import { moneyFormatter } from 'Utils/inputFormatter'

const { Title, Text } = Typography
const { Option } = Select
const { SubMenu } = Menu

const dateFormat = "YYYY-DD-MM";

const initialFilter = {
    period: "month",
    dateFrom: 1622505600*1000,
    dateTo: 1625097599*1000
}

const calcLast = key => {
    let today = new Date()
    if(key === 'week') {
        let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        return `${new Date().toLocaleDateString()} - ${lastWeek.toLocaleDateString()}`
    } else if(key === 'month') {
        let lastWeek = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return `${new Date().toLocaleDateString()} - ${lastWeek.toLocaleDateString()}`
    }
    retunr;
}

export const Report = (props) => {
    const [value, setValue] = useState('last30days')
    const [isShowWeekPicker, setIsShowWeekPicker] = useState(false)
    const [isShowMonthPicker, setIsShowMonthPicker] = useState(false)
    const [dateFrom, setDateFrom] = useState(null)
    const [dateTo, setDateTo] = useState(null)
    const [report, setReport] = useState(null)
    async function fetchReport(params = initialFilter) {
        try {
            const result = await request.get('/reports', {
                params
            })
            if(result.code === 200) {
                setReport(result.data)
            }
        } catch(e) {
            console.log(e.message)
        }        
    }
    useEffect(() => {
        fetchReport()
    }, [])

    const getDaysInMonth = function(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function handleDateChange(date, dateString) {
        const [year, month] = dateString.split('-')
        const lastDayOfMonth = getDaysInMonth(month, year)
        const dateFrom = new Date(`${year}-${month}-${1}`).setHours(0, 0, 0, 0)
        const dateTo = new Date(`${year}-${month}-${lastDayOfMonth}`).setHours(23,59, 59, 59)
        setDateFrom(dateFrom)
        setDateTo(dateTo)
    }
    
    function handleChange(value) {
        setValue(value)
        if(value === 'week') {
            setIsShowWeekPicker(true)
            setIsShowMonthPicker(false)
        } else if(value === 'month') {
            setIsShowWeekPicker(false)
            setIsShowMonthPicker(true)
        } else {
            setIsShowWeekPicker(false)
            setIsShowMonthPicker(false)
        }
    }

    function handleSubmit() {
        if(value !== 'week' && value !== 'month') {
            fetchReport({ period: value })
        } else {
            fetchReport({ period: value, dateFrom, dateTo })
        }
    }

    return (
        <>  
            <Row style={{ margin: '0 8px', width: '100%'}}>
                <Select defaultValue={value} style={{ minWidth: 200 }} onChange={handleChange}>
                    <Option key={"last7days"} value={'last7days'}>7 ngày gần nhất</Option>
                    <Option key={"last30days"} value={'last30days'}>30 ngày gần nhất</Option>
                    <Option key={"week"} value={'week'}>Theo tuần</Option>
                    <Option key={"month"} value={'month'}>Theo tháng</Option>
                </Select>
                {
                    isShowWeekPicker && <DatePicker picker={"week"} style={{ marginLeft: 16 }} onChange={handleDateChange} defaultValue={moment()}/>
                }
                {
                    isShowMonthPicker && <DatePicker picker={"month"} style={{ marginLeft: 16 }} onChange={handleDateChange} defaultValue={moment()}/>
                }
                <Button style={{ marginLeft: 8 }} type={"primary"} onClick={handleSubmit}>Tìm kiếm</Button>
            </Row>
            <Row gutter={[16, 16]} style={{ background: 'white', margin: '0 8px', width: '100%'}}>
                <Col span={24} className={"grid-report"}>
                    <div className={"grid-item"}>
                        <div className={"title"}>
                            Tổng đơn hàng &nbsp; <Tooltip placement="top" title={"Tất cả đơn hàng của Shop trong thời gian được chọn."}><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                        </div>
                        <div className={"order-count"}>
                            <Text strong style={{ fontSize: 18 }}>{report?.totalOrders?.value || 0}</Text> <Text style={{ fontSize: 16}}>Đơn</Text>
                        </div>
                        <div className={"change"}>
                            {report?.totalOrders?.status === 'Equal' ? '-- Không đổi' : `${report?.totalOrders?.status === 'Greater' ? 'Tăng' : 'Giảm'} ${report?.totalOrders?.percent || 0}%`}
                        </div>
                        <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                    <div className={"grid-item"}>
                        <div className={"title"}>
                            Đơn hàng hoàn tất &nbsp; <Tooltip placement="top"  title={"Tổng số đơn hàng hoàn tất không có khiếu nại (nếu có), không bao gồm các đơn trạng thái đã giao hàng."}><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                            </div>
                            <div className={"order-count"}>
                                <Text strong style={{ fontSize: 18 }}>{report?.completeOrders?.value}</Text> <Text style={{ fontSize: 16}}>Đơn</Text>
                            </div>
                            <div className={"change"}>
                                {report?.completeOrders?.status === 'Equal' ? '-- Không đổi' : `${report?.completeOrders?.status === 'Greater' ? 'Tăng' : 'Giảm'} ${report?.completeOrders?.percent || 0}%`}
                            </div>
                            <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                    <div className={"grid-item"}>
                        <div className={"title"}>
                            Đơn hàng hủy &nbsp; <Tooltip placement="top" title={"Tổng số đơn hàng đã hủy trong khoảng thời gian được chọn."}><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                            </div>
                            <div className={"order-count"}>
                                <Text strong style={{ fontSize: 18 }}>{report?.cancelOrders?.value}</Text> <Text style={{ fontSize: 16}}>Đơn</Text>
                            </div>
                            <div className={"change"}>
                                {report?.cancelOrders?.status === 'Equal' ? '-- Không đổi' : `${report?.cancelOrders?.status === 'Greater' ? 'Tăng' : 'Giảm'} ${report?.cancelOrders?.percent || 0}%`}
                            </div>
                            <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                    <div className={"grid-item"}>
                        <div className={"title"}>
                            Đơn hàng hoãn &nbsp; <Tooltip placement="top" title={"Tổng số đơn hàng chưa được xử lý trong khoảng thời gian được chọn."}><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                            </div>
                            <div className={"order-count"}>
                                <Text strong style={{ fontSize: 18 }}>0</Text> <Text style={{ fontSize: 16}}>Đơn</Text>
                            </div>
                            <div className={"change"}>-- Không đổi</div>
                            <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                    <div className={"grid-item"}>
                        <div className={"title"}>
                            Doanh thu &nbsp; <Tooltip title={"Tổng doanh thu trong khoảng thời gian đã chọn"} placement="top"><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                            </div>
                            <div className={"order-count"}>
                                <Text strong style={{ fontSize: 18 }}>{moneyFormatter(report?.revenue?.value)}</Text> <Text style={{ fontSize: 16}}>đ</Text>
                            </div>
                            <div className={"change"}>
                                {report?.revenue?.status === 'Equal' ? '-- Không đổi' : `${report?.revenue?.status === 'Greater' ? 'Tăng' : 'Giảm'} ${report?.revenue?.percent || 0}%`}
                            </div>
                            <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                </Col>
            </Row>
        </>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
