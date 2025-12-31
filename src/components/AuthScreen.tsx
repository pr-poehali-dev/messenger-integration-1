import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onLogin: (token: string, user: any) => void;
}

const AUTH_URL = 'https://functions.poehali.dev/a71bbcca-36fd-4f5e-92e2-02250db4e773';

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugCode, setDebugCode] = useState('');

  const handleSendCode = async () => {
    if (!phone) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_code', phone })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStep('code');
        if (data.debug_code) {
          setDebugCode(data.debug_code);
        }
      } else {
        setError(data.error || 'Ошибка отправки кода');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify_code', 
          phone, 
          code,
          username: username || undefined
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.user.username) {
          onLogin(data.token, data.user);
        } else {
          setStep('profile');
        }
      } else {
        setError(data.error || 'Неверный код');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify_code', 
          phone, 
          code,
          username
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.error || 'Ошибка создания профиля');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 mx-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 gradient-primary rounded-2xl flex items-center justify-center">
            <Icon name="Lock" size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold gradient-text mb-2">
            Secure Messenger
          </h1>
          <p className="text-muted-foreground">
            Безопасный мессенджер с E2E шифрованием
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {step === 'phone' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-medium mb-2 block">Номер телефона</label>
              <Input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-center text-lg"
                disabled={loading}
              />
            </div>
            <Button
              className="w-full gradient-primary"
              size="lg"
              onClick={handleSendCode}
              disabled={!phone || loading}
            >
              {loading ? 'Отправка...' : 'Получить код'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Мы отправим вам код подтверждения в официальном чате
            </p>
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-1">Код отправлен на</p>
              <p className="font-semibold">{phone}</p>
              {debugCode && (
                <p className="text-xs text-primary mt-2">
                  Тестовый код: {debugCode}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Код подтверждения</label>
              <Input
                type="text"
                placeholder="• • • • • •"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                disabled={loading}
              />
            </div>
            <Button
              className="w-full gradient-primary"
              size="lg"
              onClick={handleVerifyCode}
              disabled={code.length !== 6 || loading}
            >
              {loading ? 'Проверка...' : 'Подтвердить'}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep('phone')}
              disabled={loading}
            >
              Изменить номер
            </Button>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto mb-3 gradient-primary rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <h2 className="text-xl font-heading font-bold">Создайте профиль</h2>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Как вас зовут?</label>
              <Input
                type="text"
                placeholder="Введите ваше имя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center"
                disabled={loading}
              />
            </div>
            <Button
              className="w-full gradient-primary"
              size="lg"
              onClick={handleCreateProfile}
              disabled={!username.trim() || loading}
            >
              {loading ? 'Создание...' : 'Начать общение'}
            </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-primary" />
            <span>Защищено сквозным шифрованием</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
