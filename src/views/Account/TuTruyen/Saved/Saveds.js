import  { useEffect, useState } from 'react'
import apiMain from 'api/apiMain'
import Saved from 'components/Saved/Saved'
import { useSelector } from 'react-redux'
const Saveds = () => {
    const [readings, setReadings] = useState([])
    const user = useSelector(state=>state.user.info)
    useEffect(()=>{
      const LoadReading = async () => {
        if (user) {
          apiMain.getSaveds()
            .then(res => {
              console.log(res)
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
          readings.map((item, i) => <div key={item.url} >
            <Saved data={{
              tentruyen: item.name,
              hinhanh: item.image,
              tacgia: item.author,
              url: item.url
            }} />
              <hr /></div>)
          
        }</div>)
  }
  export default Saveds