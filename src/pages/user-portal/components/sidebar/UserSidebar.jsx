import { BriefcaseIcon, IndianRupee } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserSidebar = () => {
    const navigate = useNavigate();
  return (
    <aside className='w-64 h-screen flex flex-col'>
         <nav className="flex flex-col space-y-4">
            <button className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition text-gray-700 hover:text-gray-600" onClick={() => navigate('/user/dashboard/past-trips')}>
                <BriefcaseIcon className="w-5 h-5 mr-3" />
                <span className="text-md font-medium">Past Trips</span>
            </button>
            <button className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition text-gray-700 hover:text-gray-600" onClick={() => navigate('/user/dashboard/transaction')}>
                <IndianRupee className="w-5 h-5 mr-3" />
                <span className="text-md font-medium">Transactions</span>
            </button>
      </nav>
    </aside>
  )
}

export default UserSidebar