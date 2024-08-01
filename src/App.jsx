import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    hobbies: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/data/all");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        await axios.put(
          `http://localhost:5000/api/data/update/${updateId}`,
          form
        );
        setIsUpdating(false);
        setUpdateId(null);
      } else {
        await axios.post("http://localhost:5000/api/data/add", form);
      }
      fetchData();
      setForm({ name: "", phoneNumber: "", email: "", hobbies: "" });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/data/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setIsUpdating(true);
    setUpdateId(item._id);
  };

  const handleSend = async () => {
    console.log(selectedRows);
    try {
      await axios.post("http://localhost:5000/api/data/send", {
        ids: selectedRows,
      });
      alert("Email sent");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleSelect = (id) => {
    setSelectedRows(
      selectedRows.includes(id)
        ? selectedRows.filter((row) => row !== id)
        : [...selectedRows, id]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="mb-2 p-2 border border-gray-300 focus:border-white"
        />
        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="mb-2 p-2 border border-gray-300 focus:border-white"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="mb-2 p-2 border border-gray-300 focus:border-white"
        />
        <input
          type="text"
          name="hobbies"
          value={form.hobbies}
          onChange={handleChange}
          placeholder="Hobbies"
          required
          className="mb-2 p-2 border border-gray-300 focus:border-white"
        />
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-1"
        >
          {isUpdating ? "Update" : "Save"}
        </button>
      </form>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Hobbies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item._id}
              className={`border ${
                index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
              }`}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item._id)}
                  onChange={() => handleSelect(item._id)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.phoneNumber}</td>
              <td>{item.email}</td>
              <td>{item.hobbies}</td>
              <td>
                <button
                  onClick={() => handleEdit(item)}
                  className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-3 py-2 text-center m-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSend}
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-1"
      >
        Send
      </button>
    </div>
  );
}

export default App;
