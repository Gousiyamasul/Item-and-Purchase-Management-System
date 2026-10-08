import React, { useEffect, useState } from "react";
import axios from "axios";

const Items = () => {
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    item_name: "",
    purchase_date: "",
    item_type: "",
    stock_available: 0,
    active: true,
  });

  useEffect(() => {
    getItems();
    getItemTypes();
  }, []);

  function getItems() {
    axios.get("http://127.0.0.1:8000/api/items/")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getItemTypes() {
    axios.get("http://127.0.0.1:8000/api/item-types/")
      .then((response) => {
        setItemTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function saveItem(e) {
    e.preventDefault();

    const data = {
      item_name: form.item_name,
      purchase_date: form.purchase_date,
      item_type: Number(form.item_type),
      stock_available: Number(form.stock_available),
      active: form.active,
    };

    if (editId) {
      axios.put(`http://127.0.0.1:8000/api/items/${editId}/`, data)
        .then(() => {
          resetForm();
          getItems();
        })
        .catch((error) => {
          console.log(error);
          const message = Object.values(data || {})?.[0]?.[0] || "Unable to update item"; alert(message); });
    } else {
      axios.post("http://127.0.0.1:8000/api/items/", data)
        .then(() => {
          resetForm();
          getItems();
        })
        .catch((error) => {
          console.log(error);
          
          const message = Object.values(data || {})?.[0]?.[0] || "Unable to add item"; alert(message);
        });
    }
  }

  function editItem(item) {
    setEditId(item.id);

    setForm({
      item_name: item.item_name,
      purchase_date: item.purchase_date,
      item_type: item.item_type,
      stock_available: item.stock_available,
      active: item.active,
    });
  }

  function deleteItem(id) {
    if (!window.confirm("Delete this item?")) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/api/items/${id}/`)
      .then(() => {
        getItems();
      })
      .catch((error) => {
        alert(
          error.response?.data?.error ||
            "Cannot delete this item"
        );
      });
  }

  function resetForm() {
    setEditId(null);

    setForm({
      item_name: "",
      purchase_date: "",
      item_type: "",
      stock_available: 0,
      active: true,
    });
  }

  return (
    <div>
      <h1>Items</h1>

      <form onSubmit={saveItem} className="form">
        <input type="text" name="item_name" placeholder="Item name" value={form.item_name} onChange={handleChange}/>

        <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange}/>

        <select name="item_type" value={form.item_type} onChange={handleChange}>
          <option value="">Select Item Type</option>

          {itemTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.item_type_name}
            </option>
          ))}
        </select>

        <input type="number" name="stock_available" min="0" value={form.stock_available} onChange={handleChange}/>

        <label>
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange}/>
          Active
        </label>

        <button type="submit">
          {editId ? "Update" : "Add Item"}
        </button>

        {editId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Availability</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.item_name}</td>
              <td>{item.item_type_name}</td>
              <td>{item.stock_available}</td>
              <td>{item.availability}</td>
              <td>{item.active ? "Yes" : "No"}</td>

              <td>
                <button onClick={() => editItem(item)}>
                  Edit
                </button>

                <button onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Items;

