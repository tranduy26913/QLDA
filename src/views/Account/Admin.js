
import {  Route, Routes } from 'react-router-dom';
import ChangePassword from './ChangePassword'
import Profile from './Profile';
import Users from './Users'
import TuTruyen from './TuTruyen/TuTruyen';
import CreateNovel from './CreateNovel';
import './Account.scss'
import './Profile.scss'
import Panel from './Panel';
const menu = [
  {
    path: 'admin/profile',
    display: 'Hồ sơ',
    icon: 'bx bx-user'
  },
  {
    path: 'admin/change-password',
    display: 'Đổi mật khẩu',
    icon: 'bx bxs-key'
  },
  {
    path: 'admin/users',
    display: 'Người dùng',
    icon: 'bx bx-group'
  },
  {
    path: 'admin/tu-truyen/reading',
    display: 'Tủ truyện',
    icon: 'bx bx-library'
  },
  {
    path: "admin/add-user",
    display: "Thêm thành viên",
    icon: "bx bx-user-plus"
  },

  {
    path: "admin/dang-truyen",
    display: "Đăng truyện",
    icon: "bx bx-up-arrow-circle"
  },
]
function Account() {

  return (
    <Panel menu={menu}>
      <Routes>
        <Route path='profile' element={<Profile/>}></Route>
        <Route path='change-password' element={<ChangePassword />}></Route>
        <Route path='users' element={<Users />}></Route>
        <Route path='tu-truyen/*' element={<TuTruyen />}></Route>
        <Route path='dang-truyen' element={<CreateNovel  />}></Route>
      </Routes>
    </Panel>

  )
}


export default Account