import { useState } from 'react';
import './App.css';

interface ImageResult {
  image_url: string;
  score: number;
  index: number;
  image_id: number;
}

interface SearchResponse {
  results: ImageResult[];
  query: string;
}

interface ImagesResponse {
  images: ImageResult[];
  total: number;
}

const API_BASE_URL = 'http://localhost:8080';

const searchImages = async (query: string): Promise<SearchResponse> => {
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  return await response.json();
};

const getAllImages = async (): Promise<ImagesResponse> => {
  const response = await fetch(`${API_BASE_URL}/images`);
  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`);
  }
  return await response.json();
};

function App() {
  const [view, setView] = useState<'search' | 'dataset'>('search');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ImageResult[]>([]);
  const [datasetImages, setDatasetImages] = useState<ImageResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isDatasetLoading, setIsDatasetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearchLoading(true);
    setError(null);

    try {
      const response = await searchImages(query);
      setSearchResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleViewDataset = async () => {
    setView('dataset');
    setIsDatasetLoading(true);
    setError(null);

    try {
      const response = await getAllImages();
      setDatasetImages(response.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dataset');
      setDatasetImages([]);
    } finally {
      setIsDatasetLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (view === 'dataset') {
    return (
      <div className="app">
        <div className="header">
          <h1>FAISS Image Search - Dataset</h1>
          <a href="#" onClick={() => setView('search')} className="back-link">
            ← Back to Search
          </a>
        </div>

        <div className="dataset-container">
          <h2>All Dataset Images ({datasetImages.length} images)</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="image-grid dataset-grid">
            {isDatasetLoading
              ? Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className="image-item">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))
              : datasetImages.map((image) => (
                <div key={image.image_id} className="image-item">
                  <img src={image.image_url} alt={`Dataset image ${image.image_id}`} />
                  <p>Image {image.image_id}.jpg</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>FAISS Image Search HeHe</h1>
        <a href="#" onClick={handleViewDataset} className="dataset-link">
          View Dataset Here
        </a>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="query goes here"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button" disabled={isSearchLoading}>
            Search
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="results-container">
        <div className="image-grid">
          {isSearchLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="image-item">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
              </div>
            ))
            : searchResults.map((result) => (
              <div key={result.image_id} className="image-item">
                <img src={result.image_url} alt={`Search result ${result.image_id}`} />
                <p>Score: {result.score.toFixed(3)}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;