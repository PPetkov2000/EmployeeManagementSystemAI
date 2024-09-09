import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Api from '../../utils/Api';

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: (passwordData) => Api.changePassword(passwordData),
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
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 flex flex-col justify-center sm:px-6 lg:px-8">
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
              <div className="mt-1 relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...register('currentPassword', { required: 'Current password is required' })}
                  className="bg-[#ddd] text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="bg-transparent border-0 absolute right-2 top-[50%] transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.currentPassword && <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    }
                  })}
                  className="bg-[#ddd] text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="bg-transparent border-0 absolute right-2 top-[50%] transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmNewPassword', {
                    required: 'Confirm new password is required',
                    validate: (value, formValues) => value === formValues.newPassword || 'Passwords do not match'
                  })}
                  className="bg-[#ddd] text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="bg-transparent border-0 absolute right-2 top-[50%] transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
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

          {mutation.isError && <div className="mt-2 text-sm text-red-600">{mutation.error.response?.data?.message || 'An error occurred'}</div>}
          {mutation.isSuccess && <div className="mt-2 text-sm text-green-600">Password changed successfully.</div>}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
