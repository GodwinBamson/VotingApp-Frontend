
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/DailyReportPage.css";

const DailyReportPage = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [searchDate, setSearchDate] = useState(""); // For search by date

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDailySummary = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/carts/daily-summary`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedSummary = res.data.map(day => ({
          ...day,
          percentage: "1%",
          percentageAmount: (day.totalSales * 0.01).toFixed(2)
        }));

        setSummary(updatedSummary);
      } catch (error) {
        console.error("Error fetching daily sales summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailySummary();
  }, [token]);

  const totalPercentageAmount = summary.reduce(
    (acc, day) => acc + parseFloat(day.percentageAmount),
    0
  );

  const totalDailySales = summary.reduce(
    (acc, day) => acc + parseFloat(day.totalSales),
    0
  );

  const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(summary.map(day => ({
      Date: day.date,
      "Daily Sales": day.totalSales,
      Percentage: day.percentage,
      "Percentage Amount": day.percentageAmount
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daily Summary");
    XLSX.writeFile(wb, "DailySalesSummary.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Sales Summary", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [['Date', 'Daily Sales', 'Percentage', 'Percentage Amount']],
      body: summary.map(day => [
        day.date,
        formatCurrency(day.totalSales),
        day.percentage,
        formatCurrency(day.percentageAmount)
      ])
    });
    doc.save("DailySalesSummary.pdf");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = summary.slice(indexOfFirstItem, indexOfLastItem);

  // Search function
  const filteredSummary = searchDate
    ? currentItems.filter(day => day.date.includes(searchDate))
    : currentItems;

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(summary.length / itemsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Daily Sales Summary</h2>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="flex gap-4 mb-4">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            >
              Export to Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
            >
              Export to PDF
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by date"
              className="p-2 border border-gray-400 rounded"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-green-100 border border-green-400 rounded-lg shadow text-green-800">
              <h3 className="text-lg font-semibold">Total Daily Sales</h3>
              <p className="text-2xl">{formatCurrency(totalDailySales)}</p>
            </div>
            <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg shadow text-blue-800">
              <h3 className="text-lg font-semibold">Total Percentage Amount</h3>
              <p className="text-2xl">{formatCurrency(totalPercentageAmount)}</p>
            </div>
          </div>

          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="daily-report-head">
                <th className="border p-2">Day</th>
                <th className="border p-2">Daily Sales</th>
                <th className="border p-2">Percentage</th>
                <th className="border p-2">Percentage Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredSummary.map((day, index) => (
                <tr key={index} className="daily-report-body">
                  <td className="border p-2">{day.date}</td>
                  <td className="border p-2">{formatCurrency(day.totalSales)}</td>
                  <td className="border p-2">{day.percentage}</td>
                  <td className="border p-2">{formatCurrency(day.percentageAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex daily-report-div mt-4">
            <button
              onClick={prevPage}
              className="bg-blue-600 text-white px-4 py-2 daily-report-button rounded shadow hover:bg-blue-700"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              className="bg-blue-600 text-white px-4 py-2 daily-report-button rounded shadow hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyReportPage;
