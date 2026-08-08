import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const ImageSlider = ({ mainImg, carousel }) => {
  const images = [mainImg, ...(carousel || [])];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="slider">
      <div className="slider-frame">
        {images.length > 1 && (
          <button className="slider-btn slider-btn-left" onClick={prev}>‹</button>
        )}
        <img src={images[index]} alt="product" className="slider-img" />
        {images.length > 1 && (
          <button className="slider-btn slider-btn-right" onClick={next}>›</button>
        )}
      </div>
      {images.length > 1 && (
        <div className="slider-dots">
          {images.map((_, i) => (
            <span key={i} className={`dot ${i === index ? "active" : ""}`} onClick={() => setIndex(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Product not found");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      setMessage("Please select a size");
      return;
    }
    try {
      await API.post("/cart", {
        userId: user.id,
        productId: product._id,
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size: selectedSize,
        quantity: 1,
        price: product.price,
        discount: product.discount,
      });
      setMessage("Added to cart!");
    } catch (err) {
      setMessage("Failed to add to cart");
    }
  };

  if (error) return <p className="container" style={{ color: "red" }}>{error}</p>;
  if (!product) return <p className="container">Loading...</p>;

  return (
    <div className="container product-detail">
      <div>
        <ImageSlider mainImg={product.mainImg} carousel={product.carousel} />
      </div>
      <div className="product-detail-info">
        <h2>{product.title}</h2>
        <p className="product-desc">{product.description}</p>
        <div className="price-row">
          <span className="price-lg">₹{product.price}</span>
          {product.discount > 0 && <span className="discount">{product.discount}% off</span>}
        </div>

        {product.sizes?.length > 0 && (
          <div className="size-select">
            <p>Select size:</p>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {message && <p className="msg">{message}</p>}
        <button className="btn" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetail;