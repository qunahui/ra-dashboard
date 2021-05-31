import React, { useState, useEffect, useReducer, Fragment } from 'react'
import { connect } from 'react-redux'
import { Upload } from 'antd'
import firebase from 'Utils/firebase'

export const ImageUpload = (props) => {
  const [type, setType] = useState(props.type || "normal")

  //<-------------------------------------------image handler----------------------------------------->

  const [uploaderState, setUploaderState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: props.fileList || [],
      imageUrlList: props.avatar || [],
    }
  )

  const { previewVisible, previewImage, fileList, imageUrlList, previewTitle } = uploaderState;

  const handleImagePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setUploaderState({
      ...uploaderState,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handleImageCancel = () => setUploaderState({ previewVisible: false });

  const handleImageChange = ({ file, fileList }) => {
    const newList = [...fileList].map(i => ({ ...i, url: i.xhr?.url }))
    setUploaderState({ fileList: newList })
    props.handleChange(newList)
  };

  const handleImageRemove = (file) => {
    const removeIndex = fileList.findIndex(i => i.name === file.name);
    const removedArr = fileList.splice(removeIndex, 1)
    const newList = fileList.filter(item => !removedArr.includes(item))
    setUploaderState({ 
      fileList: newList,
    })

    props.handleChange(newList)
  }

  const handleImageUpload = async ({ onSuccess, file, onError }) => {
    const storage = firebase.storage()
    const metadata = {
      contentType: 'image/jpeg'
    }

    const storageRef = storage.ref()
    const imgFile = storageRef.child(`${props.auth.user._id}/${Date.now() + '_' + file.name}`);
    try {
      let imageUrl = '';
      const image = await imgFile.put(file, metadata);
      await imgFile.getDownloadURL().then(url => {
        imageUrl = url
      })
      onSuccess(null, {...image, url: imageUrl});
    } catch(e) {
      onError(e);
    }
  }

  // useEffect(() => {
  //   console.log("uploader changed: ", uploaderState)
  // }, [uploaderState])

  //<----------------------------------------image handler-------------------------------------->
  

  const uploadType = () => {
    const { children, ...restProps } = props;
    if(type === "normal") {
      return <Upload
        {...restProps}
        listType="picture-card"
        fileList={fileList}
        onPreview={handleImagePreview}
        onChange={handleImageChange}
        onRemove={handleImageRemove}
        customRequest={handleImageUpload}
        multiple
      >
        {children}
      </Upload>
    } else if(type === "drag") {
      const { Dragger } = Upload
      return <Dragger
        {...restProps}
        fileList={fileList}
        onPreview={handleImagePreview}
        onChange={handleImageChange}
        onRemove={handleImageRemove}
        customRequest={handleImageUpload}
        multiple={!!props.multiple}
        maxCount={props.maxCount || 99}
        multiple={!props.maxCount === 1 || !props.maxCount}
      >
        {children}
      </Dragger>
    }
  }

  return (
    <>
      {uploadType()}
    </>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ImageUpload))
