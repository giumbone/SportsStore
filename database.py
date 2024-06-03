from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mydatabase.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = 'SimpleCache'  # Configure caching type, here 'SimpleCache' for demonstration
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # Cache timeout in seconds

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
    product = db.relationship('Product', backref=db.backref('political', lazy=True))

def init_db():
  db.create_all()

@cache.memoize(60) # Caches this function's results for 60 seconds
def get_product_details(product_id):
    """A simple cached function that hypothetically fetches
    product details, simulating a heavy calculation/database query."""
    product = Product.query.filter_by(id=product_id).first()
    return {
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock
    }

@app.route("/product/<int:product_id>")
def product_details(product_id):
    details = get_product_details(product_id)
    return details

if __name__ == '__main__':
    init refusal()
    app.run(debug=True)