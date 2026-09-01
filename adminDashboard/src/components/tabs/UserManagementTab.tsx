import React from 'react';
import { Search, UserPlus, Flame, Eye, Pencil, Trash2 } from 'lucide-react';
import { UserItem, Exam } from '../../types';

interface UserManagementTabProps {
  users: UserItem[];
  exams: Exam[];
  filteredUsers: UserItem[];
  userSearch: string;
  setUserSearch: (s: string) => void;
  userRoleFilter: string | null;
  setUserRoleFilter: (role: string | null) => void;
  onCreateNewUser: () => void;
  onEditUser: (user: UserItem) => void;
  onViewUser: (user: UserItem) => void;
  onDeleteUser: (id: number) => void;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  exams,
  filteredUsers,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  onCreateNewUser,
  onEditUser,
  onViewUser,
  onDeleteUser,
}) => {
  return (
    <div className="space-y-6">
      {/* User stats overview cards - clean monochrome */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-normal text-slate-500 uppercase tracking-wider">Total Users</p>
          <p className="text-base font-normal text-black mt-1">{users.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-normal text-slate-500 uppercase tracking-wider">Administrators</p>
          <p className="text-base font-normal text-black mt-1">{users.filter((u) => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-normal text-slate-500 uppercase tracking-wider">Candidates</p>
          <p className="text-base font-normal text-black mt-1">{users.filter((u) => u.role !== 'admin').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-normal text-slate-500 uppercase tracking-wider">Target Exams</p>
          <p className="text-base font-normal text-black mt-1">{exams.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>
          <button
            onClick={onCreateNewUser}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-normal transition shadow-sm shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Create User
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-normal text-slate-500 uppercase tracking-wider mr-1">Role:</span>
          <button
            onClick={() => setUserRoleFilter(null)}
            className={`px-3 py-1 rounded-lg text-xs font-normal transition cursor-pointer ${
              !userRoleFilter ? 'bg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setUserRoleFilter(userRoleFilter === 'admin' ? null : 'admin')}
            className={`px-3 py-1 rounded-lg text-xs font-normal transition cursor-pointer ${
              userRoleFilter === 'admin' ? 'bg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setUserRoleFilter(userRoleFilter === 'candidate' ? null : 'candidate')}
            className={`px-3 py-1 rounded-lg text-xs font-normal transition cursor-pointer ${
              userRoleFilter === 'candidate' ? 'bg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Candidates
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-normal text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 font-normal">Candidate / User</th>
                <th className="py-3.5 px-4 font-normal">Role</th>
                <th className="py-3.5 px-4 font-normal">Target Exam</th>
                <th className="py-3.5 px-4 font-normal">Study Streak</th>
                <th className="py-3.5 px-4 font-normal">Joined Date</th>
                <th className="py-3.5 px-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-normal">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.userId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-black border border-slate-200 flex items-center justify-center font-normal text-xs shrink-0 shadow-2xs">
                          {u.firstName?.[0] || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-normal text-black truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-slate-500 truncate font-normal">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-100 text-black border border-slate-200">
                        {u.role === 'admin' ? 'Admin' : 'Candidate'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-black font-normal">
                        {u.targetExam?.examName || u.targetSubject || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-normal text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        <Flame className="w-3 h-3 text-slate-500" /> {u.streakDays || 0}d
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-normal">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewUser(u)}
                          className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="View User Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditUser(u)}
                          className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Edit User"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteUser(u.userId)}
                          className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
