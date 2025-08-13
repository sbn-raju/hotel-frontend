import React from 'react'
import useAuth from '../hooks/AuthHooks'
import { Navigate } from 'react-router-dom';
import Loader from '../components/loaders/Loader';

const PrivateRoute = ({children}) => {

    //Importing the authState of the user and the loading from the authcontext.
    const { authState, isLoading } = useAuth();

    console.log(authState)

    //If Loading is going then load the Loader.
    if(isLoading){
        return <Loader/>
    }

    //Redirect to navigation page when not authenticated.
    if(!authState?.isAuthenticated){
        return <Navigate to="/login" />;
    }

    //Render the childer when it is needed.
    return children
}

export default ProtectedRoute