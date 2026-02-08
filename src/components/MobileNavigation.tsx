import { Home, BarChart3, MessageSquare, FileText, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  currentUser: any;
}

export function MobileNavigation({ currentPage, onPageChange, currentUser }: MobileNavigationProps) {
  const navItems = [
    { id: 'home', label: 'Map', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'field-data', label: 'Field', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          if (item.id === 'profile') {
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <Avatar className={`w-6 h-6 mb-1 ${isActive ? 'ring-2 ring-green-600' : ''}`}>
                  {currentUser.profilePicture ? (
                    <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                  ) : (
                    <AvatarFallback className="bg-green-600 text-white text-[10px]">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-green-100' : ''}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
