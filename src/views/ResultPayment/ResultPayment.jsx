import "./Payment.style.scss";
import { useEffect } from "react";
import { getInfoWithBalance } from "api/apiPayment";
import React, { Fragment } from "react";
import Layout from "components/Layout/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingData from "components/LoadingData/LoadingData";
import { useDispatch, useSelector } from "react-redux";
import { updateBalance } from "redux/userSlice";
import { useState } from "react";

const ResultPayment = () => {
  const query = useSearchParams()[0]
  const user = useSelector(state => state.user.info)
  const [message,setMessage] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const getBalance = () => {
      if (query.get('resultCode')==='0') {
        getInfoWithBalance(user)
          .then(res => {
            dispatch(updateBalance(res.balance))
            navigate('/')
          })
      }
      else{
        setMessage(query.get('message'))
        setTimeout(()=>navigate('/'),3000)
      }
    }
    getBalance()
     // eslint-disable-next-line react-hooks/exhaustive-deps 
  },[])

  return (
    <Fragment>
      <Layout>
        <div className="main-content">
          <LoadingData />
          <h3>{message || "Đang cập nhật số dư. Vui lòng chờ trong giây lát"}</h3>
        </div>
      </Layout>
    </Fragment>
  );
};

export default ResultPayment;
