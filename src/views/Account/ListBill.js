import React, {  useEffect, useState } from 'react'
import apiMain from '../../api/apiMain'
import {numWithCommas} from 'utils/convertNumber'

function ListBill() {
  const [listBill, setListBill] = useState([])
  const [username,setUsername] = useState("")

  useEffect(() => {
    const loadUsers = async()=>{
      apiMain.getBillByUser()
      .then(res=>{
        console.log(res)
        setListBill(res)
      })
      .catch(err=>{
        console.log(err)
      })
    }
    loadUsers(); 
     // eslint-disable-next-line react-hooks/exhaustive-deps   
  }, [])

  return (
    <>
      <h1>Lịch sử thanh toán</h1>

      <table className='user-table' style={{ "width": "90%" }}>
        <thead>
        <tr>
          <th>Số TT</th>
          <th>Nội dung</th>
          <th>Số tiền</th>
          <th>Trạng thái</th>
          <th>Phương thức</th>
          <th>Thời gian</th>
        </tr></thead>
        <tbody>
          {
            listBill.map((item, index) => {
              return <>
                {
                  
                <tr key={item.id}>
                  <td>{index+1}</td>
                  <td>{item.description}</td>
                  <td>{numWithCommas(item.amount)} đ</td>
                  <td>{item.status}</td>
                  <td>{item.method}</td>
                 <td>{new Date(item.updatedAt).toLocaleString()}</td>
                </tr>
                }
              </>
            })
          }
        </tbody>
      </table>

    </>

  )
}

export default ListBill