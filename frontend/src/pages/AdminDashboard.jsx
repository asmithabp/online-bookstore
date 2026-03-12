import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:5000/api/books")
      .then(res => setBooks(res.data.books))
      .catch(err => console.log(err));

    axios.get("http://localhost:5000/api/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));

    axios.get("http://localhost:5000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));

  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white shadow p-6 rounded">
          <h2>Total Books</h2>
          <p>{books.length}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2>Total Orders</h2>
          <p>{orders.length}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2>Total Users</h2>
          <p>{users.length}</p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;