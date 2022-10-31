import React, { useCallback, useEffect, useState } from 'react'
import apiMain from 'api/apiMain'
import Grid from 'components/Grid/Grid'
import { toast } from 'react-toastify'
import AddChapter from './AddChapter'

const ListChap = ({ url,onClickBackFromListChap }) => {
    const [chapters, setChapters] = useState([])
    const [addChap, setAddChap] = useState(false)
    const [chapternumber, setChapternumber] = useState(null)
    
    const onClickUpdateChap = (value) => {
      setChapternumber(value)
      setAddChap(true)
    }
    const onClickDeleteChap = (value) => {
      if (value) {
        apiMain.deleteChapter({ url, chapnumber: value })
          .then(res => {
            getChapter()
            toast.success(res.message)
          })
          .catch(err => {
            console.log(err)
            toast.error(err.response.details.message)
          })
      }
    }
    

    const getChapter = useCallback(async () => {
      apiMain.getNameChapters(url, {size:20})
        .then(res => {
          setChapters(res)
        })},[url])

    
    useEffect(()=>{
      getChapter()
       // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])
  
    const onClickAddChapter = (e) => {
      e.preventDefault()
      setAddChap(true)
      setChapternumber(null)
    }
    return (
      <>{
        addChap ? <AddChapter url={url} chapnumber={chapternumber} 
         onClickBackFromAddChap={()=>{setAddChap(false)}}
         getChapters={getChapter} /> :
  
          <div>
            <div className='d-flex' style={{ 'justifyContent': 'space-between' }}>
              <span className='text-with-icon' onClick={onClickBackFromListChap}><i className='bx bx-left-arrow' ></i> Danh sách truyện</span>
              <span className='fs-20 fw-6'>Danh sách chương</span>
              <button className='btn-primary' style={{ 'margin': '0px 10px' }} onClick={onClickAddChapter}>Thêm chương</button>
            </div>
            <Grid gap={15} col={2} snCol={1}>
              {
                chapters.map((item, index) => {
                  return (
                    <div key={item.chapternumber}>
                    <div className='d-flex'>
                      <div className="col-10 d-flex" style={{'alignItems':'center'}}>
                        <h4 key={item.chapternumber} name={item.chapternumber} className='text-overflow-1-lines'>{item.chaptername}</h4>
                      </div>
                      <div className="col-2">
                        <span className="text-with-icon" onClick={()=>onClickUpdateChap(item.chapternumber)}><i className='bx bx-edit' ></i> Sửa</span>
                        <span className="text-with-icon" onClick={()=>onClickDeleteChap(item.chapternumber)} ><i className='bx bx-trash' ></i> Xoá</span>
                      </div>
                    </div><hr/></div>
                    )
                })
              }
            </Grid>
          </div>
      }
      </>
    )
  }

  export default ListChap