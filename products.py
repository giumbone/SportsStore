from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

products = [
    {"id": 1, "name": "Laptop", "category": "Electronics"},
    {"id": 2, "name": "Chair", "category": "Furniture"},
    {"id": 3, "name": "Smartphone", "category": "Electronics"},
]

@app.route('/products', methods=['GET'])
def get_all_products():
    return jsonify(products), 200

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = next((product for product in products if product['id'] == product_id), None)
    if product:
        return jsonify(product), 200
    else:
        return jsonify({"error": "Product not found"}), 404

@app.route('/products/search', methods=['GET'])
def search_products():
    query_params = request.args
    name_query = query_params.get('name', '').lower()
    category_query = query_components.get('category', '').lower()

    filtered_products = [product for product in products if
                         name_query in product['name'].lower() or
                         category_query in product['category'].lower()]

    return jsonify(filtered_products), 200

if __name__ == '__main__':
    app.run(debug=os.getenv('DEBUG', default=False), host=os.getenv('HOST', '127.0.0.1'), port=int(os.getenv('PORT', 5000)))