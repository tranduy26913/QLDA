import Loading from '../Loading/Loading'
import { useState, useReducer } from 'react'
import apiMain from '../../api/apiMain';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { handleRegister } from '../../handle/handleAuth';
import { useNavigate } from 'react-router-dom';

function Register(props) {
    const loading = useSelector(state => state.message.loading)
    const [emailRegister, setEmailRegister] = useState("");
    const [usernameRegister, setUsernameRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const [passwordCfRegister, setPasswordCfRegister] = useState("");

    const msgRegister = useSelector(state => state.message.register?.msg)

const dispatch = useDispatch()
const navigate = useNavigate()
    const [message, dispatchReg] = useReducer(registerReducer, initialValidate);

    const onRegister = async (e) => {//Xử lý gọi API Sign up
        e.preventDefault();
        if (!message.email.valid || !message.username.valid || !message.password.valid || !message.passwordcf.valid) {
            toast.warning("Vui lòng điền các thông tin phù hợp")
            return
        }
        const user = {//payload
            username: usernameRegister,
            password: passwordRegister,
            email: emailRegister
        };
        await handleRegister(user, dispatch, navigate); //gọi hàm sign up
    }

    const onChangeEmail = debounce(async (e) => {//validate email
        let email = e.target.value
        setEmailRegister(email)
        const payload = await validateEmail(email)
        dispatchReg({ type: "EMAIL", payload: payload })
    }, 500)

    const onChangeUsername = debounce(async (e) => {//validate username
        let username = e.target.value
        setUsernameRegister(username)
        console.log(username)
        dispatchReg({ type: "USERNAME", payload: await validateUsername(username) })
    }, 500)

    const onChangePassword = (e) => {//validate password
        let password = e.target.value
        setPasswordRegister(password)
        dispatchReg({ type: "PASSWORD", payload: validatePassword(password) })
        dispatchReg({ type: "PASSWORDCONFIRM", payload: validatePasswordCf(password,passwordCfRegister) })
    }

    const onChangePasswordCf = (e) => {//validate password confirm
        let passwordcf = e.target.value
        setPasswordCfRegister(passwordcf)
        dispatchReg({ type: "PASSWORD", payload: validatePassword(passwordRegister) })
        dispatchReg({ type: "PASSWORDCONFIRM", payload: validatePasswordCf(passwordRegister,passwordcf) })
    }

    return (
        <div className="form-wrap">
            <form>
                <div className="form-group d-flex">
                    <label>Email</label>
                    <div className="field-wrap">
                        <input placeholder="example@gmail.com" required name="emailRegister" type="text"
                            onChange={onChangeEmail}
                        />
                    </div>
                    <span className={`${message.email.valid ? 'success' : 'error'}`}>{message.email.message}</span>

                </div>
                <div className="form-group d-flex">
                    <label>Tên đăng nhập</label>
                    <div className="field-wrap">
                        <input required name="usernameRegister" type="text"
                            onChange={onChangeUsername} />
                    </div>
                    <span className={`${message.username.valid ? 'success' : 'error'}`}>{message.username.message}</span>

                </div>
                <div className="form-group d-flex">
                    <label>Mật khẩu</label>
                    <div className="field-wrap">
                        <input required={true} name={"passwordRegister"} type='password'
                            onChange={onChangePassword}
                        />
                    </div>
                    <span className={`${message.password.valid ? 'success' : 'error'}`}>{message.password.message}</span>

                </div>
                <div className="form-group d-flex">
                    <label>Nhập lại mật khẩu</label>
                    <div className="field-wrap">
                        <input required={true} name={"passwordCfRegister"} type='password' value={passwordCfRegister}
                            onChange={onChangePasswordCf}
                        />
                    </div>
                    <span className={`${message.passwordcf.valid ? 'success' : 'error'}`}>{message.passwordcf.message}</span>
                </div>
                <span>{msgRegister}</span>
                <button onClick={onRegister}>{loading ? <Loading /> : ""}Đăng ký</button>

            </form>
        </div>
    )
}

const initialValidate = {
    email: {
        valid: false,
        message: ""
    },
    username: {
        valid: false,
        message: ""
    },
    password: {
        valid: false,
        message: ""
    },
    passwordcf: {
        valid: false,
        message: ""
    }
}

const registerReducer = (state, action) => {
    switch (action.type) {
        case "EMAIL": {
            let newState = { ...state }
            console.log(newState)
            newState.email = action.payload
            return newState
        }
        case "USERNAME": {
            let newState = { ...state }
            newState.username = action.payload
            return newState
        }
        case "PASSWORD": {
            let newState = { ...state }
            newState.password = action.payload
            return newState
        }
        case "PASSWORDCONFIRM": {
            let newState = { ...state }
            newState.passwordcf = action.payload
            return newState
        }
    }
}

const validateEmail = async (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ///regex validate email
    if (regex.test(email)) {
        try {
            const res = await apiMain.checkEmail({ email })

            if (res.valid) {
                console.log(true)
                return { valid: true, message: "Email hợp lệ" }
            }
            else {
                return { valid: false, message: "Email đã tồn tại trên hệ thống" }
            }
        } catch (error) {
            return { valid: false, message: "Lỗi hệ thống" }
        }
    }
    else {
        return { valid: false, message: "Email không hợp lệ" }
    }
}

const validateUsername = async (username) => {
    if (username.length > 5) {
        try {
            const res = await apiMain.checkUsername({ username })

            if (res.valid) {
                return { valid: true, message: "Tên đăng nhập hợp lệ" }
            }
            else {
                return { valid: false, message: "Tên đăng nhập đã tồn tại trên hệ thống" }
            }
        }
        catch {
            return { valid: false, message: "Lỗi hệ thống" }
        }
    }
    else {
        return { valid: false, message: "Tên đăng nhập phải dài hơi 5 ký tự" }
    }
}

const validatePassword = (password) => {

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");//regex kiểm tra mật khẩu hợp lệ
    if (strongRegex.test(password)) {
        return { valid: true, message: "Mật khẩu hợp lệ" }
    }
    else
        return { valid: false, message: "Mật khẩu phải có ít nhất 8 kí tự. Chứa kí tự thường, kí tự hoa và số" }
}

const validatePasswordCf = (password, passwordcf) => {
    if (password === passwordcf) {
        return { valid: true, message: "Mật khẩu xác nhận trùng khớp" }
    }
    else
        return { valid: false, message: "Mật khẩu xác nhận không trùng khớp" }
}

function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this,
            args = arguments;

        var executeFunction = function () {
            func.apply(context, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(executeFunction, wait);
    };
};

export default Register