import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth';
import { gamesList, contentTypes } from './GameData';

interface UploadFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function UploadFileDialog({ open, onOpenChange, onSuccess }: UploadFileDialogProps) {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [contentType, setContentType] = useState('');
  const [downloadType, setDownloadType] = useState('');
  const [modType, setModType] = useState('');
  const [size, setSize] = useState('');
  const [version, setVersion] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const selectedContentType = contentTypes.find(ct => ct.id === contentType);
  const showDownloadType = contentType === 'download';
  const showModType = contentType === 'mods';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = authService.getUser();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Необходима авторизация'
      });
      return;
    }

    if (!name || !game || !contentType || !size || !version || !fileUrl) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните все обязательные поля'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/5e26d7ac-3cae-4be0-ba5d-dc5c9abd9be5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          name,
          game,
          contentType,
          downloadType: downloadType || null,
          modType: modType || null,
          size,
          version,
          fileUrl,
          fileType: 'direct'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при загрузке файла');
      }

      toast({
        title: 'Успех!',
        description: 'Файл успешно добавлен'
      });

      setName('');
      setGame('');
      setContentType('');
      setDownloadType('');
      setModType('');
      setSize('');
      setVersion('');
      setFileUrl('');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить файл</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Название файла *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: GTA San Andreas - Сборка"
              required
            />
          </div>

          <div>
            <Label htmlFor="game">Игра *</Label>
            <Select value={game} onValueChange={setGame} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите игру" />
              </SelectTrigger>
              <SelectContent>
                {gamesList.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contentType">Тип контента *</Label>
            <Select value={contentType} onValueChange={(val) => {
              setContentType(val);
              setDownloadType('');
              setModType('');
            }} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map(ct => (
                  <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showDownloadType && selectedContentType?.subcategories && (
            <div>
              <Label htmlFor="downloadType">Тип загрузки *</Label>
              <Select value={downloadType} onValueChange={setDownloadType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {selectedContentType.subcategories.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showModType && selectedContentType?.subcategories && (
            <div>
              <Label htmlFor="modType">Тип мода *</Label>
              <Select value={modType} onValueChange={setModType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {selectedContentType.subcategories.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="size">Размер файла *</Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Например: 4.7 GB или 250 MB"
              required
            />
          </div>

          <div>
            <Label htmlFor="version">Версия *</Label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="Например: 1.0 или 1.20.4"
              required
            />
          </div>

          <div>
            <Label htmlFor="fileUrl">Ссылка на файл *</Label>
            <Input
              id="fileUrl"
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Загрузка...' : 'Добавить файл'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
