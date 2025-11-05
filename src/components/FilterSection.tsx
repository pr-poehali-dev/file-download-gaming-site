import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { gamesData, contentTypes } from './GameData';

interface FilterSectionProps {
  selectedCategory: string | null;
  selectedGame: string | null;
  selectedContentType: string | null;
  selectedDownloadType: string | null;
  selectedModType: string | null;
  setSelectedGame: (game: string | null) => void;
  setSelectedContentType: (type: string | null) => void;
  setSelectedDownloadType: (type: string | null) => void;
  setSelectedModType: (type: string | null) => void;
}

export default function FilterSection({
  selectedCategory,
  selectedGame,
  selectedContentType,
  selectedDownloadType,
  selectedModType,
  setSelectedGame,
  setSelectedContentType,
  setSelectedDownloadType,
  setSelectedModType,
}: FilterSectionProps) {
  const currentContentType = contentTypes.find(c => c.id === selectedContentType);

  return (
    <>
      {selectedCategory === 'games' && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-primary">Выберите игру:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {gamesData.map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedGame(game.name);
                  setSelectedContentType(null);
                  setSelectedDownloadType(null);
                  setSelectedModType(null);
                }}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  selectedGame === game.name
                    ? 'ring-4 ring-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] scale-105'
                    : 'hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
                }`}
              >
                <div className="aspect-square relative">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-bold text-white text-lg mb-1">{game.name}</h4>
                    <p className="text-white/80 text-sm">{game.description}</p>
                  </div>
                  {selectedGame === game.name && (
                    <div className="absolute top-2 right-2 bg-primary rounded-full p-2">
                      <Icon name="Check" size={20} className="text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
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
                setSelectedDownloadType(null);
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
                  setSelectedDownloadType(null);
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

      {selectedContentType === 'download' && currentContentType?.subcategories && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-accent">Тип версии:</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedDownloadType ? "default" : "outline"}
              onClick={() => setSelectedDownloadType(null)}
              className="neon-border"
            >
              Всё
            </Button>
            {currentContentType.subcategories.map((downloadType) => (
              <Button
                key={downloadType}
                variant={selectedDownloadType === downloadType ? "default" : "outline"}
                onClick={() => setSelectedDownloadType(downloadType)}
                className="neon-border"
              >
                {downloadType}
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
    </>
  );
}