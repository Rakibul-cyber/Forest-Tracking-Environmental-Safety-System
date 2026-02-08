import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, Save, User, Mail, MapPin, Calendar, LogOut, X } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProfilePageProps {
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
}

export function ProfilePage({ currentUser, onUpdateUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    role: currentUser.role || 'forester',
    phone: currentUser.phone || '',
    location: currentUser.location || '',
    bio: currentUser.bio || '',
    lookingFor: currentUser.lookingFor || currentUser.department || '',
    joinDate: currentUser.joinDate || currentUser.createdAt || new Date().toISOString(),
  });
  const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture || '');
  const [previewImage, setPreviewImage] = useState(currentUser.profilePicture || '');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setPreviewImage(imageUrl);
          setProfilePicture(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      ...profileData,
      profilePicture: profilePicture,
    };

    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === currentUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Notify parent component
    onUpdateUser(updatedUser);

    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      role: currentUser.role || 'forester',
      phone: currentUser.phone || '',
      location: currentUser.location || '',
      bio: currentUser.bio || '',
      lookingFor: currentUser.lookingFor || currentUser.department || '',
      joinDate: currentUser.joinDate || currentUser.createdAt || new Date().toISOString(),
    });
    setPreviewImage(currentUser.profilePicture || '');
    setProfilePicture(currentUser.profilePicture || '');
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'supervisor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'analyst':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-green-700 text-white px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white">Profile</h1>
            <p className="text-green-100 text-sm">Personal information</p>
          </div>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-800 text-white"
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Picture & Quick Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {previewImage ? (
                    <AvatarImage src={previewImage} alt={profileData.name} />
                  ) : (
                    <AvatarFallback className="bg-green-600 text-white text-2xl">
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <h2 className="mt-4 text-center">{profileData.name}</h2>
              <Badge className={`mt-2 ${getRoleBadgeColor(profileData.role)}`}>
                {profileData.role}
              </Badge>

              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{profileData.phone}</span>
                  </div>
                )}
                {profileData.location && (
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{profileData.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Joined {formatDate(profileData.joinDate)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl text-green-600">24</p>
                <p className="text-xs text-gray-600 mt-1">Trees Inspected</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl text-blue-600">12</p>
                <p className="text-xs text-gray-600 mt-1">Reports Submitted</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl text-purple-600">48</p>
                <p className="text-xs text-gray-600 mt-1">Messages Sent</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl text-orange-600">3</p>
                <p className="text-xs text-gray-600 mt-1">Groups Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-12 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="h-12 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="h-12 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="City, State"
                    className="h-12 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="w-full border border-gray-300 rounded-md p-3 h-12 bg-white mt-2"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  >
                    <option value="forester">Forester</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="analyst">Data Analyst</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="lookingFor">Looking For</Label>
                  <Input
                    id="lookingFor"
                    value={profileData.lookingFor}
                    onChange={(e) => setProfileData({ ...profileData, lookingFor: e.target.value })}
                    placeholder="e.g., Collaboration, Research partners..."
                    className="h-12 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleSave}
                    className="flex-1 bg-green-600 hover:bg-green-700 h-12"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="mt-1">{profileData.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="mt-1">{profileData.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="mt-1">{profileData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="mt-1">{profileData.location || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="mt-1 capitalize">{profileData.role || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Looking For</p>
                  <p className="mt-1">{profileData.lookingFor || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bio</p>
                  <p className="mt-1">{profileData.bio || 'No bio added yet.'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 border rounded-lg active:bg-gray-50">
                <div className="text-left">
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-gray-500">Update account password</p>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 border rounded-lg active:bg-gray-50">
                <div className="text-left">
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-gray-500">Manage notification preferences</p>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 border rounded-lg active:bg-gray-50">
                <div className="text-left">
                  <p className="text-sm font-medium">Privacy Settings</p>
                  <p className="text-xs text-gray-500">Control profile visibility</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 border-red-300 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
