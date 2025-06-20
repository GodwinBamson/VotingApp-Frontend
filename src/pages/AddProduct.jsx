
// import { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/AddProduct.css";
// import { FaPen, FaTrash } from "react-icons/fa";
// import { BASE_URL } from "../../config";
// import { showSuccess, showError } from "../utils/toastService";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [products, setProducts] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   const token = localStorage.getItem("token");
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const { data } = await axios.get(`${BASE_URL}/api/products/products`, config);
//       setProducts(data.products || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       showError("Error fetching products");
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   console.log("Form submitted"); // <- add this line

//   //   try {
//   //     if (editing) {
//   //       let updatedProduct = {
//   //         name,
//   //         price: Number(price),
//   //         quantity: Number(quantity),
//   //       };

//   //       if (Number(quantity) > editing.quantity) {
//   //         updatedProduct.sold = 0;
//   //       }

//   //       const res = await axios.put(
//   //         `${BASE_URL}/api/products/${editing._id}`,
//   //         updatedProduct,
//   //         config
//   //       );
//   //       if (res.data.updated) {
//   //         setProducts((prev) =>
//   //           prev.map((p) => (p._id === editing._id ? res.data.product : p))
//   //         );
//   //         showSuccess("Product updated successfully");
//   //       }
//   //     } else {
//   //       const newProduct = {
//   //         name,
//   //         price: Number(price),
//   //         quantity: Number(quantity),
//   //       };
//   //       const res = await axios.post(`${BASE_URL}/api/products/add`, newProduct, config);
//   //       if (res.data.added) {
//   //         setProducts((prev) => [...prev, res.data.product]);
//   //         showSuccess("Product added successfully");
//   //       }
//   //     }
//   //     resetForm();
//   //   } catch (error) {
//   //     console.error("Error submitting product:", error.response?.data || error.message);
//   //     showError(error.response?.data?.message || "Error submitting product");
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submitted");
  
//     try {
//       if (editing) {
//         let updatedProduct = {
//           name,
//           price: Number(price),
//           quantity: Number(quantity),
//         };
  
//         // Reset sold to 0 if quantity increased
//         if (Number(quantity) > editing.quantity) {
//           updatedProduct.sold = 0;
//         }
  
//         const res = await axios.put(
//           `${BASE_URL}/api/products/${editing._id}`,
//           updatedProduct,
//           config
//         );
  
//         console.log("Update response:", res.data);
  
//         // ✅ Check for res.data.product instead of res.data.updated
//         if (res.data.product) {
//           setProducts((prev) =>
//             prev.map((p) => (p._id === editing._id ? res.data.product : p))
//           );
//           showSuccess("Product updated successfully");
//         }
//       } else {
//         const newProduct = {
//           name,
//           price: Number(price),
//           quantity: Number(quantity),
//         };
  
//         const res = await axios.post(`${BASE_URL}/api/products/add`, newProduct, config);
//         console.log("Add response:", res.data);
  
//         if (res.data.added) {
//           setProducts((prev) => [...prev, res.data.product]);
//           showSuccess("Product added successfully");
//         }
//       }
  
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting product:", error.response?.data || error.message);
//       showError(error.response?.data?.message || "Error submitting product");
//     }
//   };
  
//   const deleteProduct = async (id) => {
//     try {
//       const res = await axios.delete(`${BASE_URL}/api/products/${id}`, config);
//       if (res.data.deleted) {
//         setProducts((prev) => prev.filter((product) => product._id !== id));
//         showSuccess("Product deleted successfully");
//       }
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       showError("Error deleting product");
//     }
//   };

//   const startEditing = (product) => {
//     setEditing(product);
//     setName(product.name);
//     setPrice(product.price);
//     setQuantity(product.quantity);
//   };

//   const resetForm = () => {
//     setName("");
//     setPrice("");
//     setQuantity("");
//     setEditing(null);
//   };

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const indexOfLastProduct = currentPage * itemsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//   const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

//   return (
//     <div className="add-container">
//       <h1 className="add-product-name">
//         <span>Product </span>Tracker
//       </h1>

