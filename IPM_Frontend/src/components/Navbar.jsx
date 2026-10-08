import React from "react";

const Navbar = ({ page, setPage }) => {
  return (
    <nav className="navbar">
      <h2>IPM System</h2>

      <div>
        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}>
          Dashboard
        </button>

        <button
          className={page === "item-types" ? "active" : ""}
          onClick={() => setPage("item-types")}>
          Item Types
        </button>

        <button
          className={page === "items" ? "active" : ""}
          onClick={() => setPage("items")}>
          Items
        </button>

        <button
          className={page === "purchases" ? "active" : ""}
          onClick={() => setPage("purchases")}>
          Purchases
        </button>
      </div>
    </nav>
  );
};

export default Navbar;