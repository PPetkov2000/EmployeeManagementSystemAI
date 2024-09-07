import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthProvider';
import Api from '../../utils/Api';

const VacationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: vacationRequestDetails, isLoading, isError, error } = useQuery({
    queryKey: ['vacationRequest', id],
    queryFn: () => Api.getVacationRequestDetails(id),
    select: (data) => data.data,
  });

  const approveMutation = useMutation({
    mutationFn: () => Api.updateVacationRequest(id, 'Approved'),
    onSuccess: () => {
      toast.success('Vacation request approved');
      queryClient.invalidateQueries(['vacationRequest', id]);
      navigate('/vacation-requests');
    },
    onError: () => {
      toast.error('Failed to approve vacation request');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => Api.updateVacationRequest(id, 'Declined'),
    onSuccess: () => {
      toast.success('Vacation request rejected');
      queryClient.invalidateQueries(['vacationRequest', id]);
      navigate('/vacation-requests');
    },
    onError: () => {
      toast.error('Failed to reject vacation request');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!vacationRequestDetails) return <div>Vacation request not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Vacation Request Details</h2>
      <div className="text-black space-y-4">
        <p><span className="font-semibold">Employee:</span> {vacationRequestDetails.employee.email}</p>
        <p><span className="font-semibold">Start Date:</span> {new Date(vacationRequestDetails.startDate).toLocaleDateString()}</p>
        <p><span className="font-semibold">End Date:</span> {new Date(vacationRequestDetails.endDate).toLocaleDateString()}</p>
        <p>
          <span className="font-semibold">Status:</span>
          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
            vacationRequestDetails.status === 'Pending' ? 'text-yellow-600' :
            vacationRequestDetails.status === 'Approved' ? 'text-green-800' :
            vacationRequestDetails.status === 'Declined' ? 'text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {vacationRequestDetails.status}
          </span>
        </p>
        <p><span className="font-semibold">Submitted On:</span> {new Date(vacationRequestDetails.createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Reason:</span> {vacationRequestDetails.reason || 'No reason provided'}</p>
      </div>
      {(user.role === 'manager' || user.role === 'admin') && vacationRequestDetails.status === 'Pending' && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => approveMutation.mutate()}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Approve
          </button>
          <button
            onClick={() => rejectMutation.mutate()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default VacationRequestDetails;
