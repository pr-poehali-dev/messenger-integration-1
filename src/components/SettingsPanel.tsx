import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [encryption, setEncryption] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);

  return (
    <ScrollArea className="h-full bg-card">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold gradient-text mb-2">
            Настройки
          </h1>
          <p className="text-muted-foreground">
            Управляйте параметрами вашего мессенджера
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Bell" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">Уведомления</h3>
                <p className="text-sm text-muted-foreground">
                  Управление уведомлениями о новых сообщениях
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Push-уведомления</p>
                  <p className="text-xs text-muted-foreground">
                    Получать уведомления о новых сообщениях
                  </p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Звуки уведомлений</p>
                  <p className="text-xs text-muted-foreground">
                    Воспроизводить звук при получении сообщения
                  </p>
                </div>
                <Switch checked={sounds} onCheckedChange={setSounds} />
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium text-sm mb-2">Тип уведомлений</p>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все сообщения</SelectItem>
                    <SelectItem value="mentions">Только упоминания</SelectItem>
                    <SelectItem value="none">Без уведомлений</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">Приватность и безопасность</h3>
                <p className="text-sm text-muted-foreground">
                  Настройки конфиденциальности и шифрования
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Сквозное шифрование</p>
                  <p className="text-xs text-muted-foreground">
                    E2E шифрование для всех новых чатов
                  </p>
                </div>
                <Switch checked={encryption} onCheckedChange={setEncryption} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Показывать статус онлайн</p>
                  <p className="text-xs text-muted-foreground">
                    Другие пользователи увидят, когда вы в сети
                  </p>
                </div>
                <Switch checked={onlineStatus} onCheckedChange={setOnlineStatus} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Уведомления о прочтении</p>
                  <p className="text-xs text-muted-foreground">
                    Показывать синие галочки при прочтении
                  </p>
                </div>
                <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium text-sm mb-2">Кто может меня найти</p>
                <Select defaultValue="everyone">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Все пользователи</SelectItem>
                    <SelectItem value="contacts">Только контакты</SelectItem>
                    <SelectItem value="none">Никто</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Download" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">Данные и хранилище</h3>
                <p className="text-sm text-muted-foreground">
                  Управление загрузками и хранением данных
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Автозагрузка медиа</p>
                  <p className="text-xs text-muted-foreground">
                    Автоматически загружать фото и видео
                  </p>
                </div>
                <Switch checked={autoDownload} onCheckedChange={setAutoDownload} />
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium text-sm mb-2">Качество загрузки</p>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Высокое качество</SelectItem>
                    <SelectItem value="medium">Среднее качество</SelectItem>
                    <SelectItem value="low">Экономия трафика</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full justify-start">
                <Icon name="Trash2" size={18} className="mr-3" />
                Очистить кэш (0 МБ)
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Palette" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">Внешний вид</h3>
                <p className="text-sm text-muted-foreground">
                  Персонализация интерфейса
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium text-sm mb-2">Тема оформления</p>
                <Select defaultValue="dark">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Светлая</SelectItem>
                    <SelectItem value="dark">Тёмная</SelectItem>
                    <SelectItem value="auto">Системная</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium text-sm mb-2">Размер шрифта</p>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Маленький</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="large">Крупный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Separator />

          <Card className="p-5">
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="HelpCircle" size={18} className="mr-3" />
                Помощь и поддержка
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="FileText" size={18} className="mr-3" />
                Условия использования
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="Info" size={18} className="mr-3" />
                О приложении
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                <Icon name="LogOut" size={18} className="mr-3" />
                Выйти из аккаунта
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
