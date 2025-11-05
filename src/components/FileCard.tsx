import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CommentsSection from './CommentsSection';
import AuthDialog from './AuthDialog';
import { authService } from '@/lib/auth';

interface FileCardProps {
  file: {
    id: number;
    name: string;
    size: string;
    downloads: number;
    rating: number;
    version: string;
    category?: string;
    fileUrl?: string;
    fileType?: 'direct' | 'torrent' | 'upload';
  };
}

export default function FileCard({ file }: FileCardProps) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [user, setUser] = useState(authService.getUser());

  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 bg-card border border-primary/20 hover:shadow-lg hover:shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              {file.name}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="neon-border-secondary">
                <Icon name="HardDrive" size={14} className="mr-1" />
                {file.size}
              </Badge>
              <Badge variant="outline">
                <Icon name="Download" size={14} className="mr-1" />
                {file.downloads.toLocaleString()}
              </Badge>
              <Badge variant="outline">
                <Icon name="Star" size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                {file.rating}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="flex-1 neon-border" variant="default">
                <Icon name="Eye" className="mr-2" size={16} />
                Подробнее
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-2xl">{file.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Размер</p>
                    <p className="font-semibold">{file.size}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Версия</p>
                    <p className="font-semibold">{file.version}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Скачиваний</p>
                    <p className="font-semibold">{file.downloads.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Рейтинг</p>
                    <p className="font-semibold flex items-center">
                      <Icon name="Star" size={16} className="mr-1 fill-yellow-400 text-yellow-400" />
                      {file.rating}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Описание</h4>
                  <p className="text-muted-foreground">
                    Это подробное описание файла. Здесь можно разместить информацию о содержимом, 
                    требованиях к системе, инструкцию по установке и другие важные детали.
                  </p>
                </div>
                {file.fileUrl ? (
                  <a href={file.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Button className="w-full neon-border" size="lg">
                      <Icon name="Download" className="mr-2" size={18} />
                      {file.fileType === 'torrent' ? 'Скачать торрент' : 'Скачать файл'}
                    </Button>
                  </a>
                ) : (
                  <Button className="w-full neon-border" size="lg" disabled>
                    <Icon name="AlertCircle" className="mr-2" size={18} />
                    Файл недоступен
                  </Button>
                )}
                <div className="border-t pt-6 mt-6">
                  <CommentsSection
                    fileId={file.id}
                    onLoginRequired={() => setAuthDialogOpen(true)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          {file.fileUrl ? (
            <a href={file.fileUrl} download target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="neon-border-secondary">
                <Icon name="Download" size={16} />
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="icon" className="neon-border-secondary" disabled>
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
      </CardContent>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSuccess={() => setUser(authService.getUser())}
      />
    </Card>
  );
}