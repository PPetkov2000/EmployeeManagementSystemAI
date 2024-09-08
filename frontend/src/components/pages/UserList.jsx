import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaEye, FaPlus } from 'react-icons/fa';
import Api from '../../utils/Api';

const UserList = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: Api.getUsers,
    select: (data) => data.data,
  });

  const mutation = useMutation({
    mutationFn: (userId) => Api.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error?.response?.data?.message || 'Error fetching users'}</div>;
  if (!users || users?.length === 0) return <div>No users found</div>;

  return (
    <div className="container mx-auto p-4 md:max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <Link to="/users/create-user" className="flex items-center bg-green-500 hover:bg-green-700 text-white hover:text-white font-bold py-2 px-4 rounded">
          <FaPlus className="mr-2" /> Create User
        </Link>
      </div>
      <table className="min-w-full bg-white text-black">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-center">Role</th>
            <th className="py-2 px-4 border-b text-center">Position</th>
            <th className="py-2 px-4 border-b text-center">Department</th>
            <th className="py-2 px-4 border-b text-center">Created At</th>
            <th className="py-2 px-4 border-b text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b text-left">{user.email}</td>
              <td className="py-2 px-4 border-b text-center">{user.role}</td>
              <td className="py-2 px-4 border-b text-center">{user.position}</td>
              <td className="py-2 px-4 border-b text-center">{user.department}</td>
              <td className="py-2 px-4 border-b text-center">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b text-right">
                <div className="flex justify-end space-x-2">
                  <Link to={`/users/${user._id}`} className="border-0 text-gray-500 hover:text-black p-1 rounded transition duration-300 ease-in-out">
                    <FaEye className="h-5 w-5" />
                  </Link>
                  <Link to={`/users/${user._id}/edit`} className="border-0 text-blue-500 hover:text-blue-900 p-1 rounded transition duration-300 ease-in-out">
                    <MdEdit className="h-5 w-5" />
                  </Link>
                  <button onClick={() => mutation.mutate(user._id)} className="bg-transparent border-0 text-red-500 hover:text-red-900 p-1 rounded transition duration-300 ease-in-out">
                    <MdDelete className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;