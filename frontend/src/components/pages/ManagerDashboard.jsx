import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import Api from '../../utils/Api';

const ManagerDashboard = () => {
  const { data: performanceData, isLoading } = useQuery({ queryKey: ['performanceData'], queryFn: Api.getEmployeePerformance });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Team Performance</h2>
        <LineChart width={600} height={300} data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="performance" stroke="#8884d8" />
        </LineChart>
      </div>
      <Link
        to="/vacation-requests"
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Manage Vacation Requests
      </Link>
    </div>
  );
};

export default ManagerDashboard;