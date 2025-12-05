import {Toaster , toast} from "sonner"
import {BrowserRouter,Route,Routes} from "react-router"
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import HomeAdmin from "./pages/Admin/HomeAdmin";
import DoctorManagement from "./pages/Admin/DoctorManagement";
import AccountManagement from "./pages/Admin/AccountManagement";
import UserPage from "./pages/User/UserPage";
import ServiceManagement from "./pages/Admin/ServiceManagement";
import MedicalDevicesManagement from "./pages/Admin/MedicalDevicesManagement";

function App() {
  return (
    <>
      {/* <Toaster/>
      <button onClick={() => toast("hello") }> Toaster</button> */}
      <Toaster richColors/>

      <BrowserRouter>
    
      <Routes>
        <Route 
          path="/" //duong dan
          element={<UserPage/>} //component hien thi
        />
        <Route 
          path="/register" //duong dan
          element={<RegisterPage/>}
        />
        <Route 
          path="/login" //duong dan
          element={<LoginPage/>}
        />
        <Route 
          path="/admin" //duong dan
          element={<HomeAdmin/>}
        />
        <Route 
          path="/DoctorManagement" //duong dan
          element={<DoctorManagement/>}
        />
        <Route 
          path="/AccountManagement" //duong dan
          element={<AccountManagement/>}
        />
        <Route 
          path="/ServiceManagement" //duong dan
          element={<ServiceManagement/>}
        />
        <Route 
          path="/MedicalDevicesManagement" //duong dan
          element={<MedicalDevicesManagement/>}
        />
        {/* setup route */}
      </Routes>

    </BrowserRouter>    


    </>
  )
}

export default App
