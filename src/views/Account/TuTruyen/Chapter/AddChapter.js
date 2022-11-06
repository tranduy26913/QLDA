import React, { useEffect, useState } from 'react'
import apiMain from 'api/apiMain'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify'
import getData from 'api/getData'

const AddChapter = ({ url, chapnumber, onClickBackFromAddChap, getChapters }) => {
  const [content, setContent] = useState("")
  const [tenchuong, setTenchuong] = useState("")
  const [edit, setEdit] = useState(false)
  const [isLock, setIsLock] = useState(false)

  const onChangeTenchuong = (e) => {
    setTenchuong(e.target.value)
  }

  useEffect(() => {
    const GetChapter = async () => {
      if (chapnumber) {
        apiMain.getChapterByNumber(url, chapnumber)
          .then(res => {
            setContent(res.content)
            setTenchuong(res.chaptername)
            setEdit(true)
            setIsLock(res.isLock)
          })
      }
    }
    GetChapter()
  }, [url, chapnumber])

  const onClickAddChapter = async (e) => {
    const params = { content, tenchap: tenchuong, url,isLock }
    if (content.length <= 10) {
      toast.warning("Nội dung chương phải dài hơn 10 kí tự");
      return
    }
    apiMain.createChapter(params)
      .then(res => {
        getChapters()
        toast.success("Thêm chương thành công")
      })
      .catch(err => { toast.error(getData(err.response)?.details.message) })
  }

  const onClickEditChapter = async (e) => {
    const params = { content, tenchap: tenchuong, url, chapnumber ,isLock}
    if (content.length <= 10) {
      toast.warning("Nội dung chương phải dài hơn 10 kí tự");
      return
    }
    apiMain.updateChapter(params)
      .then(res => {
        getChapters()
        toast.success("Sửa truyện thành công")
      })
      .catch(err => { toast.error(getData(err.response)?.details.message) })
  }
  const labelStyle = { 'minWidth': '100px', 'margin': '5px 0px', 'display': 'inline-block' }
  return (<>
    <div>
      <span className='text-with-icon' onClick={onClickBackFromAddChap}><i className='bx bx-left-arrow'></i> Danh sách chương</span>
    </div>
    <div className="group-info" style={{ 'marginBottom': '10px' }}>
      <label htmlFor="" className='fs-16' style={labelStyle}>Tên chương</label>
      <input onChange={onChangeTenchuong} value={tenchuong || ""} />
    </div>
    <div  className='d-flex' style={{ 'marginBottom': '10px', gap:'6px'}}>
      <input  name='isLock' type='checkbox' checked={isLock} onChange={()=>setIsLock(pre=>!pre)} value={isLock} />
      <label htmlFor="isLock" className='fs-16' style={labelStyle}>Khoá chương (Tính phí 200coin)</label>
    </div>
    <label htmlFor="" className='fs-16' style={labelStyle}>Nội dung chương</label>
    <CKEditor
      editor={ClassicEditor}
      data={content || ''}
      onReady={editor => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        setContent(editor.getData())
      }}
      onBlur={(event, editor) => {
        console.log('Blur.', editor);
      }}
      onFocus={(event, editor) => {
        console.log('Focus.', editor);
      }}
    />
   

    <div className='d-flex'>
      {
        edit ? <button className='btn-primary' onClick={onClickEditChapter} style={{ 'margin': '20px auto' }}>Cập nhật chương</button>
          : <button className='btn-primary' onClick={onClickAddChapter} style={{ 'margin': '20px auto' }}>Thêm chương</button>}

    </div>
  </>)
}
export default AddChapter