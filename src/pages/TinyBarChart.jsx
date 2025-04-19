
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from 'axios';

const TinyBarChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch data for the specific admin's chart
    const fetchChartData = async () => {
      try {
        const response = await axios.get('/api/dashboards/dashboard'); // Protected route to fetch admin's data
        setChartData(response.data); // Update chart data based on the response
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Bar dataKey="available" fill="#4caf50" name="Available" />
          <Bar dataKey="sold" fill="#f44336" name="Sold" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;
