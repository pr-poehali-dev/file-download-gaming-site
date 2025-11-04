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

const categories = [
  { id: 'games', name: 'Игры', icon: 'Gamepad2', color: 'text-[hsl(var(--primary))]' },
  { id: 'mods', name: 'Моды', icon: 'Package', color: 'text-[hsl(var(--secondary))]', subcategories: ['Оружие', 'Транспорт', 'Текстуры', 'Карты', 'Скины'] },
  { id: 'scripts', name: 'Скрипты', icon: 'Code', color: 'text-[hsl(var(--accent))]' },
  { id: 'textures', name: 'Текстуры', icon: 'Image', color: 'text-[hsl(var(--primary))]' },
  { id: 'transport', name: 'Транспорт', icon: 'Car', color: 'text-[hsl(var(--secondary))]' },
  { id: 'cheats', name: 'Читы', icon: 'Shield', color: 'text-[hsl(var(--accent))]' },
  { id: 'weapons', name: 'Оружие', icon: 'Sword', color: 'text-[hsl(var(--primary))]' },
  { id: 'info', name: 'Информация', icon: 'Info', color: 'text-[hsl(var(--secondary))]' },
];

const mockFiles = [
  {
    id: 1,
    name: 'GTA V Ultra Graphics Mod',
    category: 'mods',
    subcategory: 'Текстуры',
    size: '2.5 GB',
    downloads: 15420,
    rating: 4.8,
    version: '3.2',
  },
  {
    id: 2,
    name: 'Cyberpunk 2077: Ultimate Edition',
    category: 'games',
    size: '70 GB',
    downloads: 8934,
    rating: 4.9,
    version: '2.1',
  },
  {
    id: 3,
    name: 'Lamborghini Aventador Pack',
    category: 'mods',
    subcategory: 'Транспорт',
    size: '150 MB',
    downloads: 23456,
    rating: 4.7,
    version: '1.5',
  },
  {
    id: 4,
    name: 'AK-47 HD Model',
    category: 'mods',
    subcategory: 'Оружие',
    size: '45 MB',
    downloads: 12890,
    rating: 4.6,
    version: '2.0',
  },
  {
    id: 5,
    name: 'Auto Farm Script',
    category: 'scripts',
    size: '2 MB',
    downloads: 31245,
    rating: 4.5,
    version: '4.3',
  },
  {
    id: 6,
    name: 'Wallhack Pro',
    category: 'cheats',
    size: '5 MB',
    downloads: 45678,
    rating: 4.4,
    version: '1.9',
  },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const filteredFiles = mockFiles.filter(file => {
    const matchesCategory = !selectedCategory || file.category === selectedCategory;
    const matchesSearch = !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubcategory = !selectedSubcategory || file.subcategory === selectedSubcategory;
    return matchesCategory && matchesSearch && matchesSubcategory;
  });

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black glitch neon-glow" data-text="CYBER DOWNLOAD">
              CYBER DOWNLOAD
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
                setSelectedSubcategory(null);
              }}
            >
              <CardContent className="p-6 text-center">
                <Icon name={category.icon} className={`mx-auto mb-3 ${category.color}`} size={32} />
                <h3 className="font-bold text-lg">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {currentCategory?.subcategories && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={!selectedSubcategory ? "default" : "outline"}
              onClick={() => setSelectedSubcategory(null)}
              className="neon-border-secondary"
            >
              Все
            </Button>
            {currentCategory.subcategories.map((sub) => (
              <Button
                key={sub}
                variant={selectedSubcategory === sub ? "default" : "outline"}
                onClick={() => setSelectedSubcategory(sub)}
                className="neon-border-secondary"
              >
                {sub}
              </Button>
            ))}
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
            © 2025 CYBER DOWNLOAD. Портал для скачивания игр, модов и контента.
          </p>
        </div>
      </footer>
    </div>
  );
}
