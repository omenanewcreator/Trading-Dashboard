import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Wallet, 
  History, 
  TrendingUp, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react';
import { storageUtils } from '@/utils/storage';
import { User as UserType } from '@/types';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ currentPage, onPageChange, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const user = storageUtils.getUser() as UserType;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transactions', label: 'Transaction History', icon: History },
    { id: 'trading', label: 'Trading Tools', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="sm"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
            <div className="relative w-80 h-full bg-white shadow-xl">
              <SidebarContent 
                user={user}
                menuItems={menuItems}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onLogout={onLogout}
                isCollapsed={false}
                onClose={() => setShowMobileMenu(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={`bg-white shadow-xl border-r transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } flex flex-col h-screen fixed left-0 top-0 z-50`}>
      <SidebarContent 
        user={user}
        menuItems={menuItems}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={onLogout}
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        isMobile={false}
      />
    </div>
  );
};

// Extracted sidebar content component
const SidebarContent = ({ 
  user, 
  menuItems, 
  currentPage, 
  onPageChange, 
  onLogout, 
  isCollapsed, 
  onToggle, 
  onClose, 
  isMobile 
}: {
  user: UserType;
  menuItems: any[];
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-blue-600 text-white">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Wallet className="h-6 w-6" />
              <span className="font-semibold">Trading Wallet</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={isMobile ? onClose : onToggle}
            className="text-white hover:bg-blue-700 p-2"
          >
            {isMobile || isCollapsed ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profileImage} alt={user?.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">ID: {user?.tradingId}</p>
              <p className="text-xs text-blue-600">{user?.country}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-12 ${
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "hover:bg-gray-100"
                } ${isCollapsed ? 'px-2' : 'px-4'}`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={`w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 h-12 ${
            isCollapsed ? 'px-2' : 'px-4'
          }`}
          onClick={onLogout}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </>
  );
};

export default Sidebar;