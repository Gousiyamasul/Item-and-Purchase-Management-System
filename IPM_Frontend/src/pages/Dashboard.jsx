import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({
    total_items: 0,
    active_items: 0,
    total_purchases: 0,
    out_of_stock_items: 0,
  });

  useEffect(() => {
    getDashboard();
  }, []);

  function getDashboard() { 
    axios .get("http://127.0.0.1:8000/api/dashboard/") 
    .then((response) => { setData(response.data); }) 
    .catch((error) => { console.log(error); }); 
}

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Items</h3>
          <p>{data.total_items}</p>
        </div>

        <div className="card">
          <h3>Active Items</h3>
          <p>{data.active_items}</p>
        </div>

        <div className="card">
          <h3>Total Purchases</h3>
          <p>{data.total_purchases}</p>
        </div>

        <div className="card">
          <h3>Out of Stock</h3>
          <p>{data.out_of_stock_items}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
