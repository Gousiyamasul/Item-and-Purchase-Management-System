import React, { useEffect, useState } from "react";
import axios from "axios";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);

  const [order, setOrder] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const [purchaseItems, setPurchaseItems] = useState([
    {
      item: "",
      quantity: 1,
    },
  ]);

  useEffect(() => {
    getPurchases();
    getItems();
  }, []);

  function getPurchases() {
    axios
      .get("http://127.0.0.1:8000/api/purchases/")
      .then((response) => {
        setPurchases(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getItems() {
    axios
      .get("http://127.0.0.1:8000/api/items/")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleItemChange(index, field, value) {
    const newItems = [...purchaseItems];

    newItems[index][field] = value;

    setPurchaseItems(newItems);
  }

  function addItem() {
    setPurchaseItems([
      ...purchaseItems,
      {
        item: "",
        quantity: 1,
      },
    ]);
  }

  function removeItem(index) {
    const newItems = purchaseItems.filter(
      (item,i) => i !== index
    );

    setPurchaseItems(newItems);
  }

  function savePurchase(e) {
    e.preventDefault();

    if (!order.trim()) {
      alert("Order number is required");
      return;
    }

    if (!purchaseDate) {
      alert("Purchase date is required");
      return;
    }

    for (const row of purchaseItems) {
      if (!row.item) {
        alert("Please select an item");
        return;
      }

      if (Number(row.quantity) <= 0) {
        alert("Quantity must be greater than zero");
        return;
      }
    }

    const data = {
      order: order,
      purchase_date: purchaseDate,
      items: purchaseItems.map((row) => ({
        item: Number(row.item),
        quantity: Number(row.quantity),
      })),
    };

    axios.post("http://127.0.0.1:8000/api/purchases/", data)
      .then(() => {
        alert("Purchase created successfully");

        setOrder("");
        setPurchaseDate("");

        setPurchaseItems([
          {
            item: "",
            quantity: 1,
          },
        ]);

        getPurchases();
      })
      .catch((error) => {
        console.log(error);

        const message =
      error.response?.data?.items?.[0] ||
      "Unable to create purchase";

    alert(message);
      });
  }

  return (
    <div>
      <h1>Purchases</h1>

      <form onSubmit={savePurchase} className="purchase-form">
        <input type="text" placeholder="Order number" value={order} onChange={(e) => setOrder(e.target.value)}/>

        <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}/>

        <h3>Purchase Items</h3>

        {purchaseItems.map((row, index) => (
          <div className="purchase-row" key={index}>
            <select value={row.item} onChange={(e) =>handleItemChange(index,"item",e.target.value)}>
              <option value="">Select Item</option>

              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_name}
                </option>
              ))}
            </select>

            <input type="number" min="1" value={row.quantity} onChange={(e) => handleItemChange( index, "quantity", e.target.value)}/>

            {purchaseItems.length > 1 && (
              <button type="button" onClick={() => removeItem(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem}>
          + Add Item
        </button>

        <br />

        <button type="submit">
          Create Purchase
        </button>
      </form>

      <h2>Purchase History</h2>

      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Items</th>
          </tr>
        </thead>

        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.order}>
              <td>{purchase.order}</td>
              <td>{purchase.purchase_date}</td>

              <td>
                {purchase.items.map((item) => (
                  <div key={item.id}>
                    {item.item_name} - {item.quantity}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Purchases;
