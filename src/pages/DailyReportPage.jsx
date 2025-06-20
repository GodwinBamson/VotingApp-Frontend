import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../css/DailyReportPage.css";

const DailyReportPage = () => {
  const [summary, setSummary] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchDate, setSearchDate] = useState("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setLoggedInUser(user);
  }, []);

  useEffect(() => {
    const fetchDailySummary = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/carts/daily-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updated = res.data.map((day) => ({
          ...day,
          percentage: "1%",
          percentageAmount: (day.totalSales * 0.01).toFixed(2),
        }));

        setSummary(updated);
        setFilteredSummary(updated);
      } catch (error) {
        console.error("Error fetching daily sales summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailySummary();
  }, [token]);

  useEffect(() => {
    let data = [...summary];

    if (searchDate) {
      data = data.filter((day) => day.date.includes(searchDate));
    }

    if (fromDate && toDate) {
      data = data.filter((day) => day.date >= fromDate && day.date <= toDate);
    }

    if (paymentTypeFilter) {
      data = data.filter(
        (day) =>
          day.paymentType &&
          day.paymentType.toLowerCase() === paymentTypeFilter.toLowerCase()
      );
    }

    setFilteredSummary(data);
  }, [searchDate, paymentTypeFilter, fromDate, toDate, summary]);

  const formatCurrency = (amount) =>
    `₦${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredSummary.map((day) => ({
        Date: day.date,
        "Payment Type": day.paymentType,
        "Customer Name(s)": day.customerNames,
        "Phone Number(s)": day.customerNums,
        Paid: day.totalPaid,
        Balance: day.totalBalance,
        "Daily Sales": day.totalSales,
        Percentage: day.percentage,
        "Percentage Amount": day.percentageAmount,
        "Logged In User": loggedInUser?.username || "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daily Summary");
    XLSX.writeFile(wb, "DailySalesSummary.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Sales Summary", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Date",
          "Payment Type",
          "Customer Name(s)",
          "Phone Number(s)",
          "Paid",
          "Balance",
          "Sales",
          "Percentage",
          "Percentage Amount",
          "Logged In User",
        ],
      ],
      body: filteredSummary.map((day) => [
        day.date,
        day.paymentType,
        day.customerNames,
        day.customerNums,
        formatCurrency(day.totalPaid),
        formatCurrency(day.totalBalance),
        formatCurrency(day.totalSales),
        day.percentage,
        formatCurrency(day.percentageAmount),
        loggedInUser?.username || "",
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("DailySalesSummary.pdf");
  };

  const totalDailySales = filteredSummary.reduce(
    (acc, day) => acc + parseFloat(day.totalSales),
    0
  );

  const totalPercentageAmount = filteredSummary.reduce(
    (acc, day) => acc + parseFloat(day.percentageAmount),
    0
  );

  const chartData = {
    labels: filteredSummary.map((d) => `${d.date} (${d.paymentType})`),
    datasets: [
      {
        label: "Sales",
        data: filteredSummary.map((d) => d.totalSales),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSummary.slice(indexOfFirstItem, indexOfLastItem);

  const groupByDate = (data) => {
    const grouped = {};
    data.forEach((entry) => {
      const { date, totalSales } = entry;
      if (!grouped[date]) {
        grouped[date] = 0;
      }
      grouped[date] += parseFloat(totalSales);
    });
    return Object.entries(grouped).map(([date, total]) => ({
      date,
      totalSales: total,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Daily Sales Summary</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Export Buttons */}
          <div className="report-files1">
            <button
              onClick={exportToExcel}
              className=".report-btn1"
            >
              Export to Excel
            </button>
            <button
              onClick={exportToPDF}
              className=".report-btn1"
            >
              Export to PDF
            </button>
            {/* <button
              onClick={() => window.print()}
              className=".report-btn1"
            >
              Print Page
            </button> */}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="date"
              className="p-2 border rounded"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <select
              className="p-2 border rounded"
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
            >
              <option value="">All Payment Types</option>
              <option value="Cash">Cash</option>
              <option value="POS">POS</option>
              <option value="Transfer">Transfer</option>
              {/* <option value="Online">Online</option> */}
            </select>
            <input
              type="text"
              placeholder="Search by Date"
              className="p-2 border rounded"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-green-100 border border-green-400 rounded-lg text-green-800">
              <h3 className="text-lg font-semibold">Total Daily Sales</h3>
              <p className="text-2xl">{formatCurrency(totalDailySales)}</p>
            </div>
            <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg text-blue-800">
              <h3 className="text-lg font-semibold">Total Percentage Amount</h3>
              <p className="text-2xl">
                {formatCurrency(totalPercentageAmount)}
              </p>
            </div>
          </div>

          {/* Grouped Table */}
          <div className="bg-white p-4 border rounded mb-6 shadow">
            <h3 className="text-lg font-bold mb-4">
              Daily Sales Totals (Grouped)
            </h3>
            <table className="report-table-container1">
              <thead className="bg-gray-100">
                <tr className="report-table-container1-tr">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {groupByDate(filteredSummary).map((day, index) => (
                  <tr key={index} className="report-container-1-tbody-tr">
                    <td className="border p-2">{day.date}</td>
                    <td className="border p-2">
                      {formatCurrency(day.totalSales)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-semibold report-container-1-tbody-tr">
                  <td className="border p-2">Grand Total</td>
                  <td className="border p-2">
                    {formatCurrency(
                      groupByDate(filteredSummary).reduce(
                        (acc, day) => acc + day.totalSales,
                        0
                      )
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-bold mb-2">Sales Chart</h3>
            <Bar data={chartData} />
          </div>

          {/* Full Table */}
          <div className="report-table-parent">
            <table className="report-table-containe">
            <thead>
              <tr className="bg-gray-100 tr-2">
                <th className="border p-2">Date</th>
                <th className="border p-2">Payment Type</th>
                <th className="border p-2">Customer Name(s)</th>
                <th className="border p-2">Phone Number(s)</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Balance</th>
                <th className="border p-2">Sales</th>
                {/* <th className="border p-2">Percentage</th>
                <th className="border p-2">Percentage Amount</th> */}
                <th className="border p-2">Logged In User</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((day, index) => (
                <tr key={index} className="tr-2">
                  <td className="border p-2">{day.date}</td>
                  <td className="border p-2">{day.paymentType}</td>
                  <td className="border p-2">{day.customerNames}</td>
                  <td className="border p-2">{day.customerNums}</td>
                  <td className="border p-2">
                    {formatCurrency(day.totalPaid)}
                  </td>
                  <td className="border p-2">
                    {formatCurrency(day.totalBalance)}
                  </td>
                  <td className="border p-2">
                    {formatCurrency(day.totalSales)}
                  </td>
                  {/* <td className="border p-2">{day.percentage}</td>
                  <td className="border p-2">
                    {formatCurrency(day.percentageAmount)}
                  </td> */}

                  <td className="border p-2">{loggedInUser?.username || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          {/* Pagination */}
          <div className="pagination-controls1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(filteredSummary.length / itemsPerPage)
                    ? prev + 1
                    : prev
                )
              }
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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




