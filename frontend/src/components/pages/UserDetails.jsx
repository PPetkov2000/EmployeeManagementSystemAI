import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Api from '../../utils/Api';

const UserDetails = () => {
  const { id } = useParams();

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => Api.getUser(id),
    select: (data) => data.data,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to fetch user details');
    },
  });

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">{error?.response?.data?.message || 'Error fetching user details'}</div>;
  if (!user) return <div className="text-center mt-8">No user found</div>;

  return (
    <div className="container mx-auto p-4 my-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-3xl">
        <div className="p-8">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">User Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="Username" value={user.username} />
            <DetailItem label="Name" value={`${user.firstName} ${user.lastName}`} />
            <DetailItem label="Position" value={user.position} />
            <DetailItem label="Department" value={user.department} />
            <DetailItem label="Salary" value={user.salary} />
            <DetailItem label="Vacation Days" value={user.vacationDays} />
            <DetailItem label="Role" value={user.role} />
            <DetailItem label="Created At" value={new Date(user.createdAt).toLocaleString()} />
            <DetailItem label="Updated At" value={new Date(user.updatedAt).toLocaleString()} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="ml-2 text-gray-800">{value}</span>
  </div>
);

export default UserDetails;