import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import ProfilePanel from '@/components/ProfilePanel';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'profile' | 'settings'>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'chats' && (
        <>
          <div className="w-80">
            <ChatList onChatSelect={setSelectedChatId} selectedChatId={selectedChatId} />
          </div>
          <div className="flex-1">
            <ChatWindow chatId={selectedChatId} />
          </div>
        </>
      )}

      {activeTab === 'profile' && (
        <div className="flex-1">
          <ProfilePanel />
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="flex-1 flex items-center justify-center bg-card">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
              <span className="text-4xl">👥</span>
            </div>
            <h2 className="text-2xl font-heading font-bold mb-2">Контакты</h2>
            <p className="text-muted-foreground">Здесь будет список ваших контактов</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex-1 flex items-center justify-center bg-card">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
              <span className="text-4xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-heading font-bold mb-2">Настройки</h2>
            <p className="text-muted-foreground">Здесь будут настройки приложения</p>
          </div>
        </div>
      )}
    </div>
  );
}
