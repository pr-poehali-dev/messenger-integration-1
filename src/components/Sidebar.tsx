import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  activeTab: 'chats' | 'contacts' | 'profile' | 'settings';
  onTabChange: (tab: 'chats' | 'contacts' | 'profile' | 'settings') => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'chats' as const, icon: 'MessageCircle', label: 'Чаты', badge: 3 },
    { id: 'contacts' as const, icon: 'Users', label: 'Контакты' },
    { id: 'profile' as const, icon: 'User', label: 'Профиль' },
    { id: 'settings' as const, icon: 'Settings', label: 'Настройки' },
  ];

  return (
    <div className="w-20 h-full bg-card border-r border-border flex flex-col items-center py-4">
      <div className="mb-6">
        <Avatar className="w-12 h-12 gradient-primary">
          <AvatarImage src="" />
          <AvatarFallback className="text-white font-bold">Я</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="icon"
            className={`relative w-12 h-12 ${
              activeTab === tab.id ? 'gradient-primary' : ''
            }`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <Icon name={tab.icon as any} size={22} />
            {tab.badge && tab.badge > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-accent">
                {tab.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Button variant="ghost" size="icon" className="w-12 h-12 mt-auto">
        <Icon name="Bell" size={22} />
      </Button>
    </div>
  );
}
