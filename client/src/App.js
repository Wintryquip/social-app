import { Route, Routes, Navigate} from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "./contexts/UserContext"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import Navbar from "./components/layouts/Navbar"
import Footer from "./components/layouts/Footer"
import Signup from "./components/account/Signup"
import Login from "./components/account/Login"
import SearchUsers from "./components/account/SearchUsers"
import UserProfile from "./components/account/UserProfile"
import EditUser from "./components/account/EditUser"
import Main from "./components/main/Main"
import Terms from "./components/pages/Terms"
import Cookies from "./components/pages/Cookies"
import Privacy from "./components/pages/Privacy"
import NotFound from "./components/pages/NotFound"

function App() {
    const { user } = useContext(UserContext)

    return (
        <>
            <Navbar />
            <Routes>
                {/* If user logged in, redirect to main */}
                <Route
                    path="/register"
                    element={user ? <Navigate to="/" /> : <Signup />}
                />
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" /> : <Login />}
                />
                {/* Redirect to main if user not logged in */}
                <Route
                    path="/edit-profile"
                    exact
                    element={
                        user ? (
                            <EditUser />
                        ) : (
                            <Navigate to="/login" state={{ from: '/edit-profile' }} />
                        )
                    }
                />
                {/* Default routes */}
                <Route path="/" element={<Main />} />
                <Route path="/search/:login" exact element={<SearchUsers />} />
                <Route path="/profile/:login" exact element={<UserProfile />} />
                <Route path ="/terms" exact element ={<Terms/>}/>
                <Route path="/privacy" exact element ={<Privacy/>}/>
                <Route path="/cookies" exact element ={<Cookies/>}/>
                <Route path="*" exact element={<NotFound/>}/>
            </Routes>
            <Footer />
        </>
    )
}

export default App
