import {Toaster , toast} from "sonner"
import {BrowserRouter,Route,Routes} from "react-router"
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import HomeAdmin from "./pages/Admin/HomeAdmin";
import DoctorManagement from "./pages/Admin/DoctorManagement";
import AccountManagement from "./pages/Admin/AccountManagement";

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
          element={<LoginPage/>} //component hien thi
        />
        <Route 
          path="/register" //duong dan
          element={<RegisterPage/>}
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
        {/* setup route */}
      </Routes>

    </BrowserRouter>    


    </>
  )
}

export default App
