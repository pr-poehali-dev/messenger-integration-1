import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  encrypted: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Привет! Как дела?',
    sender: 'other',
    time: '12:30',
    encrypted: true,
  },
  {
    id: '2',
    text: 'Отлично! А у тебя?',
    sender: 'me',
    time: '12:32',
    encrypted: true,
  },
  {
    id: '3',
    text: 'Тоже хорошо, спасибо 😊',
    sender: 'other',
    time: '12:33',
    encrypted: true,
  },
  {
    id: '4',
    text: 'Можешь посмотреть документы?',
    sender: 'other',
    time: '12:35',
    encrypted: true,
  },
  {
    id: '5',
    text: 'Конечно, сейчас проверю',
    sender: 'me',
    time: '12:40',
    encrypted: true,
  },
];

interface ChatWindowProps {
  chatId?: string;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>(mockMessages);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full bg-card">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
            <Icon name="MessageCircle" size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-2">Выберите чат</h2>
          <p className="text-muted-foreground">
            Выберите чат из списка или начните новый разговор
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="gradient-primary text-white font-semibold">
              АИ
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-heading font-semibold">Анна Иванова</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Lock" size={12} className="text-primary" />
              <span>Сквозное шифрование</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Icon name="Phone" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Video" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 animate-fade-in ${
                msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {msg.sender === 'other' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="gradient-primary text-white text-xs">
                    АИ
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] ${
                  msg.sender === 'me'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-muted text-foreground'
                } rounded-2xl px-4 py-2`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs ${msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </span>
                  {msg.encrypted && (
                    <Icon
                      name="Lock"
                      size={10}
                      className={msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Icon name="Paperclip" size={20} />
          </Button>
          <Input
            placeholder="Написать сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="shrink-0">
            <Icon name="Smile" size={20} />
          </Button>
          <Button
            size="icon"
            className="shrink-0 gradient-primary"
            onClick={handleSend}
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
