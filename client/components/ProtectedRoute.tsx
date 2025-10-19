import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) =>{
    const isAuth = localStorage.getItem("isAuth");

    if(!isAuth || isAuth!=="true"){
        return <Navigate to={"/login"} replace />
    }

    return children
}

export default ProtectedRoute