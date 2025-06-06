import { Route, Routes, Navigate} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from "./components/layouts/Navbar"
import Signup from "./components/Signup/Signup"
import Login from "./components/Login/Login"
import Main from "./components/Main/Main"
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import Footer from "./components/layouts/Footer";
import Terms from "./components/pages/Terms";
import Cookies from "./components/pages/Cookies";
import Privacy from "./components/pages/Privacy"
import NotFound from "./components/pages/NotFound"

function App() {
    const { user } = useContext(UserContext);

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
                {/* Default routes */}
                <Route path="/" element={<Main />} />
                <Route path ="/terms" exact element ={<Terms/>}/>
                <Route path="/privacy" exact element ={<Privacy/>}/>
                <Route path="/cookies" exact element ={<Cookies/>}/>
                <Route path="*" exact element={<NotFound/>}/>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
