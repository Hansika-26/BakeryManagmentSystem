import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: ""
  });

  // Fetch categories and products
  const fetchData = async () => {
    const catRes = await axios.get(backendUrl + "/api/categories");
    const prodRes = await axios.get(backendUrl + "/api/products");
    if (catRes.data.success) setCategories(catRes.data.categories);
    if (prodRes.data.success) setProducts(prodRes.data.products);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        const { data } = await axios.put(
          `${backendUrl}/api/products/${editProduct._id}`,
          form,
          { withCredentials: true }
        );
        if (data.success) toast.success("Product updated!");
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/products`,
          form,
          { withCredentials: true }
        );
        if (data.success) toast.success("Product added!");
      }
      setForm({ name: "", description: "", price: "", image: "", category: "" });
      setEditProduct(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, { withCredentials: true });
      if (data.success) toast.success("Product deleted!");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category._id
    });
    setShowForm(true);
  };

  // Helper to get image from assets
  const getImage = (imageName) => {
    if (!imageName) return assets.cake; // fallback
    const key = Object.keys(assets).find(
      (k) => k.toLowerCase() === imageName.replace(/\.[^/.]+$/, "").toLowerCase()
    );
    return assets[key] || assets.cake;
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category._id === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white-100">
      <AdminNavbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800">Admin Dashboard</h2>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
            onClick={() => {
              setShowForm(true);
              setEditProduct(null);
              setForm({ name: "", description: "", price: "", image: "", category: "" });
            }}
          >
            Add Product
          </button>
        </div>
        {/* Category Filter */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded ${!selectedCategory ? "bg-blue-500 text-white" : "bg-white text-pink-700 border"}`}
            onClick={() => setSelectedCategory("")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`px-4 py-2 rounded flex items-center gap-2 ${selectedCategory === cat._id ? "bg-blue-500 text-white" : "bg-white text-blue-700 border"}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              <img src={getImage(cat.image)} alt={cat.name} className="w-6 h-6 rounded" />
              {cat.name}
            </button>
          ))}
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <img
                src={getImage(product.image)}
                alt={product.name}
                className="w-40 h-32 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-1 text-pink-700">{product.name}</h3>
              <p className="mb-2 text-gray-600 text-center">{product.description}</p>
              <div className="mb-4 text-orange-600 font-bold text-lg">${product.price}</div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="bg-yellow-400 px-3 py-1 rounded shadow">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-3 py-1 rounded shadow">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4 min-w-[350px]"
              style={{ minWidth: 350 }}
            >
              <h2 className="text-xl font-bold mb-2">{editProduct ? "Edit Product" : "Add Product"}</h2>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                required
                className="border p-2 rounded shadow"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
                className="border p-2 rounded shadow"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                className="border p-2 rounded shadow"
              />
              <input
                type="text"
                name="image"
                placeholder="Image key (e.g. cake, Buns, donuts, rolls)"
                value={form.image}
                onChange={handleChange}
                required
                className="border p-2 rounded shadow"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="border p-2 rounded shadow"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded shadow">
                  {editProduct ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditProduct(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded shadow"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;