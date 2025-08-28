import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
import Login from "./pages/auth/Login"
import NotFound from "./pages/error/Error";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/auth/Register";
import Room from "./pages/admin-portal/rooms/Room";
import RoomDetailsPage from "./pages/room/RoomDetails";
import MainIndex from "./pages/landing/MainIndex";
import UserLayouts from "./layouts/UserLayouts";
import HotelCheckout from "./pages/payments/Checkout";
import LoginPage from "./pages/auth/NewLogin";
import RegistrationPage from "./pages/auth/NewRegister";
import OrderDashboard from "./pages/admin-portal/orders/Order";
import ExtrasLogDashboard from "./pages/admin-portal/extra/LogsDashboard";
import AdminLoginPage from "./pages/admin-portal/auth/Login";
import ModernSidebar from "./components/admin/Sidebar/Sidebar";
import AdminLayouts from "./layouts/AdminLayouts";
import KPIDashboard from "./pages/admin-portal/dashboard/Home";
import PaymentSuccess from "./pages/payments/PaymentSuccess";
import UserDashboard from "./pages/user-portal/UserDashboard";
import Transactions from "./pages/user-portal/transactions/Transactions";
import PastTrips from "./pages/user-portal/past-trips/PastTrips";
import PrivateRoute from "./routes/PrivatesRoutes";
import Authorization from "./components/Authorization";
import Customers from "./pages/admin-portal/customers/Customers";




function App() {
  return (
   <Router>
    <Routes>
    
      <Route path="/new-register" element={<RegistrationPage/>}/>
      <Route path="/login/success" element={<RoomDetailsPage/>}/>


      {/* Success, Failed Payment pages. */}
      <Route path="/payment-success" element={<PaymentSuccess/>}/>
      {/* <Route path="/payment-failed" element={}/> */}
      

      //Add the routes here
      <Route path="/rooms" element={<Room/>}/>
      <Route path="/" element={
        <MainIndex/>
      }/>
     
      <Route path="/room-details/:id" element={
        // <UserLayouts> 
          <RoomDetailsPage/>
        // {/* </UserLayouts> */}
      }/>
     
     <Route path="/room/checkout" element={
      // <ProtectedRoute>
      //   <UserLayouts> 
          <HotelCheckout/>
      //   </UserLayouts>
      // </ProtectedRoute>
      }/>

      {/* User Routes */}
      <Route path="/user/dashboard" element={
        <ProtectedRoute>
          <UserLayouts> 
            <UserDashboard/>
          </UserLayouts>
        </ProtectedRoute>
      }>
        <Route path="transaction" element={<Transactions/>}/>
        <Route path="past-trips" element={<PastTrips/>}/>
      </Route>
       
  
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage/>}/>

      

      <Route path="" element={

          <AdminLayouts/>
   
        }>
        <Route path="/admin/home" element={<KPIDashboard/>}/>
        <Route path="/admin/room" element={<Room/>}/>
        <Route path="/admin/orders" element={<OrderDashboard/>}/>
        <Route path="/admin/dashboard" element={<ExtrasLogDashboard/>}/>
        <Route path="/admin/customers" element={<Customers/>}/>
      </Route>

      

      <Route path="/*" element={<NotFound/>}/>
      <Route path="/not-authorized" element={<Authorization/>}/>
    </Routes>
       <Toaster/>
   </Router>
  )
}

export default App
