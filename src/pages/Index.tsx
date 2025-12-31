import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import ProfilePanel from '@/components/ProfilePanel';
import SettingsPanel from '@/components/SettingsPanel';
import AuthScreen from '@/components/AuthScreen';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'profile' | 'settings'>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [userProfile, setUserProfile] = useState({
    id: 0,
    username: '',
    phone: '',
    bio: '',
  });

  const handleLogin = (token: string, user: any) => {
    setAuthToken(token);
    setUserProfile({ id: user.id, username: user.username, phone: user.phone, bio: '' });
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_profile', JSON.stringify(user));
  };

  const handleProfileUpdate = (data: { name: string; bio: string; phone: string }) => {
    setUserProfile({
      username: data.name,
      phone: data.phone,
      bio: data.bio,
    });
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'chats' && (
        <>
          <div className="w-80">
            <ChatList 
              onChatSelect={setSelectedChatId} 
              selectedChatId={selectedChatId}
              authToken={authToken}
            />
          </div>
          <div className="flex-1">
            <ChatWindow chatId={selectedChatId} />
          </div>
        </>
      )}

      {activeTab === 'profile' && (
        <div className="flex-1">
          <ProfilePanel
            username={userProfile.username}
            phone={userProfile.phone}
            bio={userProfile.bio}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex-1">
          <SettingsPanel />
        </div>
      )}
    </div>
  );
}