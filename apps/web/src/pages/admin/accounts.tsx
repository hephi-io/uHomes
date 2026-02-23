import { SVGs } from '@/assets/svgs/Index';
import { UserColumn, type IUser } from '@/shared/users';
import Tableshared from '@/shared/table';
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
} from '@uhomes/ui-kit';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers, type AdminUser } from '@/services/admin';

function mapUser(u: AdminUser): IUser {
  return {
    id: u._id,
    fullName: u.fullName,
    email: u.email,
    phoneNumber: u.phoneNumber,
    userType: u.userType ?? null,
    isVerified: u.isVerified,
    createdAt: u.createdAt,
  };
}

const Accounts = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filters = {
    page: 1,
    limit: 10,
    ...(search && { search }),
    ...(statusFilter !== 'all' && { status: statusFilter as 'active' | 'inactive' }),
    ...(typeFilter !== 'all' && { type: typeFilter as 'student' | 'agent' | 'admin' }),
  };

  const {
    data: usersData,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ['adminUsers', search, statusFilter, typeFilter],
    queryFn: async () => {
      const response = await getAllUsers(filters);
      if (response.data.status !== 'success') throw new Error('Failed to load users');
      return response.data.data;
    },
  });

  useEffect(() => {
    if (!isError || !error) return;
    const message =
      error instanceof AxiosError
        ? error.response?.data?.error || error.response?.data?.message || 'Failed to load users'
        : 'An unexpected error occurred';
    toast.error(message);
  }, [isError, error]);

  const { data: stats = { totalUsers: 0, agents: 0, students: 0, active: 0, suspended: 0 } } =
    useQuery({
      queryKey: ['adminUsersStats'],
      queryFn: async () => {
        const [allUsers, agents, students, active, inactive] = await Promise.all([
          getAllUsers({ limit: 1 }),
          getAllUsers({ type: 'agent', limit: 1 }),
          getAllUsers({ type: 'student', limit: 1 }),
          getAllUsers({ status: 'active', limit: 1 }),
          getAllUsers({ status: 'inactive', limit: 1 }),
        ]);
        return {
          totalUsers: allUsers.data.status === 'success' ? allUsers.data.data.pagination.total : 0,
          agents: agents.data.status === 'success' ? agents.data.data.pagination.total : 0,
          students: students.data.status === 'success' ? students.data.data.pagination.total : 0,
          active: active.data.status === 'success' ? active.data.data.pagination.total : 0,
          suspended: inactive.data.status === 'success' ? inactive.data.data.pagination.total : 0,
        };
      },
    });

  const users: IUser[] = usersData?.users?.map(mapUser) ?? [];

  const statsData = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      color: 'bg-gradient-to-b from-[#E1EAFD] to-white',
      border: 'border-[#CBDBFC]',
    },
    {
      label: 'Agents',
      value: stats.agents.toLocaleString(),
      color: 'bg-gradient-to-b from-[#C8FFDC] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Students',
      value: stats.students.toLocaleString(),
      color: 'bg-gradient-to-b from-[#FEECE0] to-white',
      border: 'border-[#FFE0D3]',
    },
    {
      label: 'Active',
      value: stats.active.toLocaleString(),
      color: 'bg-gradient-to-b from-[#D8F6FF] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Suspended',
      value: stats.suspended.toLocaleString(),
      color: 'bg-gradient-to-b from-[#FA350766] to-white',
      border: 'border-[#FF383C66]',
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <h1 className="font-semibold text-[22px] leading-[120%] tracking-[0%] text-black">
        Accounts Management
      </h1>
      <p className="text-sm leading-[120%] tracking-[0%] text-black mt-1">
        Review and manage users account, permission and status
      </p>
      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4 mt-4">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className={`rounded border ${stat.border} ${stat.color} shadow-sm transition-all hover:shadow-md py-6 px-7`}
          >
            <h3 className="font-semibold text-[24px] mb-1 leading-[100%] tracking-[0%] text-[#09090B]">
              {stat.value}
            </h3>
            <p className="font-semibold text-sm leading-[100%] tracking-[0%] text-[#71717A] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-[#E4E7EC] shadow-[0px_1px_2px_0px_#1018280D] overflow-hidden mt-4">
        <div className="flex items-center justify-between px-4">
          <div className="relative max-w-sm w-full ">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SVGs.MagnifyingGlass className="size-4" />
            </span>
            <Input
              type="search"
              placeholder="Search by name, email or phone number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[10px] border-[0.8px] border-[#D1D5DC] text-base leading-[100%] tracking-normal text-[#0A0A0A80] focus:text-black focus:ring-1 focus:ring-blue-500 pl-9 pr-4 py-4"
            />
          </div>

          <div className="flex justify-end items-center gap-4 p-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-28 rounded border-[#E4E4E4] bg-white font-Bricolage font-medium text-sm leading-[150%] tracking-[0%] text-black px-3 py-2">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="agent">Agents</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 rounded border-[#E4E4E4] bg-white font-Bricolage font-medium text-sm leading-[150%] tracking-[0%] text-black px-3 py-2">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-[37px] border-l border-l-[#E4E4E4]"></div>
            <Button className="flex gap-2 items-center rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-blue-600 px-4 py-2">
              <SVGs.AddProperty className="size-4" />
              <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                Create Ad Campaign
              </span>
            </Button>
          </div>
        </div>
        <div className="border-t border-t-[#E4E7EC]"></div>
        <div className="p-4">
          {loading ? (
            <div className="p-4 text-center text-[#878FA1]">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-[#878FA1]">No users found</div>
          ) : (
            <Tableshared columns={UserColumn} data={users} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
