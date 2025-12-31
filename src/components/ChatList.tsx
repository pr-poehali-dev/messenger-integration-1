import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  encrypted: boolean;
}

const mockChats: Chat[] = [
  {
    id: 'official',
    name: 'Официальный бот',
    avatar: '',
    lastMessage: 'Ваш код подтверждения: 123456',
    time: '12:45',
    unread: 1,
    online: true,
    encrypted: true,
  },
];

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
}

export default function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-heading font-bold mb-4 gradient-text">
          Messenger
        </h1>
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск чатов..."
            className="pl-10 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`w-full p-3 rounded-lg mb-1 text-left transition-all hover:bg-muted/80 animate-fade-in ${
                selectedChatId === chat.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="gradient-primary text-white font-semibold">
                      {chat.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{chat.name}</span>
                      {chat.encrypted && (
                        <Icon name="Lock" size={12} className="text-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}