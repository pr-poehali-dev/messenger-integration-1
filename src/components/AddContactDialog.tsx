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
import Icon from '@/components/ui/icon';

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authToken: string;
  onContactAdded: (contact: any) => void;
}

const CONTACTS_URL = 'https://functions.poehali.dev/1aaced2f-0109-4bae-8a21-33dad599d652';

export default function AddContactDialog({
  open,
  onOpenChange,
  authToken,
  onContactAdded,
}: AddContactDialogProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!phone.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(CONTACTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onContactAdded(data);
        setPhone('');
        onOpenChange(false);
      } else {
        setError(data.error || 'Ошибка добавления контакта');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Добавить контакт</DialogTitle>
          <DialogDescription>
            Введите номер телефона пользователя, которого хотите добавить
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="contact-phone" className="text-sm font-medium">
              Номер телефона
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className="mt-2"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Отмена
          </Button>
          <Button className="gradient-primary" onClick={handleAdd} disabled={!phone.trim() || loading}>
            <Icon name="UserPlus" size={16} className="mr-2" />
            {loading ? 'Добавление...' : 'Добавить'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
