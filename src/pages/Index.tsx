import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { categories, mockFiles } from '@/components/GameData';
import FilterSection from '@/components/FilterSection';
import FileCard from '@/components/FileCard';
import AuthDialog from '@/components/AuthDialog';
import { authService } from '@/lib/auth';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [selectedDownloadType, setSelectedDownloadType] = useState<string | null>(null);
  const [selectedModType, setSelectedModType] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [user, setUser] = useState(authService.getUser());

  const filteredFiles = mockFiles.filter(file => {
    const matchesCategory = !selectedCategory || file.category === selectedCategory;
    const matchesSearch = !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = !selectedGame || (file as any).game === selectedGame;
    const matchesContentType = !selectedContentType || (file as any).contentType === selectedContentType;
    const matchesDownloadType = !selectedDownloadType || (file as any).downloadType === selectedDownloadType;
    const matchesModType = !selectedModType || (file as any).modType === selectedModType;
    return matchesCategory && matchesSearch && matchesGame && matchesContentType && matchesDownloadType && matchesModType;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black glitch neon-glow" data-text="BOX_GAME">
              BOX_GAME
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Поиск файлов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 neon-border-secondary"
                />
              </div>
              {user ? (
                <Button
                  variant="outline"
                  className="neon-border-secondary"
                  onClick={() => {
                    authService.logout();
                    setUser(null);
                  }}
                >
                  <Icon name="LogOut" size={18} className="mr-2" />
                  {user.username}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="neon-border-secondary"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  <Icon name="User" size={18} className="mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative w-full h-64 md:h-80 overflow-hidden mb-8">
        <img 
          src="https://cdn.poehali.dev/files/13e217ab-dd17-43dd-a93e-92895f8e0617.jpg" 
          alt="Cyberpunk Gaming Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 bg-card border-2 hover:scale-[1.02] ${
                selectedCategory === category.id
                  ? 'border-primary neon-border'
                  : 'border-primary/20 hover:border-primary/50'
              }`}
              onClick={() => {
                setSelectedCategory(selectedCategory === category.id ? null : category.id);
                setSelectedGame(null);
                setSelectedContentType(null);
                setSelectedDownloadType(null);
                setSelectedModType(null);
              }}
            >
              <CardContent className="p-10 text-center">
                <Icon name={category.icon} className={`mx-auto mb-4 ${category.color}`} size={64} />
                <h3 className="font-bold text-3xl">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <FilterSection
          selectedCategory={selectedCategory}
          selectedGame={selectedGame}
          selectedContentType={selectedContentType}
          selectedDownloadType={selectedDownloadType}
          selectedModType={selectedModType}
          setSelectedGame={setSelectedGame}
          setSelectedContentType={setSelectedContentType}
          setSelectedDownloadType={setSelectedDownloadType}
          setSelectedModType={setSelectedModType}
        />

        {filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="Search" className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">Файлы не найдены</p>
          </div>
        )}
      </div>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSuccess={() => setUser(authService.getUser())}
      />
    </div>
  );
}