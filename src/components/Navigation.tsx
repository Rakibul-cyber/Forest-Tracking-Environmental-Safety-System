import { Button } from './ui/button';
import { Home, BarChart3, MessageSquare, FileText, LogOut, Trees, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  currentUser: any;
}

export function Navigation({ currentPage, onPageChange, onLogout, currentUser }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Map', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'field-data', label: 'Field Data', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Trees className="w-6 h-6" />
              <span className="font-semibold">ForestTrack</span>
            </div>
            
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      currentPage === item.id
                        ? 'bg-green-800'
                        : 'hover:bg-green-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onPageChange('profile')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                currentPage === 'profile' ? 'bg-green-800' : 'hover:bg-green-600'
              }`}
            >
              <Avatar className="w-8 h-8 border-2 border-white">
                {currentUser.profilePicture ? (
                  <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="bg-green-900 text-white text-xs">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-sm text-left">
                <div>{currentUser.name}</div>
                <div className="text-green-200 text-xs">{currentUser.role}</div>
              </div>
            </button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-green-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
