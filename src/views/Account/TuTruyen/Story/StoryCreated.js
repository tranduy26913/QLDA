import { useState,useEffect ,useCallback} from "react"
import { useSelector, useDispatch} from "react-redux"
import { toast } from "react-toastify"
import apiMain from "api/apiMain"
import getData from "api/getData"
import ListChap from "../Chapter/ListChap"
import EditStory from "./EditStory"


const StoryCreated = () => {
    const [storys, setStorys] = useState([])
    const [listChap, setListChap] = useState(false)
    const [editNovel, setEditNovel] = useState(false)
    const user = useSelector(state => state.user.info)
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')

    useEffect(() => {
      getStories()
       // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [user])
  
    const getStories = async()=>{
      apiMain.getStorysByUsername({ id: user?.id })
      .then(res => {
        setStorys(res)
        
      })
      .catch(err => {
        console.log(err)
      }
      )
    }
  
    const onClickUpdateStory = (e) => {
      setEditNovel(true)
      setUrl(e.target.getAttribute('data-url'))
    }
    const onClickDeleteStory = (value) => {
      if(value) {
        apiMain.deleteStory({url: value })
          .then(res => {
            getStories()
            toast.success(res.message)
          })
          .catch(err => {
            toast.error(getData(err.response)?.details.message)
          })
      }
    }
  
    const onClickBackFromListChap = useCallback(()=>{
      setListChap(false)
      setEditNovel(false)
    },[])
  
    const onClickTruyen = (e) => {
      console.log(e.target.getAttribute("data-url"))
      setUrl(e.target.getAttribute("data-url"))
      setListChap(true)
    }
    const onClickBackFromEditNovel = useCallback(()=>{
      setEditNovel(false)
    },[])
    return (<>
      {listChap ? <ListChap onClickBackFromListChap={onClickBackFromListChap} url={url}  user={user}/> :
        editNovel ? <EditStory url={url} user={user} dispatch={dispatch} onClickBackFromEditNovel={onClickBackFromEditNovel} /> :
          storys.map(data => {
            return (<div key={data.url}>
              <div  className="reading-card">
                <div className="reading-card__img-wrap">
                  <img src={data.image} alt="" />
                </div>
                <div className="reading-card__content">
                  <h4 onClick={onClickTruyen} data-url={data?.url} className="reading-card__title">
                    {data.name}
                  </h4>
                  <div className="d-flex" style={{'gap':'15px'}}>
                    <span className="text-with-icon" onClick={onClickUpdateStory} data-url={data.url}><i className='bx bx-edit' ></i> Sửa</span>
                    <span className="text-with-icon" onClick={()=>onClickDeleteStory(data.url)} ><i className='bx bx-trash' ></i> Xoá</span>
  
                  </div>
                </div>
                
              </div><hr/></div>
            )
          })
      }
    </>
    )
  }

  export default StoryCreated;