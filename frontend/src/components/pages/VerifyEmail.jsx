import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const verifyEmail = async (token) => {
  const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
  return response.data;
};

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: () => verifyEmail(token),
    retry: false,
    onSuccess: () => {
      toast.success('Email verified successfully.');
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred during email verification');
    },
  });

  // ... rest of the component remains the same
};

export default VerifyEmail;
