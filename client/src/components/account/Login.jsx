import {useContext, useState} from "react"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"

const Login = () => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const port = process.env.REACT_APP_API_PORT;
    const [data, setData] = useState({
        login: "",
        password: ""
    })
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const handleChange = ({ currentTarget: input }) => {
        setData({...data, [input.name]: input.value})
    }

    const { login } = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(prev => !prev);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${baseUrl}:${port}/user/login`
            const { data: res } = await axios.post(url, data, {
                withCredentials: true
            })
            login(res.data)
            navigate("/")
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            } else {
                setError("Unexpected error occurred.")
            }
        }
    }

    return (
        <div className="container-fluid vh-100" style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            paddingTop: "5rem"
        }}>
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card border-0 shadow-lg" style={{
                        borderRadius: "15px",
                        overflow: "hidden"
                    }}>
                        <div className="card-header bg-primary text-white p-4" style={{
                            borderBottom: "none"
                        }}>
                            <h2 className="text-center mb-0">Welcome Back!</h2>
                            <p className="text-center mb-0 opacity-75">Connect with your community</p>
                        </div>

                        <div className="card-body p-4">
                            {error && (
                                <div className="alert alert-danger rounded-pill text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg rounded-pill"
                                        placeholder="Login"
                                        name="login"
                                        value={data.login}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            padding: "12px 20px",
                                            fontSize: "1rem"
                                        }}
                                    />
                                </div>

                                {/* Show password button */}
                                <div className="mb-3 position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control form-control-lg rounded-pill"
                                        placeholder="Password"
                                        name="password"
                                        value={data.password}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            padding: "12px 20px",
                                            fontSize: "1rem"
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-3"
                                        style={{
                                            borderRadius: "50%",
                                            width: "2.5rem",
                                            height: "2.5rem",
                                            padding: 0,
                                            fontSize: "1.2rem",
                                            lineHeight: 1,
                                            userSelect: "none",
                                            border: "none"
                                        }}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                <div className="d-grid mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg rounded-pill fw-bold"
                                        style={{
                                            padding: "12px",
                                            fontSize: "1rem",
                                            letterSpacing: "0.5px"
                                        }}
                                    >
                                        Log In
                                    </button>
                                </div>

                                {/*
                                Work in progress
                                <div className="text-center mb-3">
                                    <Link
                                        to="/forgot-password"
                                        className="text-decoration-none text-muted small"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                */}

                                <div className="position-relative my-4">
                                    <hr />
                                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                                        OR
                                    </span>
                                </div>

                                <div className="d-grid mb-4">
                                    <Link
                                        to="/register"
                                        className="btn btn-outline-primary btn-lg rounded-pill fw-bold"
                                        style={{
                                            padding: "12px",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        Create New Account
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login