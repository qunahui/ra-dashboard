import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { request } from 'Config/axios'
import NProgress from 'nprogress'
import toast from 'Helpers/ShowToast'

export const SingleSupplierView = (props) => {
  const [supplier, setSupplier] = useState({})
  async function fetchSupplier() {
    NProgress.start()
    try {
      const _id = props.match.params.id 

      const response = await request.get(`/supplier/${_id}`)

      if(response.code === 200) {
        setSupplier(response.data)
      }

    } catch(e) {
      toast({ type: 'error', message: 'Lấy thông tin nhà cung cấp thất bại !'})
    } finally {
      NProgress.done()
    }
  }

  useEffect(() => {
    fetchSupplier()
  }, [])

  return (
    <div>
      {JSON.stringify(supplier, null, 2)}
    </div>
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleSupplierView)
