import { Routes, Route } from "react-router-dom";
import NavBar from '../../components/NavBar/NavBar'

// import ProductDisplay from '../ProductDisplay/ProductDisplay';

import AddProduct from "../AddProduct/AddProduct";
import History from "../History/History";

import ProductDisplay2 from "../ProductDisplay2/ProductDisplay2";

function App() {
  return (
    <main className="App">
    <NavBar/>
    <Routes>
        {/* <Route path="/" element={<ProductDisplay/>} /> */}

        <Route path="/" element={<ProductDisplay2/>} />

        <Route path="/product/add" element={<AddProduct/>} />
        <Route path="/cart/history" element={<History/>} />
      </Routes>
    </main>
  )
}

export default App
