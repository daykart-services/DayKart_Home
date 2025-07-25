import React from 'react';
import { Settings } from 'lucide-react';
import { useTheme, useUser } from './ThemeContext';

interface AdminButtonProps {
  onClick: () => void;
}

const AdminButton: React.FC<AdminButtonProps> = ({ onClick }) => {
  const { isDark } = useTheme();
  const { isAdmin } = useUser();

  // Only show admin button if user is admin
  if (!isAdmin()) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        isDark 
          ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      title="Admin Portal"
    >
      <Settings size={16} />
    </button>
  );
};

export default AdminButton;