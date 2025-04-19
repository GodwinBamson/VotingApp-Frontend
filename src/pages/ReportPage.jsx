
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/ReportPage.css";
import Modal from "react-modal";
import { AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { BASE_URL } from "../../config";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";  // <-- this line is critical!

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/carts/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [token]);

  const formatDate = (date) => {
    if (!date) return "Invalid Date";
    const formattedDate = new Date(date);
    return isNaN(formattedDate) ? "Invalid Date" : formattedDate.toISOString().split("T")[0];
  };

  const filteredData = reportData.filter((cart) => {
    const matchesSearchQuery = cart.items.some((item) =>
      item.productId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalTransactionAmount = cart.items.reduce((sum, item) => sum + item.totalAmount, 0);
    const matchesAmountQuery = searchQuery === "" || totalTransactionAmount.toString().includes(searchQuery);

    const transactionDate = formatDate(cart.createdAt);
    const matchesDateQuery = !searchDate || transactionDate === searchDate;

    return (matchesSearchQuery || matchesAmountQuery) && matchesDateQuery;
  });

  const groupItemsByTransaction = (data) => {
    const groupedData = {};
    data.forEach(cart => {
        if (!groupedData[cart.transactionId]) {
          groupedData[cart.transactionId] = { ...cart, items: [] };
        }
        groupedData[cart.transactionId].items.push(...cart.items);
      });
    return Object.values(groupedData);
  };

  const groupedReportData = groupItemsByTransaction(filteredData);
  const totalPages = Math.ceil(groupedReportData.length / rowsPerPage);
  const currentPageData = groupedReportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleExport = () => {
    const exportData = currentPageData.map((cart) => {
      const totalAmount = cart.items.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2);
      return {
        "Transaction ID": cart.transactionId,
        "Product Name": cart.items.map((item) => item.productId?.name || "No Name").join(", "),
        Quantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        "Total Amount": totalAmount,
        "Date of Transaction": formatDate(cart.createdAt),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction Data");

    // Export as Excel file
    XLSX.writeFile(workbook, "transaction_data.xlsx");
  };

 
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Title of the PDF
    doc.text("Transaction Report", 20, 20);
  
    const headers = [
      ["Transaction ID", "Product Name", "Quantity", "Unit Price", "Total Amount", "Date of Transaction"]
    ];
  
    const exportData = [];
  
    // Collect data for each item in the transaction
    currentPageData.forEach(cart => {
      cart.items.forEach(item => {
        const productName = item.productId?.name || "No Name";
        const quantity = item.quantity;
        const unitPrice = item.unitPrice ? item.unitPrice.toFixed(2) : "0.00";
        const totalAmount = item.totalAmount ? item.totalAmount.toFixed(2) : "0.00";
        const date = formatDate(cart.createdAt);
  
        exportData.push([
          cart.transactionId,
          productName,
          quantity,
          unitPrice,
          totalAmount,
          date
        ]);
      });
    });
  
    // Add the table with autoTable
    autoTable(doc, {
      startY: 30, // Start Y position after the title
      head: headers,
      body: exportData,
      margin: { top: 20 }, // Add margin to the top of the table
      theme: "grid", // Use grid theme for the table
    });
  
    // Save the PDF with the table
    doc.save("transaction_report.pdf");
  };
  
  
  return (
    <div className="report-container">
      <header>
        <h1 className="report-header"><span>Transaction</span> History</h1>
      </header>

      <div className="report-files">
        <button className="export-btn" onClick={handleExport}>Export to Excel</button>
        <button className="export-btn" onClick={handleExportPDF}>Export to PDF</button>
      </div>

      <div className="report-search-container">
        <input
          type="text"
          placeholder="Search by product name or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          className="report-date"
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="report-loading"><p>Loading...</p></div>
      ) : (
        <div className="report-table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Date of Transaction</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((cart) => {
                  const totalAmount = cart.items.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2);

                  return (
                    <tr key={cart.transactionId}>
                      <td>{cart.transactionId}</td>
                      <td>
                        {cart.items.map((item, index) => (
                          <span key={index}>{item.productId?.name || "No Name"}{index < cart.items.length - 1 ? ", " : ""}</span>
                        ))}
                      </td>
                      <td>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td>₦{Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{formatDate(cart.createdAt)}</td>
                      <td>
                        <button className="report-btn" onClick={() => setSelectedTransaction(cart) & setIsModalOpen(true)} >
                          <AiOutlineEye size={20} />
                        </button>
                        <button className="report-btn-delete" onClick={() => axios.delete(`http://localhost:5000/cart/${cart.transactionId}`)
                          .then(() => setReportData(reportData.filter(c => c.transactionId !== cart.transactionId)))} >
                          <AiFillDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6">No results found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-controls">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo; Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next &raquo;</button>
      </div>

      {/* Modal for Transaction Details */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal" overlayClassName="modal-overlay">
        <h2 className="report-view"><span>Transaction</span> Details</h2>
        {selectedTransaction ? (
          <div>
            <ul>
              {selectedTransaction.items.map((item, index) => (
                <li key={index}>{item.productId?.name}: {item.quantity} x ₦{item.totalAmount}</li>
              ))}
            </ul>
            <p>Total Amount: ₦{selectedTransaction.totalAmount}</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        ) : (
          <p>No transaction details available.</p>
        )}
      </Modal>
    </div>
  );
};

export default ReportPage;
