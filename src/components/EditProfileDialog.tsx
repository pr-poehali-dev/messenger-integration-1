import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  currentBio?: string;
  currentPhone: string;
  onSave: (data: { name: string; bio: string; phone: string }) => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  currentName,
  currentBio = '',
  currentPhone,
  onSave,
}: EditProfileDialogProps) {
  const [name, setName] = useState(currentName);
  const [bio, setBio] = useState(currentBio);
  const [phone, setPhone] = useState(currentPhone);

  const handleSave = () => {
    onSave({ name, bio, phone });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Редактировать профиль</DialogTitle>
          <DialogDescription>
            Измените информацию о себе. Изменения сохранятся автоматически.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24 gradient-primary">
              <AvatarImage src="" />
              <AvatarFallback className="text-white text-2xl font-bold">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Icon name="Camera" size={16} className="mr-2" />
              Изменить фото
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Имя
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Номер телефона
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Для изменения номера потребуется подтверждение
              </p>
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-medium">
                О себе
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажите о себе..."
                className="mt-2 min-h-[100px]"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {bio.length}/200
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button className="gradient-primary" onClick={handleSave}>
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