//       <div className="add-search-container">
//         <input
//           type="text"
//           placeholder="Search products by name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <div className="add-grid-container">
//         <div className="add-table-container">
//           <table className="add-table-form">
//             <thead className="add-product-head">
//               <tr className="add-product-tab">
//                 <th>Description</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th>Sold</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody className="add-product-body">
//               {currentProducts.length > 0 ? (
//                 currentProducts.map((product) => (
//                   <tr className="add-column" key={product._id}>
//                     <td>{product.name}</td>
//                     <td>{product.price}</td>
//                     <td>{product.quantity}</td>
//                     <td>{product.sold || 0}</td>
//                     <td className="add-product-table">
//                       <button onClick={() => startEditing(product)}>
//                         <FaPen size={15} />
//                       </button>
//                       <button
//                         className="add-product-red"
//                         onClick={() => deleteProduct(product._id)}
//                       >
//                         <FaTrash size={15} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5">No products found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <div className="pagination">
//             <button
//               className="add-product-next"
//               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//             >
//               &laquo; Prev
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 className={`add-product-none ${currentPage === i + 1 ? "active" : ""}`}
//                 onClick={() => setCurrentPage(i + 1)}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               className="add-product-next"
//               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Next &raquo;
//             </button>
//           </div>
//         </div>

//         <div className="add-form-container">
//           <form className="add-product-desrip" onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Description"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             />
//             <button
//               className="add-product-update"
//               type="submit"
//               disabled={!name || !price || !quantity}
//             >
//               {editing ? "Update Product" : "Add Product"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;




import { useEffect, useState } from "react";
import axios from "axios";
import "../css/AddProduct.css";
import { FaPen, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../../config";
import { showSuccess, showError } from "../utils/toastService";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products/products`, config);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showError("Error fetching products");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      if (editing) {
        let updatedProduct = {
          name,
          price: Number(price),
          quantity: Number(quantity),
        };

        if (Number(quantity) > editing.quantity) {
          updatedProduct.sold = 0;
        }

        const res = await axios.put(
          `${BASE_URL}/api/products/${editing._id}`,
          updatedProduct,
          config
        );

        console.log("Update response:", res.data);

        if (res.data.product) {
          setProducts((prev) =>
            prev.map((p) => (p._id === editing._id ? res.data.product : p))
          );
          showSuccess("Product updated successfully");
        }
      } else {
        const newProduct = {
          name,
          price: Number(price),
          quantity: Number(quantity),
        };

        const res = await axios.post(`${BASE_URL}/api/products/add`, newProduct, config);
        console.log("Add response:", res.data);

        if (res.data.added) {
          setProducts((prev) => [...prev, res.data.product]);
          showSuccess("Product added successfully");
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error.response?.data || error.message);
      showError(error.response?.data?.message || "Error submitting product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/products/${id}`, config);
      if (res.data.deleted) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
        showSuccess("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showError("Error deleting product");
    }
  };

  const startEditing = (product) => {
    setEditing(product);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
    setEditing(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  return (
    <div className="add-container">
      <h1 className="add-product-name">
        <span>Product </span>Tracker
      </h1>

      <div className="add-search-container">
        <input
          type="text"
          placeholder="Search products by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="add-grid-container">
        <div className="add-table-container">
          <table className="add-table-form">
            <thead className="add-product-head">
              <tr className="add-product-tab">
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="add-product-body">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr className="add-column" key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.sold || 0}</td>
                    <td className="add-product-table">
                      <button onClick={() => startEditing(product)}>
                        <FaPen size={15} />
                      </button>
                      <button
                        className="add-product-red"
                        onClick={() => deleteProduct(product._id)}
                      >
                        <FaTrash size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No products found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="add-product-next"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &laquo; Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`add-product-none ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="add-product-next"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </div>

        <div className="add-form-container">
          <form className="add-product-desrip" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Description"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="add-product-update"
                type="submit"
                disabled={!name || !price || !quantity}
              >
                {editing ? "Update Product" : "Add Product"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="add-product-cancel"
                  onClick={resetForm}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#000",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
