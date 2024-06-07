from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

orders_db = {}

@app.route('/order', methods=['POST'])
def create_order():
    order_data = request.json
    order_id = order_data.get('order_id')
    details = order_data.get('details')
    
    if order_id in orders_db:
        return jsonify({"error": "Order ID already exists"}), 400
    
    orders_db[order_id] = {
        "details": details,
        "status": "received"
    }
    
    return jsonify({"message": "Order placed successfully", "order_id": order_id}), 201

@app.route('/order/<string:order_id>', methods=['PUT'])
def update_order(order_id):
    if order_id not in orders_db:
        return jsonify({"error": "Order not found"}), 404
    
    order_data = request.json
    orders_db[order_id]['details'] = order_data.get('details', orders_db[order_id]['details'])
    
    return jsonify({"message": "Order updated successfully", "order_id": order_id}), 200

@app.route('/order/<string:order_id>', methods=['GET'])
def get_order_status(order_id):
    if order_id not in orders_db:
        return jsonify({"error": "Order not found"}), 404
    
    order_status = orders_db[order_id]['status']
    return jsonify({"order_id": order_id, "status": order_status}), 200

if __name__ == '__main__':
    app.run(port=int(os.getenv('PORT', 5000)))