import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Api from '../../utils/Api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getInputClassName = (fieldName) => {
    const baseClasses = "bg-[#ddd] text-black appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    return `${baseClasses} ${errors[fieldName] ? "border-red-500" : "border-gray-300"}`;
  };

  const mutation = useMutation({
    mutationFn: (data) => Api.resetPassword(token, data.password),
    onSuccess: () => {
      toast.success('Password reset successfully.');
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred while resetting the password');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ token, password: data.password });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    }
                  })}
                  className={getInputClassName('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`bg-transparent border-0 absolute right-2 ${errors.password ? 'top-[28%]' : 'top-[50%]'} transform -translate-y-1/2 text-gray-500 focus:outline-none`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value, formValues) => value === formValues.password || 'Passwords do not match'
                  })}
                  className={getInputClassName('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`bg-transparent border-0 absolute right-2 ${errors.confirmPassword ? 'top-[28%]' : 'top-[50%]'} transform -translate-y-1/2 text-gray-500 focus:outline-none`}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {mutation.isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          {mutation.isError && <div className="mt-2 text-sm text-red-600">{mutation.error.response?.data?.message || 'An error occurred'}</div>}
          {mutation.isSuccess && <div className="mt-2 text-sm text-green-600">Password reset successfully. Redirecting to login...</div>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
