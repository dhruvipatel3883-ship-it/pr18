import { useState } from "react";
import "./App.css";

const initialProducts = [
  {
    id: 1,
    name: "Laptop",
    sku: "ELEC101",
    category: "Electronics",
    price: 55000,
    quantity: 10,
    status: "Active",
    description: "High-performance laptop",
  },
  {
    id: 2,
    name: "T-Shirt",
    sku: "CLOT201",
    category: "Clothing",
    price: 799,
    quantity: 50,
    status: "Active",
    description: "Cotton casual T-shirt",
  },
  {
    id: 3,
    name: "Java Programming",
    sku: "BOOK301",
    category: "Books",
    price: 499,
    quantity: 25,
    status: "Inactive",
    description: "Learn Java programming",
  },
];

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  quantity: "",
  status: "Active",
  description: "",
};

function App() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  // Select an existing product
  function handleSelect(event) {
    const id = event.target.value;
    setSelectedId(id);
    setMessage("");

    const product = products.find(
      (item) => item.id === Number(id)
    );

    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: String(product.price),
        quantity: String(product.quantity),
        status: product.status,
        description: product.description || "",
      });
    } else {
      setForm(emptyForm);
    }
  }

  // Handle form field changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Update the selected product
  function handleUpdate(event) {
    event.preventDefault();
    setMessage("");

    if (!selectedId) {
      setMessage("Please select a product first.");
      return;
    }

    const duplicateSku = products.some(
      (product) =>
        product.id !== Number(selectedId) &&
        product.sku.toLowerCase() === form.sku.trim().toLowerCase()
    );

    if (duplicateSku) {
      setMessage("This SKU already exists.");
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === Number(selectedId)
        ? {
            ...product,
            ...form,
            name: form.name.trim(),
            sku: form.sku.trim(),
            price: Number(form.price),
            quantity: Number(form.quantity),
            description: form.description.trim(),
          }
        : product
    );

    try {
      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );
    } catch {
      setMessage("Unable to save changes in browser storage.");
      return;
    }

    setProducts(updatedProducts);
    setMessage("Product updated successfully!");
  }

  // Reset the form
  function handleReset() {
    setSelectedId("");
    setForm(emptyForm);
    setMessage("");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Product Management</h1>
        <p>Update existing product information</p>
      </header>

      <main className="container">
        <section className="form-card">
          <h2>Update Product</h2>

          <form onSubmit={handleUpdate}>
            <div className="field">
              <label htmlFor="productSelect">
                Select Existing Product
              </label>

              <select
                id="productSelect"
                value={selectedId}
                onChange={handleSelect}
                required
              >
                <option value="">-- Select Product --</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="sku">Product SKU</label>
              <input
                id="sku"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Enter product SKU"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="price">Price (₹)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="quantity">Stock Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="3"
              />
            </div>

            <div className="buttons">
              <button type="submit" className="update-btn">
                Update Product
              </button>

              <button
                type="button"
                className="reset-btn"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>

          {message && (
            <p
              className={
                message === "Product updated successfully!"
                  ? "success"
                  : "error"
              }
              role="status"
            >
              {message}
            </p>
          )}
        </section>

        <section className="list-card">
          <h2>Existing Products</h2>

          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>
                      <td>{product.quantity}</td>
                      <td>
                        <span
                          className={
                            product.status === "Active"
                              ? "badge active"
                              : "badge inactive"
                          }
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => {
                            setSelectedId(String(product.id));
                            setForm({
                              ...product,
                              price: String(product.price),
                              quantity: String(product.quantity),
                              description: product.description || "",
                            });
                            setMessage("");
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;