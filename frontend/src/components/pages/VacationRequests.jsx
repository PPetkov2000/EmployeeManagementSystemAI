import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Api from '../../utils/Api';

const VacationRequests = () => {
  const queryClient = useQueryClient();
  const { data: requests, isLoading } = useQuery(['vacationRequests'], Api.getVacationRequests);

  const mutation = useMutation(({ id, status }) => Api.updateVacationRequest(id, status), {
    onSuccess: () => {
      queryClient.invalidateQueries(['vacationRequests']);
      toast.success('Vacation request updated');
    },
    onError: () => {
      toast.error('Failed to update vacation request');
    },
  });

  const handleStatusChange = (id, status) => {
    mutation.mutate({ id, status });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vacation Requests</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Start Date</th>
            <th className="py-2 px-4 border-b">End Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td className="py-2 px-4 border-b">{request.employee.name}</td>
              <td className="py-2 px-4 border-b">{new Date(request.startDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{new Date(request.endDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{request.status}</td>
              <td className="py-2 px-4 border-b">
                {request.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(request._id, 'Approved')}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(request._id, 'Denied')}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Deny
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VacationRequests;