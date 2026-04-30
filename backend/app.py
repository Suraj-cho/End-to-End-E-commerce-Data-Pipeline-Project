from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime

# cd C:\Users\shashi\Desktop\ecommerce-frontend\frontend
# npm run dev

# cd C:\Users\shashi\Desktop\ecommerce-frontend\backend
# python app.py
app = Flask(__name__)
CORS(app)  # Allow React frontend to call this API

# ─────────────────────────────────────────────
# DATABASE CONFIGURATION
# Update these values to match your MySQL setup
# ─────────────────────────────────────────────
DB_CONFIG = {
    "host":     "localhost",
    "user":     "root",          # Your MySQL username
    "password": "9637771409", # Your MySQL password
    "database": "ecommerce"
}

def get_db_connection():
    """Create and return a MySQL database connection."""
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn


# ─────────────────────────────────────────────
# PRODUCT CATALOGUE (in-memory, no DB needed)
# ─────────────────────────────────────────────
@app.route("/products", methods=["GET"])
def get_products():
    """Fetch products dynamically from MySQL."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                product_id,
                product_name AS name,
                selling_price AS price,
                category
            FROM products
        """)

        products = cursor.fetchall()

        # Optional emoji mapping
        emoji_map = {
            "Laptop": "💻",
            "T-Shirt": "👕",
            "Mobile": "📱",
            "Shoes": "👟",
            "Headphones": "🎧",
            "Smartwatch": "⌚"
        }

        for p in products:
            p["emoji"] = emoji_map.get(p["name"], "🛒")

        cursor.close()
        conn.close()

        return jsonify(products), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


@app.route("/order", methods=["POST"])
def create_order():
    """
    Accept a purchase and write it to the orders table.

    Expected JSON body:
        {
            "customer_id": 1,
            "product_id":  3,
            "quantity":    2,
            "price":    25000
        }
    """
    data = request.get_json()

    # ── Basic validation ──────────────────────
    required_fields = ["customer_id", "product_id", "quantity", "price"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    customer_id = int(data["customer_id"])
    product_id  = int(data["product_id"])
    quantity    = int(data["quantity"])
    price       = int(data["price"])

    if quantity <= 0 or price <= 0:
        return jsonify({"error": "quantity and price must be positive"}), 400

    # ── Insert into MySQL ─────────────────────
    try:
        conn   = get_db_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO orders (customer_id, product_id, quantity, price, order_date)
            VALUES (%s, %s, %s, %s, %s)
        """
        order_date = datetime.now()
        cursor.execute(sql, (customer_id, product_id, quantity, price, order_date))
        conn.commit()

        order_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({
            "message":    "Order placed successfully!",
            "order_id":   order_id,
            "order_date": order_date.strftime("%Y-%m-%d %H:%M:%S")
        }), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


@app.route("/orders", methods=["GET"])
def get_orders():
    """Return all orders (useful for verifying inserts)."""
    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM orders ORDER BY order_date DESC")
        orders = cursor.fetchall()
        # Convert datetime objects to strings for JSON serialisation
        for order in orders:
            if isinstance(order.get("order_date"), datetime):
                order["order_date"] = order["order_date"].strftime("%Y-%m-%d %H:%M:%S")
        cursor.close()
        conn.close()
        return jsonify(orders), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)