import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({ name: "", mobile: "", address: "", pincode: "", paymentMethod: "COD" });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchCart = async () => {
      try {
        const res = await API.get(`/cart/${user.id}`);
        setCartItems(res.data);
      } catch (err) {
        setError("Failed to load cart");
      }
    };
    fetchCart();
  }, [user]);

  const total = cartItems.reduce((sum, item) => {
    const discountedPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setPlacing(true);
    try {
      const products = cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        description: item.description,
        mainImg: item.mainImg,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
      }));

      await API.post("/orders", {
        userId: user.id,
        products,
        address: form.address,
        pincode: form.pincode,
        mobile: form.mobile,
        paymentMethod: form.paymentMethod,
      });

      await Promise.all(cartItems.map((item) => API.delete(`/cart/${item._id}`)));
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container checkout-page">
      <h2 className="section-title">Checkout</h2>
      {error && <p className="error">{error}</p>}
      <div className="checkout-layout">
        <form onSubmit={handlePlaceOrder} className="card checkout-form">
          <h3>Shipping Details</h3>
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile number" value={form.mobile} onChange={handleChange} required />
          <textarea name="address" placeholder="Shipping address" value={form.address} onChange={handleChange} required />
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
          <button type="submit" className="btn" disabled={placing}>{placing ? "Placing order..." : "Place Order"}</button>
        </form>

        <div className="card checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="summary-row">
              <span>{item.title} x{item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;