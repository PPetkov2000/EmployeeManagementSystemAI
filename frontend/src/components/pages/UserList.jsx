import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { FaEye, FaPlus } from 'react-icons/fa';
import Api from '../../utils/Api';

const UserList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users', currentPage, searchTerm],
    queryFn: () => Api.getUsers(currentPage, 10, searchTerm),
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== searchParams.get('search')) {
        setSearchParams({ page: '1', search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams, searchParams]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search: searchTerm });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 md:max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MdSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams({ page: '1', search: '' });
                }}
                className="bg-transparent border-0 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                &#x2715;
              </button>
            )}
          </div>
          <Link to="/users/create-user" className="flex items-center bg-green-500 hover:bg-green-700 text-white hover:text-white font-bold py-2 px-4 rounded">
            <FaPlus className="mr-2" /> Create User
          </Link>
        </div>
      </div>
      {isLoading && <div className='flex justify-center items-center'>Loading...</div>}
      {error && <div className='flex justify-center items-center'>{error?.response?.data?.message || 'Error fetching users'}</div>}
      {(!usersData || usersData?.users?.length === 0) && <div className='flex justify-center items-center'>No users found</div>}
      {usersData?.users?.length > 0 &&
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
            {usersData.users.map((user) => (
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
      }
      {usersData?.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: usersData.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;