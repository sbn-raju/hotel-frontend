import React, { createContext, useEffect, useState } from 'react';
import { BASE_URI } from '../utils/BaseUrl.utils';
import { secureFetch } from '../helpers/secureFetch';


//Creating the auth context.
export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    //Firstly, setting the loading state,
    const [isLoading, setIsLoading] = useState(true);

    //Creating intial auth state.
    const [authState, setAuthState] = useState({
        id: null,
        user: null,
        name: null,
        role: null,
        profile: null,
        isAuthenticated: false,
    });


    //Creating the function to get the user.
    const getUser = async() => {
        //Calling the API for Login.
        try {
            const endpoint = '/auth/user';
            const options = {
                method: "GET",
                headers:{
                    'Content-Type':'application/json'
                }
            }
            const response = await secureFetch(endpoint, options);

            console.log(response);

            if(response.ok){
                const result = await response.json();

                setAuthState({
                    id: result?.data?.id,
                    user: result?.data?.email,
                    name: result?.data?.name,
                    role: result?.data?.role,
                    profile: result?.data?.profile,
                    isAuthenticated: true,
                })
                
                
            }else{
                setAuthState({
                    id: null,
                    user: null,
                    name: null,
                    role: null,
                    profile: null,
                    isAuthenticated: false,
                })
            }
        } catch (error) {
           console.log(error);
        }finally{
            setIsLoading(false);
        }
        
    }

    //On the window refresh or reload fetch the current user.
    useEffect(()=>{
        getUser();
    },[]);

    //Logging in the user.
    const login = async({email, password})=>{
        
        //Calling the API for Login.
        try {
            const response = await fetch(`${BASE_URI}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email, 
                    password
                })
            });

            if(response.ok){
                await getUser();
                const result = await response.json();
                return result;
            }else{
                const result = await response.json();
                return result;
            }
        } catch (error) {
            return error
        }finally{
            setIsLoading(false);
        }
         
    }

    //logging out the user.
    const logout = async()=>{

    }
 

    return (
        <AuthContext.Provider value={{isLoading, authState, getUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}


