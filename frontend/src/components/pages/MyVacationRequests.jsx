import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import Api from '../../utils/Api';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const MyVacationRequests = () => {
  const { user } = useAuth();

  const { data: vacationRequests, isLoading, error } = useQuery({
    queryKey: ['myVacationRequests', user?._id],
    queryFn: () => Api.getVacationRequestsByUserId(user?._id),
    enabled: !!user?._id,
    select: (data) => data.data
  });

  const handleApprove = (requestId) => {
    Api.updateVacationRequest(requestId, 'Approved');
  };

  const handleDecline = (requestId) => {
    Api.updateVacationRequest(requestId, 'Declined');
  };

  return (
    <div className="container max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-center text-4xl font-bold mb-6">My Vacation Requests</h1>
      {isLoading ? (
          <div className="text-center">Loading...</div>
      ) : error ? (
          <div className="text-center">Error: {error.message}</div>
      ) : !vacationRequests || vacationRequests.length === 0 ? (
          <div className="text-center">No vacation requests found</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider text-left">Start Date</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">End Date</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vacationRequests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 text-left">{new Date(request.startDate).toLocaleDateString()}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 text-center">{new Date(request.endDate).toLocaleDateString()}</td>
                <td className="py-4 px-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link to={`/vacation-requests/${request._id}`} className="text-blue-600 hover:text-blue-900">
                      <FaEye className="h-5 w-5" />
                    </Link>
                    {(user.role === 'manager' || user.role === 'admin') && request.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(request._id)}
                          className="bg-transparent text-green-600 hover:text-green-900 p-1 border-none"
                          title="Approve"
                        >
                          <FaCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDecline(request._id)}
                          className="bg-transparent text-red-600 hover:text-red-900 p-1 border-none"
                          title="Decline"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyVacationRequests;