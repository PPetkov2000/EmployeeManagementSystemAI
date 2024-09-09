import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Api from '../../utils/Api';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [avatar, setAvatar] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const { data: user, isLoading, isError } = useQuery({ queryKey: ['user', id], queryFn: () => Api.getUser(id), select: (data) => data.data });

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

    const updateUserMutation = useMutation({
        mutationFn: (data) => Api.updateUser(id, data),
        onSuccess: () => {
            toast.success('User updated successfully!');
            navigate('/users');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error updating user. Please try again.');
        },
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (avatar) {
            formData.append('avatar', avatar);
        }
        updateUserMutation.mutate(formData);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
            setAvatar(file);
        } else {
            toast.error('Please select a valid image file (max 5MB)');
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClasses = "bg-[#ddd] text-black w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600";
        return `${baseClasses} ${errors[fieldName] ? "border-red-500" : ""}`;
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading user data</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div className="flex items-center justify-center min-min-h-[calc(100vh-56px)] bg-gray-100">
            <div className="px-8 py-6 my-8 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
                <h3 className="text-2xl font-bold text-center text-black">Edit User</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-4">
                        <label className="block text-black" htmlFor="email">Email</label>
                        <input type="email" placeholder="Email" id="email"
                            className={getInputClassName('email')}
                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                        />
                        {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
                    </div>
                    <div className="mt-4 relative">
                        <label className="block text-black" htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            id="password"
                            className={getInputClassName('password')}
                            {...register('password', {
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`bg-transparent border-0 absolute right-2 ${errors.password ? 'top-[35%]' : 'top-[57%]'} transform -translate-y-1/2 text-gray-500 focus:outline-none`}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
                        <p className="text-xs text-gray-600 mt-1">Leave blank to keep current password</p>
                    </div>
                    <div className="mt-4">
                        <div>
                            <label className="block text-black" htmlFor="username">Username</label>
                            <input type="text" placeholder="Username" id="username"
                                className={getInputClassName('username')}
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Username must be at least 3 characters long' },
                                    maxLength: { value: 20, message: 'Username must not exceed 20 characters' }
                                })}
                            />
                            {errors.username && <span className="text-xs text-red-600">{errors.username.message}</span>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div>
                            <label className="block text-black" htmlFor="firstName">First Name</label>
                            <input type="text" placeholder="First Name" id="firstName"
                                className={getInputClassName('firstName')}
                                {...register('firstName', {
                                    required: 'First name is required',
                                    pattern: { value: /^[A-Za-z]+$/, message: 'First name should only contain letters' }
                                })}
                            />
                            {errors.firstName && <span className="text-xs text-red-600">{errors.firstName.message}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-black" htmlFor="lastName">Last Name</label>
                            <input type="text" placeholder="Last Name" id="lastName"
                                className={getInputClassName('lastName')}
                                {...register('lastName', {
                                    required: 'Last name is required',
                                    pattern: { value: /^[A-Za-z]+$/, message: 'Last name should only contain letters' }
                                })}
                            />
                            {errors.lastName && <span className="text-xs text-red-600">{errors.lastName.message}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-black" htmlFor="position">Position</label>
                            <input type="text" placeholder="Position" id="position"
                                className={getInputClassName('position')}
                                {...register('position', { required: 'Position is required' })}
                            />
                            {errors.position && <span className="text-xs text-red-600">{errors.position.message}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-black" htmlFor="department">Department</label>
                            <input type="text" placeholder="Department" id="department"
                                className={getInputClassName('department')}
                                {...register('department', { required: 'Department is required' })}
                            />
                            {errors.department && <span className="text-xs text-red-600">{errors.department.message}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-black" htmlFor="salary">Salary</label>
                            <input type="number" placeholder="Salary" id="salary"
                                className={getInputClassName('salary')}
                                {...register('salary', { required: 'Salary is required', min: { value: 0, message: 'Salary must be positive' } })}
                            />
                            {errors.salary && <span className="text-xs text-red-600">{errors.salary.message}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-black" htmlFor="vacationDays">Vacation Days</label>
                            <input type="number" placeholder="Vacation Days" id="vacationDays"
                                className={getInputClassName('vacationDays')}
                                {...register('vacationDays', { required: 'Vacation days are required', min: { value: 0, message: 'Vacation days must be non-negative' } })}
                            />
                            {errors.vacationDays && <span className="text-xs text-red-600">{errors.vacationDays.message}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-black" htmlFor="role">Role</label>
                            <select
                                id="role"
                                className={getInputClassName('role')}
                                {...register('role', { required: 'Role is required' })}
                            >
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <span className="text-xs text-red-600">{errors.role.message}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-black" htmlFor="avatar">Avatar</label>
                            {user.avatar && (
                                <img src={`${import.meta.env.VITE_API_URL}${user.avatar}`} alt="Current avatar" className="w-20 h-20 object-cover rounded-full mb-2" />
                            )}
                            <input type="file" id="avatar" accept="image/*"
                                className={getInputClassName('avatar')}
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center text-black">
                                <input type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    {...register('isVerified')}
                                />
                                <span className="ml-2">Is Verified</span>
                            </label>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <button type="submit"
                                className="w-full px-6 py-2 mt-8 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
                                disabled={updateUserMutation.isLoading}
                            >
                                {updateUserMutation.isLoading ? 'Updating...' : 'Update User'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
