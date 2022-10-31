
import  { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import apiMain from 'api/apiMain'
import Reading from 'components/Reading/Reading'
import StoryCreated from './Story/StoryCreated'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import Saveds from './Saved/Saveds'
const nav = [
  {
    path: 'reading',
    display: 'Đang đọc'
  },
  {
    path: 'saved',
    display: 'Đánh dấu'
  },
  {
    path: 'created',
    display: 'Đã đăng'
  },
]
function TuTruyen() {

  const location = useLocation()
  const active = nav.findIndex(e => e.path === location.pathname.split('/').pop())
  
  return (
    <>
      <div className='navigate'>
        {
          nav.map((item, index) => {
            return <Link key={item.path} to={item.path} className={`navigate__tab fs-18 fw-6 ${active === index ? 'tab_active' : ''}`}
              name={item.path}
            >{item.display}</Link>
          })
        }
      </div>
      <Routes>
        <Route key={'reading'} path='reading' element={<Readings key={'reading'}/>} />
        <Route key={'saved'} path='saved' element={<Saveds key={'saved'} />} />
        <Route key={'created'} path='created' element={<StoryCreated key={'created'}/>} />
      </Routes>


    </>
  )
}
const Readings = () => {
  const [readings, setReadings] = useState([])
  const user = useSelector(state=>state.user.info)
  useEffect(()=>{
    const LoadReading = async () => {
      if (user) {
        apiMain.getReadings()
          .then(res => {
            setReadings(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
    LoadReading()
  }, [user])

  return (
    <div>
      {
        readings.map((item, i) => <div key={i} >
          <Reading  data={{
            tentruyen: item.name,
            hinhanh: item.image,
            dadoc: item.chapternumber,
            total: item.sochap,
            url: item.url
          }} />
            <hr /></div>)
        
      }</div>)
}



export default TuTruyen