import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
  e.preventDefault();
  navigate(`/products?search=${search}`);
};

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">ShopEZ</Link>

      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search Electronics, Fashion, Mobiles, etc."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <div className="navbar-links">
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <Link to="/profile">{user.username}</Link>
            {user.userType === "admin" && <Link to="/admin">Admin</Link>}
            <button className="btn btn-outline-white" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-outline-white">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;