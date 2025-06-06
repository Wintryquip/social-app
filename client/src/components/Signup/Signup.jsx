import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
    const [data, setData] = useState({
        login: "",
        email: "",
        password: "",
        birthDate: new Date()
    })

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/user/register"
            const { data: res } = await axios.post(url, data)
            navigate("/login")
        } catch (error) {
            if (error.response &&
                error.response.status >= 400 &&
                error.response.status <=500
            ) {
                setError(error.response.data.message)
            }
        }
    }
    return (
        <div className="container-fluid vh-100" style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            paddingTop: "5rem"
        }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card border-0 shadow-lg" style={{
                        borderRadius: "15px",
                        overflow: "hidden"
                    }}>
                        <div className="card-header bg-primary text-white p-4" style={{
                            borderBottom: "none"
                        }}>
                            <h2 className="text-center mb-0">Join Our Community</h2>
                            <p className="text-center mb-0 opacity-75">Sign up to connect with friends</p>
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
                                        placeholder="Username"
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

                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control form-control-lg rounded-pill"
                                        placeholder="Email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            padding: "12px 20px",
                                            fontSize: "1rem"
                                        }}
                                    />
                                </div>

                                {/* Pole hasła z przyciskiem ujawniania */}
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

                                <div className="mb-4">
                                    <label className="form-label text-muted ms-3">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-lg rounded-pill"
                                        name="birthDate"
                                        value={data.birthDate}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            padding: "12px 20px",
                                            fontSize: "1rem"
                                        }}
                                    />
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
                                        Sign Up
                                    </button>
                                </div>

                                <div className="position-relative my-4">
                                    <hr />
                                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                                        Already have an account?
                                    </span>
                                </div>

                                <div className="d-grid">
                                    <Link
                                        to="/login"
                                        className="btn btn-outline-primary btn-lg rounded-pill fw-bold"
                                        style={{
                                            padding: "12px",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        Log In
                                    </Link>
                                </div>
                            </form>
                        </div>

                        <div className="card-footer bg-light text-center p-3">
                            <p className="small text-muted mb-0">
                                By signing up, you agree to our
                                <Link to="/terms" className="text-decoration-none ms-1">Terms</Link>,
                                <Link to="/privacy" className="text-decoration-none ms-1">Privacy Policy</Link> and
                                <Link to="/cookies" className="text-decoration-none ms-1">Cookie Policy</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup