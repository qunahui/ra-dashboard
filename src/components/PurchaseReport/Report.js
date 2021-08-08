import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Row, Col, Tooltip, Typography, Select, Menu, DatePicker, Divider, Card, Button } from 'antd'
import { request } from 'Config/axios'
import { connect } from 'react-redux'
import { InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import './styles.scss'
import { moneyFormatter } from 'Utils/inputFormatter'
import { Line } from '@ant-design/charts';
import _ from 'lodash'
import THEME from 'Theme'

const cardBorder = { 
    border: `${THEME.borderBase}px solid ${THEME.borderColorBase}`,
    boxShadow: THEME.boxShadowLight,
    borderRadius: THEME.radiusMd
}

const { Title, Text } = Typography
const { Option } = Select
const { SubMenu } = Menu

let d = new Date()

const initialFilter = {
    period: "month",
    dateFrom: new Date(d.setDate(d.getDate()- 30)).setHours(0, 0, 0, 0),
    dateTo: new Date().getTime()
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
    return;
}

let getDaysArray = function(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

const createChartData = (chartData, dateFrom, dateTo) => {
    let arr = getDaysArray(dateFrom, dateTo)?.map(i => {
        let date = new Date(i).toLocaleDateString('vi').split('/')
        return {
            date: date[0] + '/' + date[1],
            day: date[0],
            month: date[1]
        }
    })

    let chartArr = []
    arr?.some(i => {
        chartArr = chartArr.concat([{
            date: i.date,
            day: i.day,
            month: i.month,
            orderStatus: 'Đã hủy',
            value: 0
        }, {
            date: i.date,
            day: i.day,
            month: i.month,
            orderStatus: 'Đã hoàn trả',
            value: 0
        }, {
            date: i.date,
            day: i.day,
            month: i.month,
            orderStatus: 'Đặt hàng',
            value: 0
        }, {
            date: i.date,
            day: i.day,
            month: i.month,
            orderStatus: 'Hoàn thành',
            value: 0
        }])
    })

    chartData?.map(i => {
        let date = new Date(i?.createdAt).toLocaleDateString('vi').split('/')
        if(i.orderStatus === 'Đã hủy' || i.orderStatus === 'Hoàn thành' || i.orderStatus === 'Đã hoàn trả' || i.orderStatus === 'Đặt hàng') {
            let index = chartArr.findIndex(item => {
                return item.day === date[0] && item.orderStatus === i.orderStatus
            })

            chartArr[index] = {
                ...chartArr[index],
                value: chartArr[index]?.value + 1
            }
        }
    })

    // return arr
    return chartArr
}

export const Report = (props) => {
    const [value, setValue] = useState('last30days')
    const [isShowWeekPicker, setIsShowWeekPicker] = useState(false)
    const [isShowMonthPicker, setIsShowMonthPicker] = useState(false)
    const [dateFrom, setDateFrom] = useState(initialFilter?.dateFrom)
    const [dateTo, setDateTo] = useState(initialFilter?.dateTo)
    const [report, setReport] = useState(null)
    const [chartData, setChartData] = useState([])


    async function fetchReport(params = initialFilter) {
        try {
            const result = await request.get('/reports/purchase', {
                params
            })
            if(result.code === 200) {
                setReport(result.data)
                setChartData(createChartData(result?.data?.listOrder?.purchaseOrder, params?.dateFrom, params?.dateTo))
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

    function handleDateMonthChange(date, dateString) {
        const [year, month] = dateString.split('-')
        const lastDayOfMonth = getDaysInMonth(month, year)
        const dateFrom = new Date(`${year}-${month}-${1}`).setHours(0, 0, 0, 0)
        const dateTo = new Date(`${year}-${month}-${lastDayOfMonth}`).setHours(23,59, 59, 59)
        setDateFrom(dateFrom)
        setDateTo(dateTo)
    }

    function handleDateWeekChange(date, dateString) {
        const firstDayOfWeek = date.startOf('week').toDate().getTime()
        const endDayOfWeek = date.endOf('week').toDate().getTime()
        setDateFrom(firstDayOfWeek)
        setDateTo(endDayOfWeek)
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
            if(value === 'last7days') {
                let now = new Date()
                setDateFrom(new Date(now.setDate(now.getDate()- 7)).setHours(0, 0, 0, 0))
                setDateTo( new Date().getTime())
            } else if(value === 'last30days') {
                setDateFrom(initialFilter?.dateFrom)
                setDateTo(initialFilter?.dateTo)
            }
            setIsShowWeekPicker(false)
            setIsShowMonthPicker(false)
        }
    }

    function handleSubmit() {
        if(value !== 'week' && value !== 'month') {
            fetchReport({ period: value, dateFrom, dateTo })
        } else if(value === 'week') {
            fetchReport({ period: value, dateFrom, dateTo })
        } else if(value === 'month') {
            fetchReport({ period: value, dateFrom, dateTo })
        }
    }

    let config = {
        data: chartData,
        xField: 'day',
        yField: 'value',
        seriesField: 'orderStatus',
        color: function color(_ref) {
            let orderStatus = _ref.orderStatus;
            switch(orderStatus) {
                case 'Đã hủy': return '#F4664A'
                case 'Đặt hàng': return '#FAAD14'
                case 'Đã hoàn trả': return '#1890ff'
                case 'Hoàn thành': return '#30BF78'
            
                default: return '#30BF78'
            }
        },
        legend: { position: 'top' },
        // smooth: true, 
        meta: {
        ['value']: {
            nice: false,
            values: [0, 10, 20]
        }
        },   
        animation: {
          appear: {
            animation: 'path-in',
            duration: 2000,
          },
        },
      };

    const calcRefundOrderNumber = () => {
        let total = parseInt(report?.listOrder?.refundOrder?.length)
        total += parseInt(report?.listOrder?.purchaseOrder.reduce((acc, i) => { if(i.orderStatus === 'Đã hoàn trả') { acc++ } return acc }, [0]))
        return total
    }

    return (
        <Card style={{...cardBorder, width: '100%' }} title={"Khoảng chi"}>  
            <Row style={{ margin: '0 8px', width: '100%', marginBottom: 8 }}>
                <Select defaultValue={value} style={{ minWidth: 200 }} onChange={handleChange}>
                    <Option key={"last7days"} value={'last7days'}>7 ngày gần nhất</Option>
                    <Option key={"last30days"} value={'last30days'}>30 ngày gần nhất</Option>
                    <Option key={"week"} value={'week'}>Theo tuần</Option>
                    <Option key={"month"} value={'month'}>Theo tháng</Option>
                </Select>
                {
                    isShowWeekPicker && <DatePicker picker={"week"} style={{ marginLeft: 16 }} onChange={handleDateWeekChange} defaultValue={moment()}/>
                }
                {
                    isShowMonthPicker && <DatePicker picker={"month"} style={{ marginLeft: 16 }} onChange={handleDateMonthChange} defaultValue={moment()}/>
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
                            Đơn hàng hoàn &nbsp; <Tooltip placement="top" title={"Tổng số đơn hàng đã được hoàn trả trong khoảng thời gian được chọn."}><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                            </div>
                            <div className={"order-count"}>
                                <Text strong style={{ fontSize: 18 }}>{calcRefundOrderNumber() || 0 }</Text> <Text style={{ fontSize: 16}}>Đơn</Text>
                            </div>
                            <div className={"change"}>-- Không đổi</div>
                            <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                    <div className={"grid-item"}>
                        <div className={"title"}>
                            Đơn hàng đang xử lý &nbsp; <Tooltip title={"Tổng các đơn hàng đang được xử lý trong khoảng thời gian đã chọn"} placement="top"><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                            </div>
                        <div className={"order-count"}>
                            <Text strong style={{ fontSize: 18 }}>{report?.listOrder?.purchaseOrder?.reduce((acc, i) => { if(!['Đã hủy', 'Đã hoàn trả', 'Hoàn thành'].includes(i.orderStatus)) { acc++ } return acc }, [0])}</Text> <Text style={{ fontSize: 16}}>đ</Text>
                        </div>
                        <div className={"change"}>
                            {report?.revenue?.status === 'Equal' ? '-- Không đổi' : `${report?.revenue?.status === 'Greater' ? 'Tăng' : 'Giảm'} ${report?.revenue?.percent || 0}%`}
                        </div>
                        <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                    <div className={"grid-item"}>
                        <div className={"title"}>
                            Doanh thu &nbsp; <Tooltip title={"Tổng doanh thu trong khoảng thời gian đã chọn"} placement="top"><InfoCircleOutlined style={{ cursor: 'pointer' }}/></Tooltip>
                            </div>
                        <div className={"order-count"}>
                            <Text strong style={{ fontSize: 18 }}>{moneyFormatter(report?.revenue?.value || 0)}</Text> <Text style={{ fontSize: 16}}>đ</Text>
                        </div>
                        <div className={"change"}>
                            {report?.revenue?.status === 'Equal' ? '-- Không đổi' : `${report?.revenue?.status === 'Greater' ? 'Tăng' : 'Giảm'} ${report?.revenue?.percent || 0}%`}
                        </div>
                        <Text secondary style={{ fontSize: 12}}>So với 30 ngày trước</Text>
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ margin: '0 8px', width: '100%' }}>
                <Line {...config} style={{ width: '100%' }}/>
            </Row>
        </Card>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
