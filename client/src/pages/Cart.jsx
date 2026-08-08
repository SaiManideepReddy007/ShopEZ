import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const res = await API.get(`/cart/${user.id}`);
      setCartItems(res.data);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user]);

  const handleRemove = async (itemId) => {
    try {
      await API.delete(`/cart/${itemId}`);
      setCartItems(cartItems.filter((item) => item._id !== itemId));
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await API.put(`/cart/${itemId}`, { quantity: newQuantity });
      setCartItems(cartItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)));
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const discountedPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);

  if (loading) return <p className="container">Loading cart...</p>;

  return (
    <div className="container cart-page">
      <h2 className="section-title">Your Cart</h2>
      {error && <p className="error">{error}</p>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.mainImg} alt={item.title} />
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p>Size: {item.size}</p>
                  <p>₹{item.price} {item.discount > 0 && <span className="discount">({item.discount}% off)</span>}</p>
                  <div className="qty-control">
                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="btn-danger" onClick={() => handleRemove(item._id)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            <button className="btn" style={{ width: "100%" }} onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;