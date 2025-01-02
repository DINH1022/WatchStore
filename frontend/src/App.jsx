import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/Products/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import FavoritesProduct from "./pages/Products/FavoritesProduct.jsx";
import Navigation from "./pages/Auth/Navigation.jsx";
import HomePage from "./pages/Home/Home.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import Profile from "./pages/User/Profile.jsx";
import ProductsPage from "./pages/Products/ProductsPage.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import CategoriesPage from "./pages/Admin/CategoriesPage.jsx"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Thêm import này

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/product/:id" element={<ProductDetail />}></Route>
          <Route path="/cart/" element={<Cart />}></Route>
          <Route path="/products" element={<ProductsPage />}></Route>
          <Route path="/favorites" element={<FavoritesProduct />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/users" element={<UserList />}></Route>
          <Route path="/categories" element={<CategoriesPage />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/admin" element={<Dashboard />}></Route>
        </Routes>
        <ToastContainer /> 
      </div>
    </Router>
  );
}

export default App;
