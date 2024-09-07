import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import Api from '../../utils/Api';

const AdminDashboard = () => {
  const { data: employeeStats, isLoading, error } = useQuery({ queryKey: ['employeeStats'], queryFn: Api.getEmployeeStats });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.response?.data?.message || error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Employee Status</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={employeeStats}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {employeeStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      <Link
        to="/employees"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Manage Employees
      </Link>
    </div>
  );
};

export default AdminDashboard;