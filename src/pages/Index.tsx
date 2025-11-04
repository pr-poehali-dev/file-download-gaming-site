import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

const gamesList = ['GTA San Andreas', 'The Sims 4', "Garry's Mod", 'Minecraft', 'Terraria'];

const contentTypes = [
  { id: 'download', name: 'Скачать', icon: 'Download' },
  { id: 'mods', name: 'Моды', icon: 'Package', subcategories: ['Оружие', 'Транспорт', 'Карты', 'Скины', 'Персонажи'] },
  { id: 'scripts', name: 'Скрипты', icon: 'Code' },
  { id: 'cheats', name: 'Читы', icon: 'Shield' },
  { id: 'info', name: 'Информация', icon: 'Info' },
];

const categories = [
  { id: 'games', name: 'Игры', icon: 'Gamepad2', color: 'text-[hsl(var(--primary))]' },
];

const mockFiles = [
  {
    id: 1,
    name: 'GTA San Andreas - Полная версия',
    category: 'games',
    game: 'GTA San Andreas',
    contentType: 'download',
    modType: null,
    size: '4.7 GB',
    downloads: 125420,
    rating: 4.9,
    version: '1.0',
  },
  {
    id: 2,
    name: 'GTA San Andreas - Сохранения 100%',
    category: 'games',
    game: 'GTA San Andreas',
    contentType: 'info',
    modType: null,
    size: '12 MB',
    downloads: 45230,
    rating: 4.6,
    version: '1.0',
  },
  {
    id: 3,
    name: 'The Sims 4 - Базовая игра',
    category: 'games',
    game: 'The Sims 4',
    contentType: 'download',
    modType: null,
    size: '18 GB',
    downloads: 98340,
    rating: 4.7,
    version: '1.98',
  },
  {
    id: 4,
    name: 'The Sims 4 - Мебель и декор',
    category: 'games',
    game: 'The Sims 4',
    contentType: 'mods',
    modType: 'Карты',
    size: '850 MB',
    downloads: 34120,
    rating: 4.5,
    version: '1.0',
  },
  {
    id: 5,
    name: "Garry's Mod - Полная версия",
    category: 'games',
    game: "Garry's Mod",
    contentType: 'download',
    modType: null,
    size: '5.2 GB',
    downloads: 87650,
    rating: 4.8,
    version: '2023.11',
  },
  {
    id: 6,
    name: "Garry's Mod - Оружейный пак",
    category: 'games',
    game: "Garry's Mod",
    contentType: 'mods',
    modType: 'Оружие',
    size: '2.1 GB',
    downloads: 56340,
    rating: 4.7,
    version: '1.0',
  },
  {
    id: 7,
    name: 'Minecraft Java Edition',
    category: 'games',
    game: 'Minecraft',
    contentType: 'download',
    modType: null,
    size: '1.2 GB',
    downloads: 234567,
    rating: 5.0,
    version: '1.20.4',
  },
  {
    id: 8,
    name: 'Minecraft - Скрипт автоматизации',
    category: 'games',
    game: 'Minecraft',
    contentType: 'scripts',
    modType: null,
    size: '650 MB',
    downloads: 89450,
    rating: 4.8,
    version: '1.0',
  },
  {
    id: 9,
    name: 'Terraria - Полная версия',
    category: 'games',
    game: 'Terraria',
    contentType: 'download',
    modType: null,
    size: '450 MB',
    downloads: 156780,
    rating: 4.9,
    version: '1.4.4',
  },
  {
    id: 10,
    name: 'Terraria - Читы на ресурсы',
    category: 'games',
    game: 'Terraria',
    contentType: 'cheats',
    modType: null,
    size: '45 MB',
    downloads: 67890,
    rating: 4.6,
    version: '1.0',
  },
  {
    id: 11,
    name: 'GTA SA - Пак оружия',
    category: 'games',
    game: 'GTA San Andreas',
    contentType: 'mods',
    modType: 'Оружие',
    size: '2.5 GB',
    downloads: 15420,
    rating: 4.8,
    version: '3.2',
  },
  {
    id: 12,
    name: 'GTA SA - Lamborghini Aventador',
    category: 'games',
    game: 'GTA San Andreas',
    contentType: 'mods',
    modType: 'Транспорт',
    size: '150 MB',
    downloads: 23456,
    rating: 4.7,
    version: '1.5',
  },
  {
    id: 13,
    name: 'Minecraft - Пак скинов',
    category: 'games',
    game: 'Minecraft',
    contentType: 'mods',
    modType: 'Скины',
    size: '45 MB',
    downloads: 12890,
    rating: 4.6,
    version: '2.0',
  },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [selectedModType, setSelectedModType] = useState<string | null>(null);

  const filteredFiles = mockFiles.filter(file => {
    const matchesCategory = !selectedCategory || file.category === selectedCategory;
    const matchesSearch = !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = !selectedGame || (file as any).game === selectedGame;
    const matchesContentType = !selectedContentType || (file as any).contentType === selectedContentType;
    const matchesModType = !selectedModType || (file as any).modType === selectedModType;
    return matchesCategory && matchesSearch && matchesGame && matchesContentType && matchesModType;
  });

  const currentContentType = contentTypes.find(c => c.id === selectedContentType);

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
                  className="pl-10 bg-card border-primary/30 focus:border-primary neon-border"
                />
              </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 bg-card border-2 hover:scale-105 ${
                selectedCategory === category.id
                  ? 'border-primary neon-border'
                  : 'border-primary/20 hover:border-primary/50'
              }`}
              onClick={() => {
                setSelectedCategory(selectedCategory === category.id ? null : category.id);
                setSelectedGame(null);
                setSelectedContentType(null);
                setSelectedModType(null);
              }}
            >
              <CardContent className="p-6 text-center">
                <Icon name={category.icon} className={`mx-auto mb-3 ${category.color}`} size={32} />
                <h3 className="font-bold text-lg">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCategory === 'games' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">Выберите игру:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={!selectedGame ? "default" : "outline"}
                onClick={() => {
                  setSelectedGame(null);
                  setSelectedContentType(null);
                  setSelectedModType(null);
                }}
                className="neon-border-secondary"
              >
                Все игры
              </Button>
              {gamesList.map((game) => (
                <Button
                  key={game}
                  variant={selectedGame === game ? "default" : "outline"}
                  onClick={() => {
                    setSelectedGame(game);
                    setSelectedContentType(null);
                    setSelectedModType(null);
                  }}
                  className="neon-border-secondary"
                >
                  {game}
                </Button>
              ))}
            </div>
          </div>
        )}

        {selectedGame && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-secondary">Тип контента:</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedContentType ? "default" : "outline"}
                onClick={() => {
                  setSelectedContentType(null);
                  setSelectedModType(null);
                }}
                className="neon-border"
              >
                Всё
              </Button>
              {contentTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedContentType === type.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedContentType(type.id);
                    setSelectedModType(null);
                  }}
                  className="neon-border"
                >
                  <Icon name={type.icon} className="mr-2" size={16} />
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {selectedContentType === 'mods' && currentContentType?.subcategories && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-accent">Категория модов:</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedModType ? "default" : "outline"}
                onClick={() => setSelectedModType(null)}
                className="neon-border"
              >
                Всё
              </Button>
              {currentContentType.subcategories.map((modType) => (
                <Button
                  key={modType}
                  variant={selectedModType === modType ? "default" : "outline"}
                  onClick={() => setSelectedModType(modType)}
                  className="neon-border"
                >
                  {modType}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="bg-card border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:scale-105 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-xl text-primary group-hover:neon-glow transition-all">
                    {file.name}
                  </h3>
                  <Badge variant="outline" className="border-accent text-accent">
                    v{file.version}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {(file as any).type && (
                    <Badge variant="default" className="mb-2 bg-accent text-background">
                      {(file as any).type}
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="HardDrive" size={16} />
                    <span>{file.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Download" size={16} />
                    <span>{file.downloads.toLocaleString()} загрузок</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Star" size={16} className="text-accent fill-accent" />
                    <span className="text-accent font-semibold">{file.rating}</span>
                  </div>
                  {file.subcategory && (
                    <Badge variant="secondary" className="mt-2">
                      {file.subcategory}
                    </Badge>
                  )}
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full bg-primary hover:bg-primary/80 text-background font-bold neon-border">
                      <Icon name="Download" size={18} className="mr-2" />
                      Скачать
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-card border-l-2 border-primary neon-border">
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-black neon-glow">{file.name}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Описание</h4>
                        <p className="text-sm text-muted-foreground">
                          Высококачественный контент для вашей игры. Улучшенная графика, оптимизация и новые возможности.
                        </p>
                      </div>
                      <div className="border-t border-primary/20 pt-4">
                        <h4 className="font-semibold mb-3 text-primary">Характеристики</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Версия:</span>
                            <span className="font-semibold text-accent">{file.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Размер:</span>
                            <span className="font-semibold">{file.size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Загрузок:</span>
                            <span className="font-semibold">{file.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Рейтинг:</span>
                            <span className="font-semibold text-accent">{file.rating} ★</span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-secondary hover:bg-secondary/80 text-background font-bold neon-border-secondary mt-6">
                        <Icon name="Download" size={18} className="mr-2" />
                        Начать загрузку
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-16">
            <Icon name="SearchX" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}
      </div>

      <footer className="border-t border-primary/20 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 BOX_GAME. Портал для скачивания игр, модов и контента.
          </p>
        </div>
      </footer>
    </div>
  );
}