import React, { useEffect, useState, useRef, Fragment } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { request } from 'Config/axios'
import qs from 'qs'
import { Cascader, Input, Divider, AutoComplete } from 'antd'
import { EditOutlined, LoadingOutlined } from '@ant-design/icons' 
import './SendoCategoryPicker.styles.scss'

const SendoCategoryPicker = (props) => {
  const linkRef = useRef(null)
  const [rootCategory, setRootCategory] = useState([])
  const [renderState, setRenderState] = useState({
    name: (props.renderState.name && props.renderState.name) || '',
    value: (props.renderState.value && props.renderState.value) || 0,
  })

  useEffect(() => {
    if(!_.isEqual(props.renderState, renderState)) {
      setRenderState(props.renderState)
    }
  }, [props.renderState])

  const loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true
    
    targetOption.children = await fetchCategory(targetOption.idpath)
    targetOption.loading = false
    setRootCategory([...rootCategory])
  }

  const handleChange = (value, selectedOptions) => {
    if(selectedOptions.length === 0) {
      props.handleSelect(renderState)
    } else if(selectedOptions[selectedOptions.length - 1].isLeaf === true) {
      const primaryOption = selectedOptions[selectedOptions.length - 1]
      let transformNamepath = primaryOption.namepath.join(' > ')

      props.handleSelect({
        name: transformNamepath,
        value: primaryOption.value
      })

      setRenderState({
        name: transformNamepath,
        value: primaryOption.value
      })
    }
  }

  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchState, setSearchState] = useState({
    typing: false,
    typingTimeout: 0
  })

  const handleSearch = async (value) => {
    if (searchState.typingTimeout) {
      clearTimeout(searchState.typingTimeout);
    }
    
    setSearchLoading(true)
    setSearchState({
      typing: false,
      typingTimeout: setTimeout(function () {
        value && searchCategory(value)
      }, 1000)
    })
  };

  async function searchCategory(value) {
    console.log("Search: ", value)
    try {
      const response = await request.get('/sendo/categories/search', {
        params: {
          search: value
        }
      })

      if(response.code === 200) {
        setSearchOptions(response.data.map(i => ({
          ...i,
          value: i?.namepath?.join(' > '),
          label: i?.namepath?.join(' > ')
        })))
        setSearchLoading(false)
      }
    } catch(e) {
      console.log(e.message)
    }
  }

  const handleSearchCategorySelect = value => {
    console.log("value: ", value)
    let selectedCategory = searchOptions.find(i => i.namepath.join(' > ') === value)
    let acc = []

    for(let index = 0; index < selectedCategory.idpath.length; index++) {
      acc.push({
        category_id: selectedCategory.idpath[index],
        idpath: selectedCategory.idpath.reduce((acc, idp, idx) => {
          if(idx <= index) acc.push(idp)
          return acc
        }, []),
        isLeaf: index === selectedCategory.idpath.length - 1,
        leaf: index === selectedCategory.idpath.length - 1,
        label: selectedCategory.namepath[index],
        name: selectedCategory.namepath[index],
        value: selectedCategory.idpath[index],
        namepath: (index === selectedCategory.idpath.length - 1) && selectedCategory.namepath  
      })
    }

    linkRef.current?.click()

    handleChange(value, acc)
  }
  
  const fetchCategory = async (idpath = []) => {
    const result = await request.get('/sendo/categories', {
      params: {
        idpath
      },
      paramsSerializer: params => {
        return qs.stringify(params)
      } 
    })

    return result.data.map(cat => ({
      label: cat.name,
      value: cat.category_id,
      isLeaf: cat.leaf,
      ...cat
    }))
  }

  useEffect(() => {
    async function fetchRootCategory() {
      setRootCategory(await fetchCategory())
    }
    fetchRootCategory()
  }, [])

  function dropdownRender(menus) {
    return (
      <div className={'custom-cascader'} style={{ padding: '16px 8px', border: '1px solid #ccc', borderRadius: 5, width: 800, minHeight: 300 }}>
        <AutoComplete
          dropdownMatchSelectWidth={252}
          style={{
            width: '100%',
          }}
          options={!searchLoading && searchOptions.map(i => ({
            value: i.value,
            label: i.label
          }))}
          onSearch={handleSearch}
          loading
          notFoundContent={<LoadingOutlined />}
          onSelect={handleSearchCategorySelect}
        >
          <Input.Search loading={searchLoading} enterButton/>
        </AutoComplete>
        {menus}
      </div>
    )
  }

  return (
    <>
      <div>
        {renderState.name && <>{renderState.name} &nbsp;</>} 
        <Cascader 
          options={rootCategory} 
          loadData={loadData} 
          placeholder={'Ngành hàng'} 
          changeOnSelect
          allowClear={true}  
          onChange={handleChange}
          fieldNames={(label, value, children) => {
            console.log("fields: ", label, value, children)
          }}
          dropdownRender={dropdownRender}
        >
          {renderState.name && <a ref={linkRef} href="#">Edit <EditOutlined /></a> }
        </Cascader>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(SendoCategoryPicker)
