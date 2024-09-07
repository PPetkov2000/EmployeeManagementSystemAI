import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useAuth } from '../AuthProvider';
import Api from '../../utils/Api';

const UserDashboard = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({ mutationFn: Api.requestVacation,
    onSuccess: () => {
      queryClient.invalidateQueries(['vacationDays']);
      toast.success('Vacation request submitted!');
      reset();
      navigate('/my-vacation-requests');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to submit vacation request');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-center text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <Link 
          to="/my-vacation-requests" 
          className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:text-white hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          View My Vacation Requests
        </Link>
      </div>
      <div className="mb-4">
        <h2 className="text-center text-xl font-semibold mb-5">Vacation Days: {user?.vacationDays}</h2>
        <div className="flex justify-center">
          <BarChart width={600} height={300} data={user?.vacationDays}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 1000]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="days" fill="#8884d8" label={{ fill: '#111' }} />
          </BarChart>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-2">
          <label htmlFor="startDate" className="block text-sm font-bold mb-2">Start Date</label>
          <div className="relative">
            <input 
              type="date" 
              id="startDate" 
              {...register('startDate', { required: true })} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            />
            <div className="absolute inset-0" onClick={() => {
              const startDateInput = document.getElementById('startDate');
              if (startDateInput.showPicker) {
                if (document.activeElement === startDateInput) {
                  startDateInput.blur();
                } else {
                  startDateInput.showPicker();
                }
              }
            }}></div>
          </div>
        </div>
        <div className="mb-2">
          <label htmlFor="endDate" className="block text-sm font-bold mb-2">End Date</label>
          <div className="relative">
            <input 
              type="date" 
              id="endDate" 
              {...register('endDate', { required: true })} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            />
            <div className="absolute inset-0" onClick={() => {
              const endDateInput = document.getElementById('endDate');
              if (endDateInput.showPicker) {
                if (document.activeElement === endDateInput) {
                  endDateInput.blur();
                } else {
                  endDateInput.showPicker();
                }
              }
            }}></div>
          </div>
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Request Vacation
        </button>
      </form>
    </div>
  );
};

export default UserDashboard;