import { Routes, Route } from "react-router-dom";
import NavBar from '../../components/NavBar/NavBar'
import ProductDisplay from '../ProductDisplay/ProductDisplay';
import AddProduct from "../AddProduct/AddProduct";

function App() {
  return (
    <main className="App">
    <NavBar/>
    <Routes>
        <Route path="/" element={<ProductDisplay/>} />
        <Route path="/product/add" element={<AddProduct/>} />
      </Routes>
    </main>
  )
}

export default App
