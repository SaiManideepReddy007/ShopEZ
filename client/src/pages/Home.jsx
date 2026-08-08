import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const CATEGORIES = [
  { name: "Fashion", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300" },
  { name: "Electronics", img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300" },
  { name: "Mobiles", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300" },
  { name: "Groceries", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300" },
  { name: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search")?.toLowerCase() || "";
  const category = searchParams.get("category")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch = search
      ? p.title.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      : true;
    const matchesCategory = category ? p.category.toLowerCase() === category : true;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (catName) => {
  navigate(`/products?category=${catName.toLowerCase()}`);
};

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Super Sale</h1>
          <p>Up to 50% off on everything</p>
          <Link to="/products" className="btn">Shop Now</Link>
        </div>
      </div>

      <div className="container">
        <div className="category-row">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className={`category-tile ${category === cat.name.toLowerCase() ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.name)}
              style={{ cursor: "pointer" }}
            >
              <img src={cat.img} alt={cat.name} />
              <p>{cat.name}</p>
            </div>
          ))}
          {category && (
            <button className="btn-outline" onClick={() => navigate("/")} style={{ alignSelf: "center" }}>
              Clear filter
            </button>
          )}
        </div>

        <h2 className="section-title">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : search ? `Results for "${search}"` : "Popular Products"}
        </h2>

        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="product-grid">
          {filtered.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-card">
              <img src={product.mainImg} alt={product.title} />
              <div className="product-card-info">
                <h4>{product.title}</h4>
                <p className="product-desc">{product.description}</p>
                <div className="price-row">
                  <span className="price">₹{product.price}</span>
                  {product.discount > 0 && <span className="discount">{product.discount}% off</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {!loading && filtered.length === 0 && <p>No products found</p>}
      </div>
    </div>
  );
};

export default Home;