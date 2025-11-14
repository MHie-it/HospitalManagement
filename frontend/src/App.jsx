import {Toaster , toast} from "sonner"
import {BrowserRouter,Route,Routes} from "react-router"
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';

function App() {
  return (
    <>
      {/* <Toaster/>
      <button onClick={() => toast("hello") }> Toaster</button> */}

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
        {/* setup route */}
      </Routes>

    </BrowserRouter>    


    </>
  )
}

export default App
