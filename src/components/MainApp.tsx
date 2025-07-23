import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ProfileDetails from './ProfileDetails';
import WalletInterface from './WalletInterface';
import TransactionHistory from './TransactionHistory';
import TradingTools from './TradingTools';
import Notifications from './Notifications';
import Settings from './Settings';
import { storageUtils } from '@/utils/storage';
import { toast } from 'sonner';

const MainApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const authStatus = storageUtils.getAuth();
      const user = storageUtils.getUser();
      
      if (authStatus && user) {
        setIsAuthenticated(true);
        console.log('User authenticated:', user.name);
      } else {
        setIsAuthenticated(false);
        console.log('User not authenticated');
      }
      
      setIsLoading(false);
    };

    // Check mobile status
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkAuth();
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    console.log('Login successful, redirecting to dashboard');
  };

  const handleLogout = () => {
    storageUtils.setAuth(false);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    toast.success('Logged out successfully');
    console.log('User logged out');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Trading Wallet...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfileDetails />;
      case 'wallet':
        return <WalletInterface />;
      case 'transactions':
        return <TransactionHistory />;
      case 'trading':
        return <TradingTools />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      profile: 'Profile Details',
      wallet: 'Wallet',
      transactions: 'Transaction History',
      trading: 'Trading Tools',
      notifications: 'Notifications',
      settings: 'Settings'
    };
    return titles[currentPage as keyof typeof titles] || 'Dashboard';
  };
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-16 lg:ml-80'
      }`}>
        <div className="h-full overflow-auto custom-scrollbar">
          {/* Mobile Header */}
          {isMobile && (
            <div className="bg-white shadow-sm border-b px-4 py-3 lg:hidden">
              <div className="flex items-center justify-between">
                <div className="ml-12"> {/* Space for menu button */}
                  <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
                </div>
              </div>
            </div>
          )}
          
          {/* Page Content */}
          <div className={`p-6 max-w-7xl mx-auto ${isMobile ? 'pt-4' : ''}`}>
            <div className="fade-in-up">
              {renderCurrentPage()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;