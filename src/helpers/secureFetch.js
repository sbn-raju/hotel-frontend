import { BASE_URI } from "../utils/BaseUrl.utils";
import { useNavigate } from "react-router-dom";

export async function secureFetch(endpoint, options = {}){

    //Calling the reall endpoint.
    let result;

    try {

        //This is the Original fetch request. 
        result = await fetch(`${BASE_URI}${endpoint}`, {
            ...options,
            credentials: "include",
        });

        if(result.status === 401 || result.status === 403){
            const response = await fetch(`${BASE_URI}/auth/refresh-token`, {
                method: "POST",
                credentials: "include"
            });

            if(response.ok){
                //Retrying the original request.
                result = await fetch(`${BASE_URI}${endpoint}`, {
                    ...options,
                    credentials: "include",
                });
            }
            else { 
                throw new Error("Session expired");
            }
        }
    } catch (error) {
        console.log(error);
        result = {
            success: false,
            message: error
        };
    }

    return result;
}