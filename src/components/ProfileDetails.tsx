import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { storageUtils } from '@/utils/storage';
import { User, Camera, Save, Edit3 } from 'lucide-react';

const defaultProfileImage = 'https://firebasestorage.googleapis.com:443/v0/b/steercode.firebasestorage.app/o/users%2Fl8LIPNE2YaSskI1yRq3l6iKnHt32%2Fattachments%2F5DEF6E66-8A12-4846-A0C6-395B95CD5800.jpeg?alt=media&token=12fa4e30-78b2-442b-8a5f-081dde2d1ac3';

const ProfileDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [walletAccountName, setWalletAccountName] = useState('');
  const [walletAccountNumber, setWalletAccountNumber] = useState('');

  useEffect(() => {
    console.log('🔄 Loading user profile data...');
    let user = storageUtils.getUser();
    if (!user) {
      console.log('❌ User not found in storage, creating default user...');
      user = {
        name: 'Celberto Gualin Zamora',
        country: 'Philippines 🇵🇭',
        mobile: '+639468639470',
        email: 'celbrtozamora@gmail.com',
        tradingId: 'INVESTOR001',
        profileImage: defaultProfileImage,
        linkedAccount: {
          type: 'Maya Wallet',
          accountName: 'Celberto Gualin Zamora',
          accountNumber: '09468639470',
        },
      };
      storageUtils.setUser(user);
    }

    console.log('✅ User loaded:', user);
    console.log('🖼️ Profile image URL:', user.profileImage);
    setProfileImage(user.profileImage || defaultProfileImage);
    setName(user.name || '');
    setCountry(user.country || '');
    setEmail(user.email || '');
    setMobile(user.mobile || '');
    if (user.linkedAccount) {
      setWalletAccountName(user.linkedAccount.accountName || '');
      setWalletAccountNumber(user.linkedAccount.accountNumber || '');
    }
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📷 Processing new profile image...');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log('🖼️ New image processed, updating profile...');
        
        setProfileImage(result);
        
        // Immediately save to storage
        const user = storageUtils.getUser();
        if (user) {
          user.profileImage = result;
          storageUtils.setUser(user);
          console.log('💾 Profile image saved to storage');
          toast.success('Profile picture updated and saved successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    console.log('💾 Saving profile changes...');
    
    const user = storageUtils.getUser();
    if (user) {
      user.name = name;
      user.country = country;
      user.email = email;
      user.mobile = mobile;
      user.linkedAccount = {
        ...user.linkedAccount,
        accountName: walletAccountName,
        accountNumber: walletAccountNumber
      };
      
      storageUtils.setUser(user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      console.log('✅ Profile changes saved');
    }
  };

  const handleCancelEdit = () => {
    // Reload original data
    const user = storageUtils.getUser();
    if (user) {
      setName(user.name || '');
      setCountry(user.country || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      if (user.linkedAccount) {
        setWalletAccountName(user.linkedAccount.accountName || '');
        setWalletAccountNumber(user.linkedAccount.accountNumber || '');
      }
    }
    setIsEditing(false);
    toast.info('Edit cancelled');
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Profile Details</h2>
        </div>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-1"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              onClick={handleSaveProfile} 
              size="sm"
              className="flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button 
              onClick={handleCancelEdit} 
              variant="outline" 
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={profileImage} alt={name} className="object-cover" />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-semibold">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <label 
            htmlFor="upload-profile" 
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Camera className="h-4 w-4" />
          </label>
        </div>
        <input 
          type="file" 
          id="upload-profile" 
          className="hidden" 
          accept="image/*"
          onChange={handleProfileImageChange}
        />
        <p className="text-sm text-gray-500 text-center">
          Click the camera icon to update your profile picture
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            value={name} 
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className={isEditing ? '' : 'bg-gray-50'}
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country"
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            disabled={!isEditing}
            className={isEditing ? '' : 'bg-gray-50'}
          />
        </div>

        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input 
            id="mobile"
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)}
            disabled={!isEditing}
            className={isEditing ? '' : 'bg-gray-50'}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email"
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            className={isEditing ? '' : 'bg-gray-50'}
          />
        </div>

        <div className="pt-4 border-t">
          <Label className="text-base font-medium mb-3 block">Linked Maya Wallet</Label>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="walletName" className="text-sm">Account Name</Label>
              <Input 
                id="walletName"
                value={walletAccountName} 
                onChange={(e) => setWalletAccountName(e.target.value)}
                disabled={!isEditing}
                className={isEditing ? '' : 'bg-gray-50'}
              />
            </div>
            
            <div>
              <Label htmlFor="walletNumber" className="text-sm">Account Number</Label>
              <Input 
                id="walletNumber"
                value={walletAccountNumber} 
                onChange={(e) => setWalletAccountNumber(e.target.value)}
                disabled={!isEditing}
                className={isEditing ? '' : 'bg-gray-50'}
              />
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All changes will be saved permanently to your profile. 
            Make sure all information is accurate before saving.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;