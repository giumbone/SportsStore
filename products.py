from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

inventory_items = [
    {"id": 1, "name": "Laptop", "category": "Electronics"},
    {"id": 2, "name": "Chair", "category": "Furniture"},
    {"id": 3, "name": "Smartphone", "category": "Electronics"},
]

def find_product_by_id(product_id):
    return next((item for item in inventory_items if item['id'] == product_id), None)

def filter_products_by_query(name_query, category_query):
    return [
        item for item in inventory_items if
        name_query in item['name'].lower() or
        category_query in item['category'].lower()
    ]

@app.route('/products', methods=['GET'])
def fetch_all_inventory_items():
    return jsonify(inventory_items), 200

@app.route('/products/<int:item_id>', methods=['GET'])
def fetch_inventory_item_by_id(item_id):
    item = find_product_by_id(item_id)
    if item:
        return jsonify(item), 200
    else:
        return jsonify({"error": "Product not found"}), 404

@app.route('/products/search', methods=['GET'])
def search_inventory_items():
    query_params = request.args
    name_search_query = query_params.get('name', '').lower()
    category_search_query = query_params.get('category', '').lower()

    filtered_items = filter_products_by_query(name_search_query, category_search_query)

    return jsonify(filtered_items), 200

if __name__ == '__main__':
    app.run(debug=os.getenv('DEBUG', default=False), host=os.getenv('HOST', '127.0.0.1'), port=int(os.getenv('PORT', 5000)))