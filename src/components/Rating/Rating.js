import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import apiMain from '../../api/apiMain';
import avt from '../../assets/img/avt.png'
import { loginSuccess } from '../../redux/authSlice';
import moment from 'moment';

function Rating(props) {
    const [count, setCount] = useState(0);
    const [rating, setRating] = useState(0);
    const user = useSelector(state => state.user.info)
    const [comments, setComments] = useState([])
    const [content, setContent] = useState("")
    const url = props.url
    const dispatch = useDispatch()

    const handleHoverStar = (star) => {
        setRating(star)
    }


    const onClickCreateComment = async (e) => { //xử lý đăng bình luận mới
        if (user) {
            if(rating===0 || !content){
                toast.warning('Vui lòng nhập nội dung đánh giá')
                return
            }
            const params = { url: url, content, rating }//payload
            apiMain.createRating(params)//gọi API đăng comment
                .then(res => {
                    loadComment()
                    setContent("")
                    setCount(pre => pre + 1)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            toast.warning("Vui lòng đăng nhập trước khi bình luận", {
                hideProgressBar: true,
                pauseOnHover: false,
                autoClose: 1200
            })
        }
    }

    const getComments = async () => {//hàm gọi data comments
        try {
            const res = await apiMain.getRatingsByUrl(url, { size: 20 })
            if (res)
                return res
            return []
        } catch (error) {
            return []
        }
    }
    const loadComment = async () => {
        const data = await getComments()
        setCount(data?.length || 0)
        setComments(data)
    }
    useEffect(() => {//load comment khi component đc render

        loadComment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onClickDeleteComment = async (e) => {//xử lý xoá comment
        if (user) {//Nếu đã đăng nhập thì mới đc phép xoá
            console.log(e.target.id)
            apiMain.deleteRating({ id: e.target.id })
                .then(async (res) => {
                    toast.success(res.message, { hideProgressBar: true, pauseOnHover: false, autoClose: 1000 })
                    const data = await getComments()
                    setComments(data)
                    setCount(pre => pre - 1)
                })
                .catch(err => {
                    toast.error(err.response.data.detail.message, { hideProgressBar: true, pauseOnHover: false, autoClose: 1000 })
                }
                )
        }
    }

    return (
        <div className="comment__wrap">
            {/* <h1>Đánh giá {count || 0}</h1> */}
            <div className="heroSide__main__rate" style={{ marginBottom: '8px' }}>
                <div style={{ marginLeft: '58px',cursor:'pointer' }} className="heroSide__main__rate-wrap fs-22 d-flex">
                    Đánh giá của bạn
                    <span style={{ marginLeft: '8px' }} onMouseMove={() => handleHoverStar(1)}
                        className={`bx ${rating >= 1 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(2)} className={`bx ${rating >= 2 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(3)} className={`bx ${rating >= 3 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(4)} className={`bx ${rating >= 4 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(5)} className={`bx ${rating >= 5 ? 'bxs-star' : 'bx-star'}`}></span>
                </div>
            </div>
            <div className="comment__form d-flex w100">

                <div className="avatar--45 mr-1">
                    <img src={user?.image || avt} alt="" />
                </div>
                <div className="comment__input">
                    <textarea placeholder='Nội dung đánh giá'
                        style={{ 'height': '100%', 'padding': '5px 20px 5px 10px' }} className='fs-15 fw-5' value={content} onChange={e => { setContent(e.target.value) }}></textarea>
                    <div className='d-flex comment__icon' ><span onClick={onClickCreateComment} className=" fs-20 "><i className='bx bxs-send' ></i></span></div>
                </div>


            </div>
            <hr />
            <div>
                {
                    comments.map((item, index) => {
                        return (
                            <div style={{ marginTop: '8px' }} key={item.id} >
                                <div className="heroSide__main__rate" style={{ marginBottom: '8px' }}>
                                    <div style={{ marginLeft: '58px',cursor:'pointer' }} className="heroSide__main__rate-wrap fs-22 d-flex">

                                        <span
                                            className={`bx ${item.rating >= 1 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 2 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 3 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 4 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 5 ? 'bxs-star' : 'bx-star'}`}></span>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className="comment__avatar ">
                                        <div className="avatar--45 mr-1">
                                            <img src={item.image || avt} alt="" />
                                        </div>
                                    </div>
                                    <div className="comment__body">
                                        <div className="comment__author__info">
                                            <h4>{item.nickname}</h4>
                                            <span className='fs-12 fw-4 text-secondary'>
                                                {

                                                    moment(item.createdAt).fromNow()
                                                }
                                            </span>
                                        </div>
                                        <div className="comment__content mb-1">
                                            {item.content}
                                        </div>
                                        <ul className="comment__nav">
                                            {item.username === user?.username ?
                                                <li id={item.id} onClick={onClickDeleteComment} className='fs-14 text-secondary'><i className='bx bxs-trash-alt'></i> Xoá</li> : ''
                                            }
                                            {/* <li className='fs-14 text-secondary'><i className="bx bx-reply"></i> Trả lời</li> */}
                                            <li className='fs-14 text-secondary'><i className='bx bxs-flag-alt' ></i> Báo xấu</li>

                                        </ul>

                                    </div>
                                </div>
                                <hr />
                            </div>)
                    })
                }
            </div>
        </div>
    )
}

moment.updateLocale('en', {
    relativeTime: {
        future: "trong %s",
        past: "%s trước",
        s: 'vài giây',
        ss: '%d giây',
        m: "1 phút",
        mm: "%d phút",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d ngày",
        w: "1 tuần",
        ww: "%d tuần",
        M: "1 tháng",
        MM: "%d tháng",
        y: "1 năm",
        yy: "%d năm"
    }
});
export default Rating