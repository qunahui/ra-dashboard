import React, { useEffect, useState, } from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import clsx from 'clsx'
import './ImagePicker.styles.scss'

export const ImagePicker = ({ render: Render,...otherProps}) => {
  const { defaultFileList } = otherProps;
  const [ chosenFile, setChosenFile] = useState(null);

  const onChooseImage = (url) => {
    if(url === chosenFile) {
      setChosenFile(null)
    } else if (url !== chosenFile) {
      setChosenFile(url)
    }
  }

  //<---------------------------------------------- Uploader modal handler --------------------------->
    const [isModalVisible, setIsModalVisible] = useState(false);  
    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = () => {
      setIsModalVisible(false);
      otherProps.onOk(chosenFile)
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };
  //<---------------------------------------------- Uploader modal handler --------------------------->
  
  //<---------------------------------------------- dynamic tag name -------------------------------->
  //<---------------------------------------------- dynamic tag name -------------------------------->

  return (
    <>
      <Render onClick={showModal}>
        {otherProps.label}
      </Render>
      <Modal title={otherProps.label} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div>
          {
            defaultFileList && defaultFileList.map(file => (
              <div className={clsx("image-item",(file.url === chosenFile && "image-chosen"))} key={file.key} onClick={(e) => onChooseImage(file.url)}>
                <img src={file.url}/>
              </div>
            ))
          }
        </div>
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagePicker)
