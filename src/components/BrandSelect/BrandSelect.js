import React, { useState, useEffect, useReducer } from 'react'
import { Select } from 'antd'
import toast from 'Components/Helpers/ShowToast'
import { request } from 'Config/axios'
import { connect } from 'react-redux'

const { Option } = Select


let searchBrandTimeout;
let curBrandValue;

function searchBrandByName(value, callback) {
  if (searchBrandTimeout) {
    clearTimeout(searchBrandTimeout);
    searchBrandTimeout = null;
  }
  
  curBrandValue = value

  function fetch() {
    request.get(`/brands/search/${value}`)
      .then(response => {
        if(curBrandValue === value && response.code === 200) {
          callback(response.data)
        }
      })
      .catch(e => toast({ type: 'error', message: e.message }))
  }

  searchBrandTimeout = setTimeout(fetch, 1000);
}

export const BrandSelect = (props) => {
  const [searchBrandState, setSearchBrandState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      data: [],
      value: undefined
    }
  )

  const handleSingleSelectSearch = (value) => {
      if (value) {
        searchBrandByName(value, data => setSearchBrandState({ data }));
      } else {
        setSearchBrandState({ data: [] })
    }
  }

  const brandProps = { 
    onSearch: handleSingleSelectSearch,
    defaultActiveFirstOption: false,
  }

  const brandOptions = searchBrandState.data?.map(i => <Option key={i._id} value={i.name}>{i.name}</Option>)

  return <div>
    <Select 
      style={{ width: '87%', marginRight: 8}}
      showSearch 
      {...brandProps}
      {...props}
      onChange={value => {
        setSearchBrandState({ value })
        props.onChange && props.onChange(value)
      }}
      placeholder={'Gõ để tìm kiếm thương hiệu'}
    >
      {brandOptions.concat([<Option key={'No Brand'} value={'No Brand'}>{'No Brand'}</Option>])}
    </Select>
    <a href={"#"} onClick={(e) => {
      e.preventDefault()
      setSearchBrandState({ value: 'No Brand' })
      props.onChange && props.onChange('No Brand')
    }}>Không thương hiệu</a>
  </div>
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandSelect)
