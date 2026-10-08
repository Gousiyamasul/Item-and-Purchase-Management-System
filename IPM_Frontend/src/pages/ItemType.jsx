import React, { useEffect, useState } from "react";
import axios from "axios";

const ItemTypes = () => {
  const [itemTypes, setItemTypes] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getItemTypes();
  }, []);

  function getItemTypes() {
    axios.get("http://127.0.0.1:8000/api/item-types/")
      .then((response) => {
        setItemTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function saveItemType(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Item type name is required");
      return;
    }

    if (editId) {
      axios.put(`http://127.0.0.1:8000/api/item-types/${editId}/`, {
          item_type_name: name,
        })
        .then(() => {
          setName("");
          setEditId(null);
          getItemTypes();
        })
        .catch((error) => {
          console.log(error);
          alert("Unable to update item type");
        });
    } else {
      axios.post("http://127.0.0.1:8000/api/item-types/", {
          item_type_name: name,
        })
        .then(() => {
          setName("");
          getItemTypes();
        })
        .catch((error) => {
          console.log(error);
          alert("Unable to add item type");
        });
    }
  }

  function editItemType(itemType) {
    setEditId(itemType.id);
    setName(itemType.item_type_name);
  }

  function deleteItemType(id) {
    if (!window.confirm("Delete this item type?")) {
      return;
    }

    axios.delete(`http://127.0.0.1:8000/api/item-types/${id}/`)
      .then(() => {
        getItemTypes();
      })
      .catch((error) => {
        alert(
          error.response?.data?.error ||
            "Cannot delete this item type"
        );
      });
  }

  function cancelEdit() {
    setEditId(null);
    setName("");
  }

  return (
    <div>
      <h1>Item Types</h1>

      <form onSubmit={saveItemType} className="form">
        <input
          type="text"
          placeholder="Item type name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {itemTypes.map((itemType) => (
            <tr key={itemType.id}>
              <td>{itemType.id}</td>
              <td>{itemType.item_type_name}</td>
              <td>
                <button onClick={() => editItemType(itemType)}>
                  Edit
                </button>

                <button
                  onClick={() => deleteItemType(itemType.id)}
                >
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

export default ItemTypes;

