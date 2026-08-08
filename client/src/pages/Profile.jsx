import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/user/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <p className="container">Loading...</p>;

  return (
    <div className="container profile-page">
      <div className="card profile-card">
        <h2>My Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h3 className="section-title">My Orders</h3>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card order-card">
            <div className="order-header">
              <span>Order #{order._id.slice(-8)}</span>
              <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div>
            <p className="order-meta">Placed on {new Date(order.orderDate).toLocaleDateString()} · {order.paymentMethod}</p>
            <p className="order-meta">{order.address}, {order.pincode}</p>
            {order.status === "pending" && (
              <button className="btn-danger" style={{ marginTop: "0.5rem" }} onClick={() => handleCancelOrder(order._id)}>
                Cancel order
              </button>
            )}
            {order.products.map((p, idx) => (
              <div key={idx} className="order-product">
                <img src={p.mainImg} alt={p.title} />
                <div>
                  <p>{p.title} (Size: {p.size}) x{p.quantity}</p>
                  <p className="price">₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;