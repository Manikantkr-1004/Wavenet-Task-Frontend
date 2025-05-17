import './App.css'
import {Toaster} from "react-hot-toast";
import {AllRoutes} from "./Routes/AllRoutes"
import { Navbar } from './Components/Navbar';

function App() {

  return (
    <>
    <Navbar />
    <div className="w-full h-16"></div>
    <AllRoutes />
    <Toaster position='bottom-left' />
    </>
  )
}

export default App;
