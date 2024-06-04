from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mydatabase.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = 'SimpleCache'  # Configure caching type
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # Cache timeout in seconds (5 minutes)

db = SQLAlchemy(app)
cache = Cache(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    delivery_address = db.Column(db.Text, nullable=False)
    product = db.relationship('Product', backref=db.backref('orders', lazy=True))

def init_db():
    db.create_all()

@app.before_first_request
def initialize_database():
    """Initialize or re-initialize the database tables."""
    init_db()

@cache.memoize(60)  # Caches function call results for 60 seconds
def get_product_by_id(product_id):
    """Fetches product by ID with potential heavy calculations/database queries."""
    return Product.query.filter_by(id=product_id).first()

@cache.memoize(60)
def get_product_details(product_id):
    """Caches and fetches detailed product information."""
    product = get_product_by_id(product_id)
    if product:
        return {
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "stock": product.stock
        }
    else:
        return None

@app.route("/product/<int:product_id>")
def product_details(product_id):
    details = get_product_details(product_id)
    if details:
        return jsonify(details)
    else:
        return jsonify({"error": "Product not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)