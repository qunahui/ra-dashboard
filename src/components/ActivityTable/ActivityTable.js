import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AppCreators from 'Redux/app'
import toast from 'Components/Helpers/ShowToast'
import _ from 'lodash'
import { Table, Typography, Input, Space, Button, Card } from 'antd';
import Highlighter from 'react-highlight-words'
import Icon, { SearchOutlined } from '@ant-design/icons'
import { request } from 'Config/axios'

import { cardBorder } from './styles'

const { Text, Title } = Typography

const Activity = props => {
  const history = useHistory()
  const [dataSource, setDataSource] = React.useState([])
  const [searchState, setSearchState] = React.useState({
    searchText: '',
    searchedColumn: '',
  })

  async function getActivity() {
    try { 
      const response = await request.get('/api/storage/activities')

      if(response.code === 200) {
        setDataSource(response.data)
      }
    } catch(e) {
       toast({ type: 'error', message: 'Lấy lịch sử hoạt động của kho thất bại: ' + e.message })
    }
  }

  React.useEffect(() => {
    getActivity()
  }, [props])

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm `}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : '',
    render: text =>
      searchState.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchState.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchState({ searchText: '' });
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      witdh: '25%',
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Vai trò',
      dataIndex: 'userRole',
      key: 'userRole',
      witdh: '25%',
      filters: [{
        text: 'Chủ cửa hàng',
        value: 'Chủ cửa hàng',
      },{
        text: 'Nhân viên',
        value: 'Nhân viên',
      },],
      onFilter: (value, record) => record.userRole === value,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'message',
      key: 'message',
      witdh: '35%',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      witdh: '15%',
        render: value => <Text>{new Date(value).toLocaleTimeString()} - {new Date(value).toLocaleDateString()}</Text>
    }
  ]

  return (
    <Card 
      title={<Title level={4} style={{ marginLeft: 8 }}>Hoạt động gần đây</Title>}
      style={{ ...cardBorder, marginTop: 24 }}
    >
      <Table columns={columns} dataSource={dataSource} bordered/>
    </Card>
  )
}

export default connect(state => ({
  app: state.app.toJS()
}), dispatch => ({
}))(Activity)