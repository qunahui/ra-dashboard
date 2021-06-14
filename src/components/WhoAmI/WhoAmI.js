import React, { useEffect, useState } from 'react'
import UserCreators from 'Redux/user'
import { connect } from 'react-redux'
import _ from 'lodash'
import { request } from 'Config/axios'
import { Badge, Dropdown, Card, Avatar, Button } from 'antd'
import toast from 'Helpers/ShowToast'

const { Meta } = Card 

export const WhoAmI = (props) => {
    const [pendingRequest, setPendingRequest] = useState([])

    useEffect(() => {
        const { user } = props.auth
        if(!_.isEqual(pendingRequest, user?.pendingRequest) && !props.auth.isGettingUser) {
            setPendingRequest(user?.pendingRequest)
        }
    }, [props])

    useEffect(() => {
        // console.log("start")
        // setInterval(function(){
        //     props.getWhoAmIStart()
        // }, 5000);
    }, [])

    const handleReject = async (values) => {
        try {
            const result = await request.post('/employees/response', {
                ...values,
                message: 'reject'
            })
            
            if(result.code === 200) {
                toast({ type: 'success', message: 'Từ chối lời mời thành công !'})
                setPendingRequest(pendingRequest.filter(i => i.storageId !== values.storageId))
            }
        } catch(e) {
            toast({ type: 'error', message: e.message})
        }
    }

    const handleResolve = async (values) => {
        try {
            const result = await request.post('/employees/response', {
                ...values,
                message: 'resolve'
            })
            
            if(result.code === 200) {
                toast({ type: 'success', message: 'Chấp nhận lời mời thành công !'})
                setPendingRequest(pendingRequest.filter(i => i.storageId !== values.storageId))
            }
        } catch(e) {
            toast({ type: 'error', message: e.message})
        }
    }

    const menu = <>
        { pendingRequest?.length > 0 && pendingRequest.map(i => (
            <Card
                actions={[
                    <Button style={{ width: '90%', height: '90%'}} onClick={() => handleReject(i)}>Từ chối</Button>,
                    <Button type={"primary"} style={{ width: '90%', height: '90%'}}  onClick={() => handleResolve(i)}>Chấp nhận</Button>
                ]}
                style={{ margin: '8px 0px'}}
            >
                <Meta
                    avatar={<Avatar src={"/assets/deal.png"} />}
                    title={"Lời mời cộng tác"}
                    description={`${i?.displayName} gửi lời mời cộng tác với bạn`}
                />
            </Card>
        ))}
    </>

    return pendingRequest?.length > 0 && (
        <div 
            style={{ position: 'fixed', bottom: 10, right: 20, background: 'white', padding: 8, borderRadius: 50, border: '1px solid #ddd', cursor: 'pointer' }}
        >
            <Dropdown
                trigger={['click']}
                overlay={menu}
                placement={"topRight"}
                arrow
            >
                <Badge count={pendingRequest?.length}>
                    <img src={'/assets/request.png'} style={{ width: 40, height: 40 }}/>
                </Badge>
            </Dropdown>
        </div>
    )
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),  
})

const mapDispatchToProps = dispatch => ({
    getWhoAmIStart: () => dispatch(UserCreators.getWhoAmIStart())
})
export default connect(mapStateToProps, mapDispatchToProps)(WhoAmI)
