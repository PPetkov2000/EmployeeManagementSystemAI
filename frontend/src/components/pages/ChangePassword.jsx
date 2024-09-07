import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const changePassword = async (passwordData) => {
  const token = localStorage.getItem('auth-token');
  const response = await axios.post('http://localhost:5000/api/auth/change-password', passwordData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred while changing the password');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Change your password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1">
                <input
                  id="currentPassword"
                  type="password"
                  {...register('currentPassword', { required: 'Current password is required' })}
                  className="bg-[#ddd] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.currentPassword && <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  type="password"
                  {...register('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    }
                  })}
                  className="bg-[#ddd] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmNewPassword"
                  type="password"
                  {...register('confirmNewPassword', { 
                    required: 'Confirm new password is required',
                    validate: (value, formValues) => value === formValues.newPassword || 'Passwords do not match'
                  })}
                  className="bg-[#ddd] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.confirmNewPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmNewPassword.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {mutation.isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>

          {mutation.isError && <div className="mt-2 text-sm text-red-600">Error: {mutation.error.response?.data?.message || 'An error occurred'}</div>}
          {mutation.isSuccess && <div className="mt-2 text-sm text-green-600">Password changed successfully.</div>}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
