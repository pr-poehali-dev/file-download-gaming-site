import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { gamesList, contentTypes } from './GameData';

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
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-primary">Выберите игру:</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={!selectedGame ? "default" : "outline"}
              onClick={() => {
                setSelectedGame(null);
                setSelectedContentType(null);
                setSelectedDownloadType(null);
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
                  setSelectedDownloadType(null);
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
