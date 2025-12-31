import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

export default function ProfilePanel() {
  return (
    <ScrollArea className="h-full bg-card">
      <div className="p-6">
        <div className="text-center mb-8">
          <Avatar className="w-32 h-32 mx-auto mb-4 gradient-primary">
            <AvatarImage src="" />
            <AvatarFallback className="text-white text-4xl font-bold">Я</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-heading font-bold mb-1">Вы</h2>
          <p className="text-muted-foreground">@username</p>
          <Button variant="outline" className="mt-4">
            <Icon name="Edit" size={16} className="mr-2" />
            Редактировать профиль
          </Button>
        </div>

        <Card className="p-4 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Защищённый режим</h3>
              <p className="text-sm text-muted-foreground">Сквозное шифрование</p>
            </div>
          </div>
          <p className="text-sm">
            Все ваши сообщения и данные защищены сквозным шифрованием E2E.
            Только вы и получатель можете их прочитать.
          </p>
        </Card>

        <div className="space-y-4 mb-6">
          <h3 className="font-heading font-semibold">Настройки приватности</h3>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Icon name="Lock" size={18} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Шифрование по умолчанию</p>
                <p className="text-xs text-muted-foreground">Для всех новых чатов</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Icon name="Eye" size={18} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Показывать статус онлайн</p>
                <p className="text-xs text-muted-foreground">Видимость для контактов</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={18} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Уведомления о прочтении</p>
                <p className="text-xs text-muted-foreground">Синие галочки</p>
              </div>
            </div>
            <Switch />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading font-semibold mb-4">Информация</h3>
          
          <Button variant="ghost" className="w-full justify-start">
            <Icon name="Phone" size={18} className="mr-3" />
            +7 (999) 123-45-67
          </Button>

          <Button variant="ghost" className="w-full justify-start">
            <Icon name="Mail" size={18} className="mr-3" />
            user@example.com
          </Button>

          <Button variant="ghost" className="w-full justify-start">
            <Icon name="Calendar" size={18} className="mr-3" />
            Регистрация: 15 января 2024
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
