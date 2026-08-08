import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  const search = searchParams.get("search")?.toLowerCase() || "";
  const urlCategory = searchParams.get("category")?.toLowerCase() || "";

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

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
  }, [urlCategory]);

  const allCategories = [...new Set(products.map((p) => p.category))];

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleGender = (g) => {
    setSelectedGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  let filtered = products.filter((p) => {
    const matchesSearch = search
      ? p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
      : true;
    const matchesCategory =
      selectedCategories.length > 0
        ? selectedCategories.includes(p.category.toLowerCase())
        : true;
    const matchesGender =
      selectedGenders.length > 0 ? selectedGenders.includes(p.gender) : true;
    return matchesSearch && matchesCategory && matchesGender;
  });

  if (sortBy === "low-high") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "high-low") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "discount") filtered = [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));

  return (
    <div className="container products-page">
      <div className="products-layout">
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <h4>Sort By</h4>
            {[
              { key: "popular", label: "Popular" },
              { key: "low-high", label: "Price (low to high)" },
              { key: "high-low", label: "Price (high to low)" },
              { key: "discount", label: "Discount" },
            ].map((opt) => (
              <label key={opt.key} className="filter-option">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === opt.key}
                  onChange={() => setSortBy(opt.key)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Categories</h4>
            {allCategories.map((cat) => (
              <label key={cat} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.toLowerCase())}
                  onChange={() => toggleCategory(cat.toLowerCase())}
                />
                {cat}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Gender</h4>
            {["men", "women", "unisex"].map((g) => (
              <label key={g} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedGenders.includes(g)}
                  onChange={() => toggleGender(g)}
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>

          {(selectedCategories.length > 0 || selectedGenders.length > 0) && (
            <button
              className="btn-outline"
              style={{ width: "100%", marginTop: "1rem" }}
              onClick={() => {
                setSelectedCategories([]);
                setSelectedGenders([]);
              }}
            >
              Clear all filters
            </button>
          )}
        </aside>

        <div className="products-main">
          <h2 className="section-title" style={{ marginTop: 0 }}>All Products</h2>
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
          {!loading && filtered.length === 0 && <p>No products match these filters</p>}
        </div>
      </div>
    </div>
  );
};

export default Products;