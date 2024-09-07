import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Api from '../../utils/Api';

const EmployeeDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: employee, isLoading } = useQuery(['employee', id], () => Api.getEmployee(id), {
    onSuccess: (data) => reset(data),
  });

  const mutation = useMutation((data) => Api.updateEmployee(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['employee', id]);
      toast.success('Employee updated successfully');
    },
    onError: () => {
      toast.error('Failed to update employee');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, _id: id });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            id="name"
            type="text"
            {...register('name', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
            Position
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            id="position"
            type="text"
            {...register('position', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vacationDays">
            Vacation Days
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            id="vacationDays"
            type="number"
            {...register('vacationDays', { required: true, min: 0 })}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeDetails;