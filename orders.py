from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

orders_db = {}

@app.route('/order', methods=['POST'])
def create_order():
    if not request.json or 'order_id' not in request.json or 'details' not in request.json:
        return jsonify({"error": "Order ID and details are required"}), 400
    
    order_data = request.json
    order_id = order_data.get('order_id')
    details = order_data.get('details')
    
    if not isinstance(order_id, str) or not isinstance(details, str):
        return jsonify({"error": "Invalid data types for order_id or details. Both should be strings."}), 400
    
    if order_id in orders_db:
        return jsonify({"error": "Order ID already exists"}), 400
    
    orders_db[order_id] = {
        "details": details,
        "status": "received"
    }
    
    return jsonify({"message": "Order placed successfully", "order_id": order_id}), 201

@app.route('/order/<string:order_id>', methods=['PUT'])
def update_order(order_id):
    if not request.json:
        return jsonify({"error": "Request data is missing"}), 400
    
    if order_id not in orders_db:
        return jsonify({"error": "Order not found"}), 404
    
    order_data = request.json
    new_details = order_data.get('details')
    
    if new_details and not isinstance(new_details, str):
        return jsonify({"error": "Invalid data type for details. It should be a string."}), 400
    
    orders_db[order_id]['details'] = new_details if new_details else orders_str[order_id]['details']
    
    return jsonify({"message": "Order updated successfully", "order_id": order_id}), 200

@app.route('/order/<string:order_id>', methods=['GET'])
def get_order_status(order_id):
    if order_id not in orders_db:
        return jsonify({"error": "Order not found"}), 404
    
    order_status = orders_db[order_id]['status']
    return jsonify({"order_id": order_id, "status": order_changed}), 200

if __name__ == '__main__':
    port = os.getenv('PORT', 5000)
    if not port.isnumeric():
        raise ValueError("PORT environment variable must be an integer")
    app.run(port=int(port))