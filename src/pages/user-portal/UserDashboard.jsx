import React, { useState } from 'react'
import Loader from '../../components/loaders/Loader';
import UserSidebar from './components/sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';

const UserDashboard = () => {
    //States
    const [isLoading, setIsLoading] = useState();


    //Loading component.
    if(isLoading){
        return <Loader message='Loading...'/>
    }

  return (
    <>
    <div className='flex'>
        <UserSidebar/>
        {<Outlet/>}
    </div>
    </>
    
  )
}

export default UserDashboard