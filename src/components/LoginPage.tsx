import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Wallet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { storageUtils } from '@/utils/storage';
import { initializeSampleData } from '@/utils/initializeData';
import { User, NotificationData } from '@/types';
import Testimonials from './Testimonials';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [tradingId, setTradingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addLoginNotification = () => {
    const notifications = storageUtils.getNotifications();
    const newNotification: NotificationData = {
      id: `login_${Date.now()}`,
      title: 'Successful Login',
      message: `Welcome back! You logged in successfully at ${new Date().toLocaleString('en-PH')}.`,
      type: 'success',
      category: 'security',
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification);
    storageUtils.setNotifications(notifications);
  };

  const handleLogin = async () => {
    if (!tradingId.trim()) {
      toast.error('Please enter your Trading ID');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get the current user's trading ID (if exists) or default
    let validTradingId = 'INVESTOR001';
    const existingUser = storageUtils.getUser();
    if (existingUser?.tradingId) {
      validTradingId = existingUser.tradingId;
      console.log('🔑 Using dynamic Trading ID:', validTradingId);
    } else {
      console.log('🔑 Using default Trading ID:', validTradingId);
    }

    if (tradingId.toUpperCase() === validTradingId.toUpperCase()) {
      // Initialize or update user data
      const userData: User = existingUser || {
        name: 'Celberto Gualin Zamora',
        country: 'Philippines 🇵🇭',
        mobile: '+639468639470',
        email: 'celbrtozamora@gmail.com',
        tradingId: validTradingId,
        profileImage: 'https://firebasestorage.googleapis.com:443/v0/b/steercode.firebasestorage.app/o/users%2Fl8LIPNE2YaSskI1yRq3l6iKnHt32%2Fattachments%2F5DEF6E66-8A12-4846-A0C6-395B95CD5800.jpeg?alt=media&token=12fa4e30-78b2-442b-8a5f-081dde2d1ac3',
        linkedAccount: {
          type: 'Maya Wallet',
          accountName: 'Celberto Gualin Zamora',
          accountNumber: '09468639470'
        }
      };

      // Ensure trading ID matches what was entered
      userData.tradingId = validTradingId;
      
      storageUtils.setUser(userData);
      storageUtils.setAuth(true);
      
      // Initialize sample data for better first experience
      initializeSampleData();
      
      // Add login notification
      addLoginNotification();
      
      toast.success(`Welcome back, ${userData.name}! Your trading wallet is ready.`);
      console.log('✅ Login successful for:', userData.name, 'with Trading ID:', validTradingId);
      onLogin();
    } else {
      console.log('❌ Login failed. Expected:', validTradingId, 'Got:', tradingId.toUpperCase());
      toast.error('Invalid Trading ID. Please check your credentials and try again.');
      
      // Add failed login notification (if user exists)
      if (existingUser) {
        const notifications = storageUtils.getNotifications();
        const failedLoginNotification: NotificationData = {
          id: `failed_login_${Date.now()}`,
          title: 'Failed Login Attempt',
          message: `Someone tried to access your account with incorrect credentials at ${new Date().toLocaleString('en-PH')}.`,
          type: 'warning',
          category: 'security',
          timestamp: new Date().toISOString(),
          read: false
        };
        notifications.unshift(failedLoginNotification);
        storageUtils.setNotifications(notifications);
      }
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Get current valid trading ID for display (if exists)
  const getCurrentTradingId = () => {
    const existingUser = storageUtils.getUser();
    return existingUser?.tradingId || 'INVESTOR001';
  };

  const currentValidId = getCurrentTradingId();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8 fade-in-up">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Wallet</h1>
          <p className="text-gray-600">Professional Investment Platform</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            System Online
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-bold">Secure Access</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your Trading ID to access your investment portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tradingId" className="text-sm font-medium">Trading ID</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="tradingId"
                  type="text"
                  placeholder={`Enter your Trading ID (e.g., ${currentValidId})`}
                  value={tradingId}
                  onChange={(e) => setTradingId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 uppercase"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Trading IDs are case-insensitive and automatically formatted
              </p>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Trading Wallet'
              )}
            </Button>

            {/* Security Features */}
            <div className="grid grid-cols-2 gap-4 text-center text-xs text-gray-500">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure Login</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real-time Sync</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Data Protection</span>
              </div>
            </div>

            {/* Dynamic Access Code Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium">Dynamic Access Control</p>
                  <p className="mt-1">
                    Your Trading ID can be updated by your account administrator for enhanced security. 
                    Always use your current assigned Trading ID to login.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>© 2024 Trading Wallet Platform. All rights reserved.</p>
          <p className="text-xs">Built with enterprise-grade security and reliability</p>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <span className="flex items-center text-xs">
              <div className="w-1 h-1 bg-green-400 rounded-full mr-1"></div>
              Secure
            </span>
            <span className="flex items-center text-xs">
              <div className="w-1 h-1 bg-blue-400 rounded-full mr-1"></div>
              Real-time
            </span>
            <span className="flex items-center text-xs">
              <div className="w-1 h-1 bg-purple-400 rounded-full mr-1"></div>
              Professional
            </span>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-16 w-full max-w-4xl">
        <Testimonials />
      </div>
    </div>
  );
};

export default LoginPage;