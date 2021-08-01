import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import ReactQuill from 'react-quill'
import './TextEditor.styles.scss'

const TextEditor = (props) => {
  const [editorHtml, setEditorHtml] = useState(props?.initialValue || '')
  const [typingTimeout, setTypingTimeout] = useState(0)

  useEffect(() => {
    props.value && setEditorHtml(props.value)
  }, [props])

  const handleChange = (value) => {
    setEditorHtml(value)
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    setTypingTimeout(
      setTimeout(() => {
        props.handleChange && props.handleChange(value)
      }, 500),
    )
  }

  return (
    <ReactQuill
      value={editorHtml} 
      onChange={handleChange}
      modules={modules}
      formats={formats}
      // {...props}
      style={props.style}
    />
  )
}

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

export default TextEditor
