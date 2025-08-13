import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MoveLeft } from 'lucide-react'


const BackButton = () => {
    //Creating the back button.
    const navigate = useNavigate();

    const handleBackButton = ()=>{
        //Handling the back-button.
        navigate(-1);
    }

  return (
    <button className='p-2 bg-blue-600 text-white' onClick={handleBackButton}>
       <MoveLeft/> Back
    </button>
  )
}

export default BackButton