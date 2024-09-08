import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import Api from '../../utils/Api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const userState = useAuth();
  const { data: userStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => Api.getUserStats(userState.user?._id),
    enabled: !!userState.user,
    select: (data) => data.data
  });
  const { data: performanceData, isLoading: performanceLoading, error: performanceError } = useQuery({
    queryKey: ['userPerformance'],
    queryFn: () => Api.getUserPerformance(userState.user?._id),
    enabled: !!userState.user,
    select: (data) => data.data
  });

  if (statsLoading || performanceLoading) return <div className="text-center text-2xl font-bold my-6">Loading...</div>;
  if (statsError || performanceError) return <div className="text-center text-2xl font-bold my-6">{(statsError || performanceError)?.response?.data?.message || 'Error loading data'}</div>;

  const departmentData = userStats?.departmentCounts?.map(({ _id, count }) => ({
    name: _id,
    value: count,
  })) || [];

  const performanceChartData = [
    ...performanceData.topPerformers.map(user => ({
      name: `${user.firstName} ${user.lastName}`,
      score: user.performanceScore,
      category: 'Top Performers'
    })),
    ...performanceData.lowPerformers.map(user => ({
      name: `${user.firstName} ${user.lastName}`,
      score: user.performanceScore,
      category: 'Low Performers'
    }))
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="container mx-auto my-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users by Department</h2>
          <PieChart width={240} height={240}>
            <Pie
              data={departmentData}
              cx={100}
              cy={100}
              fill="#8884d8"
              dataKey="value"
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <BarChart width={400} height={300} data={performanceChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
      <div className="mt-6">
        <Link
          to="/admin/performance"
          className="bg-blue-500 hover:bg-blue-700 text-white hover:text-white font-bold py-2 px-4 rounded"
        >
          Manage Performance
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;