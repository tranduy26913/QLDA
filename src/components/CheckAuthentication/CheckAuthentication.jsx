import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logoutSuccess } from 'redux/authSlice'
import { toast } from 'react-toastify'
import jwt_decode from 'jwt-decode'
import { clearUserInfo, setUserInfo } from 'redux/userSlice'
import { useState } from 'react'
import LoadingData from 'components/LoadingData/LoadingData'
import apiMain from 'api/apiMain'

const privatePath = [
    '/user/', '/admin/', '/payment'
]

function CheckAuthentication(props) {
    const user = useSelector(state => state.user.info)
    const refreshToken = useSelector(state => state.auth.refreshToken)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    useEffect(() => {
        const check = () => {
            const isPrivate = privatePath.findIndex(e => location.pathname.includes(e)) >= 0 ? true : false
            if(isPrivate){
                setLoading(true)
            }
            if (refreshToken) {
                const tokenDecode = jwt_decode(refreshToken)
                let date = new Date();
                if (tokenDecode.exp < date.getTime() / 1000) {
                    toast.warning("Phiên làm việc của bạn đã hết. Vui lòng đăng nhập lại")
                    dispatch(logoutSuccess())
                    if (isPrivate)
                        navigate('/')
                }
                if (!user) {
                    apiMain.getUserInfo()
                        .then(res => {
                            console.log(res);
                            dispatch(setUserInfo(res.data.userInfo))
                        })
                        .finally(()=>setLoading(false))
                    // dispatch(logoutSuccess())
                    // 
                    // if (isPrivate)
                    //     navigate('/')
                }
                else{
                    setLoading(false)
                }
            }
            else {
                setLoading(false)
                dispatch(clearUserInfo())
                if (isPrivate) {
                    //toast.warning("Bạn không có quyền truy cập. Vui lòng đăng nhập lại")
                    navigate('/')
                }
            }
        }
        check()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshToken])
    return (
        <>
        {
            loading?<>
             <LoadingData />
            {/* <Typography>Đang lấy thông tin người dùng. Vui lòng đợi</Typography> */}
            </>
            :props.children
        }
        </>
    )
}

export default CheckAuthentication