import React from 'react';
import { User, Calendar, Mail, Phone } from 'lucide-react';

interface ProfileHeaderProps {
  userData: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-t-4 border-indigo-500">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <User className="h-12 w-12 text-indigo-600 dark:text-indigo-300" />
        </div>
        
        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userData.name || 'User'}
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
            {userData.role || 'Employee'} • {userData.employee_code || 'No ID'}
          </p>
          
          <div className="mt-3 flex flex-col md:flex-row gap-3 md:gap-6">
            <div className="flex items-center justify-center md:justify-start">
              <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">{userData.email}</span>
            </div>
            
            {userData.contact && (
              <div className="flex items-center justify-center md:justify-start">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{userData.contact}</span>
              </div>
            )}
            
            {userData.dob && (
              <div className="flex items-center justify-center md:justify-start">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  {new Date(userData.dob).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium">
          {userData.status ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;