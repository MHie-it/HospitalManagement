import {Toaster , toast} from "sonner"
import {BrowserRouter,Route,Routes} from "react-router"
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import HomeAdmin from "./pages/Admin/HomeAdmin";
import DoctorManagement from "./pages/Admin/DoctorManagement";
import AccountManagement from "./pages/Admin/AccountManagement";
import UserPage from "./pages/User/UserPage";
import DatLichKham from "./pages/User/DatLichKham";
import ServiceManagement from "./pages/Admin/ServiceManagement";
import MedicalDevicesManagement from "./pages/Admin/MedicalDevicesManagement";
import FindDoctor from "./pages/Doctor/FindDoctor";

function App() {
  return (
    <>
      {/* <Toaster/>
      <button onClick={() => toast("hello") }> Toaster</button> */}
      <Toaster 
      richColors
      position="top-right"
        toastOptions={{
          style: {
            zIndex: 9999
          }
        }}
      />

      <BrowserRouter>
    
      <Routes>
        <Route 
          path="/" //duong dan
          element={<LoginPage/>} //component hien thi
        />
        <Route 
          path="/dat-lich-kham" //duong dan
          element={<DatLichKham/>}
        />
        <Route 
          path="/register" //duong dan
          element={<RegisterPage/>}
        />
        
        <Route 
          path="/userpage" //duong dan
          element={<UserPage/>} //component hien thi
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

        {/* doctor */}

        <Route 
          path="/doctorhome" //duong dan
          element={<FindDoctor/>}
        />
        {/* setup route */}
      </Routes>

    </BrowserRouter>    


    </>
  )
}

export default App
