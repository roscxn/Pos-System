import { Routes, Route } from "react-router-dom";
import NavBar from '../../components/NavBar/NavBar'
import ProductDisplay from '../ProductDisplay/ProductDisplay';
import AddProduct from "../AddProduct/AddProduct";
import History from "../History/History";


function App() {
  return (
    <main className="App">
    <NavBar/>
    <Routes>
        <Route path="/" element={<ProductDisplay/>} />
        <Route path="/product/add" element={<AddProduct/>} />
        <Route path="/cart/history" element={<History/>} />
      </Routes>
    </main>
  )
}

export default App
