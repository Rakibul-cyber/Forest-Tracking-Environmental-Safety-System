import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ChatPage } from './components/ChatPage';
import { FieldDataPage } from './components/FieldDataPage';
import { ProfilePage } from './components/ProfilePage';
import { WeatherPage } from './components/WeatherPage';
import { MobileNavigation } from './components/MobileNavigation';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('home');
    }

    // Handle offline/online status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {isOffline && (
        <div className="bg-yellow-500 text-white px-4 py-3 text-center text-sm fixed top-0 left-0 right-0 z-50">
          Offline Mode - Data will sync when connection is restored
        </div>
      )}
      
      <main className={`${isOffline ? 'pt-12' : ''}`}>
        {currentPage === 'home' && <HomePage currentUser={currentUser} onNavigate={setCurrentPage} />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'chat' && <ChatPage currentUser={currentUser} />}
        {currentPage === 'field-data' && <FieldDataPage currentUser={currentUser} />}
        {currentPage === 'profile' && <ProfilePage currentUser={currentUser} onUpdateUser={handleUpdateUser} />}
        {currentPage === 'weather' && <WeatherPage onBack={() => setCurrentPage('home')} />}
      </main>

      {currentPage !== 'weather' && (
        <MobileNavigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}