

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "../css/Inventory.css";
import { BASE_URL } from "../../config";
import { showSuccess, showError } from "../utils/toastService"; // Importing toastService

const Inventory = () => {
  const [searchedQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [transactionId, setTransactionId] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch products once on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/products`, config);
        console.log("Fetched products:", data.products);  // <--- Add here
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        showError("Failed to fetch products"); // Show error toast
      }
    };
    fetchProducts();
  }, []);

  // Memoize filtered items based on search query
  const filteredItems = useMemo(() => {
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(searchedQuery.toLowerCase()) &&
        (value ? item.name.toLowerCase().startsWith(value.toLowerCase()) : true)
    );
  }, [searchedQuery, value, products]);

  // Memoized function for calculating total
  const calculateTotal = useCallback((price, qty) => price * qty, []);

  // Handle product selection from search
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSearchQuery(product.name);
    setValue("");
  };

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty > 0) {
      setQty(newQty);
    } else {
      setQty(1);
    }
  };

  // Add product to cart
  const addProductToCart = () => {
    if (!selectedProduct || qty <= 0 || qty > selectedProduct.quantity) {
        showError("Invalid quantity. Check available stock."); // Show error toast
    //   alert("Invalid quantity. Check available stock.");
      return;
    }

    const existingProduct = cartItems.find(
      (item) => item._id === selectedProduct._id
    );

    if (existingProduct) {
      const updatedQty = existingProduct.qty + qty;
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === selectedProduct._id
            ? {
                ...item,
                qty: updatedQty,
                sum: calculateTotal(item.price, updatedQty),
              }
            : item
        )
      );
      showSuccess(`${selectedProduct.name} updated in cart`); // Show success toast
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          _id: selectedProduct._id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          qty,
          sum: calculateTotal(selectedProduct.price, qty),
        },
      ]);
      showSuccess(`${selectedProduct.name} added to cart`); // Show success toast
    }

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === selectedProduct._id ? { ...p, quantity: p.quantity - qty } : p
      )
    );

    setSelectedProduct(null);
    setQty(1);
    setSearchQuery("");
  };

  // Remove product from cart
  const removeProductFromCart = async (id) => {
    const itemToRemove = cartItems.find((item) => item._id === id);
    if (!itemToRemove) return;

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id
          ? { ...product, quantity: product.quantity + itemToRemove.qty }
          : product
      )
    );

    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    showSuccess("Item removed from cart"); // Show success toast
  };

  // Update cart item quantity
  const updateCartItemQuantity = (id, newQty) => {
    if (newQty < 1) return; // Ensure minimum quantity of 1
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id !== id) return item;

        const product = products.find((p) => p._id === id);
        if (!product) return item;

        const maxQty = product.quantity + item.qty;
        if (newQty > maxQty) return item;

        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === id ? { ...p, quantity: maxQty - newQty } : p
          )
        );

        return {
          ...item,
          qty: newQty,
          sum: calculateTotal(item.price, newQty),
        };
      })
    );
  };

  // Clear product selection
  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSearchQuery("");
    setQty(1);
    setValue("");
  };

  // Complete cart checkout and print receipt
  const clearCart = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/carts/complete`, {
        cart: cartItems.map((item) => ({
          transactionId: "",
          productId: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          totalAmount: item.sum,
        })),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add token to Authorization header
        },
      });

      if (response.status === 200) {
        showSuccess("Order completed!"); // Show success toast
        setTransactionId(response.data.transactionId);
        
      }
    } catch (error) {
      console.error("Order error:", error);
      showError("Failed to complete order"); // Show error toast
    }
  };

  // Print the receipt once transactionId is set
  useEffect(() => {
    if (transactionId) {
      setTimeout(() => {
        printReceipt();
        setTransactionId("");
        setCartItems([]);
        setTotal(0);
      }, 500);
    }
  }, [transactionId]);

  // Update total cost when cart items change
  useEffect(() => {
    setTotal(cartItems.reduce((sum, item) => sum + item.sum, 0));
  }, [cartItems]);

  // Print receipt after transaction
  const printReceipt = () => {
    const printContent = document.getElementById("print-section").innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            h2, h3 { text-align: center; }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="inventory-container">
      <header>
        <h1 className="add-inventory-name">
          <span>Inventory Management</span> System
        </h1>
      </header>

      {/* Add Products Section */}
      <h3>Add Products</h3>
      <div className="inventory-add-div">
        <table className="inventory-responsive-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Available Qty</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className="inventory-cal-input"
                  placeholder="Search Products"
                  value={searchedQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setValue(e.target.value);
                  }}
                />
                {value && !selectedProduct && filteredItems.length > 0 && (
                  <ul className="dropdown">
                    {filteredItems.slice(0, 5).map((item) => (
                      <li key={item._id} onClick={() => handleProductClick(item)}>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td>
                <input
                  type="text"
                  className="inventory-cal-input"
                  value={selectedProduct?.price || ""}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inventory-cal-input"
                  value={selectedProduct?.quantity || ""}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="inventory-cal-input"
                  min="1"
                  max={selectedProduct?.quantity || ""}
                  value={qty}
                  onChange={handleQuantityChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inventory-cal-input"
                  readOnly
                  value={calculateTotal(selectedProduct?.price || 0, qty)}
                />
              </td>
              <td>
                <button
                  className="quantity-btn"
                  onClick={addProductToCart}
                  disabled={!selectedProduct || qty > selectedProduct.quantity}
                >
                  Add
                </button>
                <button className="quantity-btn" onClick={handleClearSelection}>
                  Clear
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cart Section */}
      <div id="print-section" style={{ display: "none" }}>
  <h2>Receipt</h2>
  <p>Transaction ID: {transactionId}</p>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {cartItems.map((item) => (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.qty}</td>
          <td>{item.price}</td>
          <td>{item.sum}</td>
        </tr>
      ))}
    </tbody>
  </table>
  <h3>Grand Total: {total}</h3>
</div>

      <h3>Cart</h3>
      <table className="inventory-responsive-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>
                <div className="inventory-quantity-container">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateCartItemQuantity(item._id, item.qty - 1)
                    }
                    disabled={item.qty <= 1}
                  >
                    -
                  </button>
                  <input
                    className="input-inventory"
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateCartItemQuantity(item._id, parseInt(e.target.value))
                    }
                  />
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateCartItemQuantity(item._id, item.qty + 1)
                    }
                    disabled={
                      item.qty >=
                      (products.find((p) => p._id === item._id)?.quantity || 0)
                    }
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{item.sum}</td>
              <td>
                <button
                  className="inventory-remove-btn"
                  onClick={() => removeProductFromCart(item._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="parent">
        <input className="total-input" type="text" value={total} readOnly />
        <button className="inventory-checkout-btn" onClick={clearCart}>
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default Inventory;
