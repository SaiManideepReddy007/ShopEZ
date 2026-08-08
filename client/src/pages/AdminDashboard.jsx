import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("overview");

  const [form, setForm] = useState({
    title: "", description: "", mainImg: "", carousel: "", category: "", gender: "unisex", sizes: "", price: "", discount: "",
  });

  useEffect(() => {
    if (!user || user.userType !== "admin") {
      navigate("/");
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load orders");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await API.post("/products", {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount) || 0,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        carousel: form.carousel.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setMessage("Product added!");
      setForm({ title: "", description: "", mainImg: "", carousel: "", category: "", gender: "unisex", sizes: "", price: "", discount: "" });
      fetchProducts();
      setTab("products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}`, { status });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  if (!user || user.userType !== "admin") return null;

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <h2>ShopEZ (admin)</h2>
        <div className="admin-tabs">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Home</button>
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button>
          <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</button>
          <button className={tab === "new" ? "active" : ""} onClick={() => setTab("new")}>New Product</button>
        </div>
      </div>

      <div className="container admin-body">
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {tab === "overview" && (
          <div className="admin-stats">
            <div className="stat-card">
              <p className="stat-label">All Products</p>
              <p className="stat-value">{products.length}</p>
              <button className="btn-outline" onClick={() => setTab("products")}>View all</button>
            </div>
            <div className="stat-card">
              <p className="stat-label">All Orders</p>
              <p className="stat-value">{orders.length}</p>
              <button className="btn-outline" onClick={() => setTab("orders")}>View all</button>
            </div>
            <div className="stat-card">
              <p className="stat-label">Add Product</p>
              <p className="stat-value">(new)</p>
              <button className="btn-outline" onClick={() => setTab("new")}>Add now</button>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div>
            <h3 className="section-title">All Products</h3>
            <div className="admin-product-grid">
              {products.map((p) => (
                <div key={p._id} className="card admin-product-card">
                  <img src={p.mainImg} alt={p.title} />
                  <h4>{p.title}</h4>
                  <p className="price-row"><span className="price">₹{p.price}</span> {p.discount > 0 && <span className="discount">{p.discount}% off</span>}</p>
                  <button className="btn-danger" style={{ width: "100%" }} onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h3 className="section-title">Orders</h3>
            {orders.map((order) => (
              <div key={order._id} className="card order-card">
                <div className="order-header">
                  <span>Order #{order._id.slice(-8)}</span>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </div>
                <p className="order-meta">Address: {order.address}, {order.pincode} · Mobile: {order.mobile}</p>
                <p className="order-meta">Payment: {order.paymentMethod} · Ordered: {new Date(order.orderDate).toLocaleDateString()}</p>
                {order.products.map((p, idx) => (
                  <div key={idx} className="order-product">
                    <img src={p.mainImg} alt={p.title} />
                    <div><p>{p.title} (Size: {p.size}) x{p.quantity}</p></div>
                  </div>
                ))}
                <div className="status-update">
                  <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "new" && (
          <div className="card" style={{ maxWidth: "500px" }}>
            <h3>New Product</h3>
            <form onSubmit={handleAddProduct} className="new-product-form">
              <input name="title" placeholder="Product name" value={form.title} onChange={handleChange} required />
              <textarea name="description" placeholder="Product description" value={form.description} onChange={handleChange} required />
              <input name="mainImg" placeholder="Thumbnail image URL" value={form.mainImg} onChange={handleChange} required />
              <input name="carousel" placeholder="Extra image URLs (comma separated)" value={form.carousel} onChange={handleChange} />
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
              <input name="sizes" placeholder="Sizes (comma separated: S,M,L,XL)" value={form.sizes} onChange={handleChange} />
              <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input name="discount" type="number" placeholder="Discount %" value={form.discount} onChange={handleChange} />
              <button type="submit" className="btn">Add product</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;