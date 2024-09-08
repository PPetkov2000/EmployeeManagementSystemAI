import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Api from '../../utils/Api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: () => Api.verifyEmail(token),
    retry: false,
    onSuccess: () => {
      toast.success('Email verified successfully.');
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred during email verification');
    },
  });

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLoading && (
            <div className="text-center">
              <p className="text-indigo-600 text-lg">Verifying your email...</p>
            </div>
          )}
          {isSuccess && (
            <div className="text-center">
              <p className="text-green-600 text-lg">Your email has been successfully verified!</p>
              <p className="mt-2 text-gray-600">You will be redirected to the login page shortly.</p>
            </div>
          )}
          {isError && (
            <div className="text-center">
              <p className="text-red-600 text-lg">Verification failed</p>
              <p className="mt-2 text-gray-600">{error.response?.data?.message || 'An error occurred during email verification'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
