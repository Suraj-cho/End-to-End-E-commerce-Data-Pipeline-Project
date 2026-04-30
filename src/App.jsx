import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000";

// Simulate a logged-in customer (in a real app this comes from auth)
const CUSTOMER_ID = Math.floor(Math.random() * 100) + 1;

export default function App() {
  const [products, setProducts]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [toast, setToast]           = useState(null);
  const [loading, setLoading]       = useState({});
  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab]   = useState("shop");

  // ── Fetch products on mount ───────────────
  useEffect(() => {
    axios.get(`${API_BASE}/products`)
      .then(res => {
        setProducts(res.data);
        // initialise quantity selectors to 1
        const qty = {};
        res.data.forEach(p => (qty[p.product_id] = 1));
        setQuantities(qty);
      })
      .catch(() => showToast("❌ Could not load products. Is the backend running?", "error"));
  }, []);

  // ── Fetch orders when tab switches ───────
  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const fetchOrders = () => {
    axios.get(`${API_BASE}/orders`)
      .then(res => setOrders(res.data))
      .catch(() => showToast("❌ Could not load orders.", "error"));
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBuy = async (product) => {
    const qty = quantities[product.product_id] || 1;
    setLoading(prev => ({ ...prev, [product.product_id]: true }));

    try {
      const res = await axios.post(`${API_BASE}/order`, {
        customer_id: CUSTOMER_ID,
        product_id:  product.product_id,
        quantity:    qty,
        price:       product.price,
      });
      showToast(`✅ Order #${res.data.order_id} placed! ${product.emoji} ${product.name} × ${qty}`, "success");
    } catch (err) {
      const msg = err.response?.data?.error || "Order failed. Check backend.";
      showToast(`❌ ${msg}`, "error");
    } finally {
      setLoading(prev => ({ ...prev, [product.product_id]: false }));
    }
  };

  return (
    <div className="app">
      {/* ── Header ─────────────────────────── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">ShopStream</span>
          </div>
          <nav className="tabs">
            <button
              className={`tab ${activeTab === "shop" ? "tab--active" : ""}`}
              onClick={() => setActiveTab("shop")}
            >Shop</button>
            <button
              className={`tab ${activeTab === "orders" ? "tab--active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >My Orders</button>
          </nav>
          <div className="customer-badge">Customer #{CUSTOMER_ID}</div>
        </div>
      </header>

      {/* ── Toast notification ─────────────── */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.msg}</div>
      )}

      <main className="main">
        {/* ── SHOP TAB ───────────────────────── */}
        {activeTab === "shop" && (
          <>
            <div className="section-title">
              <h2>Featured Products</h2>
              <p>Click <strong>Buy Now</strong> to record a transaction in MySQL</p>
            </div>
            <div className="product-grid">
              {products.map(product => (
                <div className="product-card" key={product.product_id}>
                  <div className="product-emoji">{product.emoji}</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-id">ID: {product.product_id}</p>
                    <p className="product-price">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="product-actions">
                    <div className="qty-row">
                      <label>Qty:</label>
                      <select
                        value={quantities[product.product_id] || 1}
                        onChange={e =>
                          setQuantities(prev => ({
                            ...prev,
                            [product.product_id]: Number(e.target.value),
                          }))
                        }
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="buy-btn"
                      onClick={() => handleBuy(product)}
                      disabled={loading[product.product_id]}
                    >
                      {loading[product.product_id] ? "Placing…" : "Buy Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ORDERS TAB ─────────────────────── */}
        {activeTab === "orders" && (
          <>
            <div className="section-title">
              <h2>All Orders</h2>
              <p>Live data from MySQL — refresh Power BI to see updates</p>
              <button className="refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
            </div>
            {orders.length === 0 ? (
              <div className="empty-state">No orders yet. Go buy something! 🛍️</div>
            ) : (
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price (₹)</th>
                      <th>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.order_id}>
                        <td>#{o.order_id}</td>
                        <td>{o.customer_id}</td>
                        <td>{o.product_id}</td>
                        <td>{o.quantity}</td>
                        <td>₹{Number(o.price).toLocaleString("en-IN")}</td>
                        <td>{o.order_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>ShopStream Demo · MySQL-backed · Power BI ready</p>
      </footer>
    </div>
  );
}