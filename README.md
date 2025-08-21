# FAISS Image Search System

A semantic image search system powered by OpenAI's CLIP model and Facebook's FAISS library. Search through images using natural language queries by leveraging the power of multimodal embeddings.

<img width="1200" height="772" alt="image" src="https://github.com/user-attachments/assets/936abcb8-27cd-49c3-87a1-3b2b123c8f98" />

## 🔍 What is Image Search with FAISS?

### CLIP (Contrastive Language-Image Pre-Training)
CLIP is OpenAI's groundbreaking model that understands both images and text in the same embedding space. It can:
- Encode images into 512-dimensional vectors that capture semantic meaning
- Encode text descriptions into the same vector space
- Enable semantic similarity search between text queries and images

### FAISS (Facebook AI Similarity Search)
FAISS is Facebook's library for efficient similarity search and clustering of dense vectors. It provides:
- Lightning-fast nearest neighbor search
- Scalable indexing for millions of vectors
- Multiple distance metrics (L2, cosine, etc.)
- GPU acceleration support

### How It Works
1. **Indexing**: Images are processed through CLIP's vision encoder to create 512D embeddings
2. **Storage**: Embeddings are stored in a FAISS index for fast retrieval
3. **Search**: Text queries are encoded using CLIP's text encoder
4. **Matching**: FAISS finds the most similar image embeddings to the query embedding
5. **Results**: Return ranked images with similarity scores

## 🛠️ Technology Stack

### Backend
- **Python 3.8+** - Core runtime
- **PyTorch** - Deep learning framework
- **OpenAI CLIP** - Multimodal AI model (ViT-B/32)
- **FAISS** - Vector similarity search
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pillow (PIL)** - Image processing

### Frontend
- **React 19.1.1** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with animations
- **ESLint** - Code linting and formatting

## 🚀 API Endpoints

### Search Images
```
GET /search?q=<query>
```
Search for images using natural language text.

**Parameters:**
- `q` (string, required): Text query for image search

**Response:**
```json
{
  "results": [
    {
      "image_url": "http://localhost:8080/static/images/15.jpg",
      "score": 0.24,
      "index": 15,
      "image_id": 15
    }
  ],
  "query": "cat on a sofa"
}
```

### List All Images
```
GET /images
```
Get all available images in the dataset.

**Response:**
```json
{
  "images": [
    {
      "image_url": "http://localhost:8080/static/images/0.jpg",
      "index": 0,
      "image_id": 0
    }
  ],
  "total": 31
}
```

### API Documentation
```
GET /docs
```
Interactive Swagger/OpenAPI documentation.

### Health Check
```
GET /
```
Basic API information and available endpoints.

## 📁 Project Structure

```
faiss-image-search/
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.tsx           # Main application component
│   │   ├── App.css           # Styling and animations
│   │   └── main.tsx          # Application entry point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
├── server/                    # Python backend
│   ├── main.py               # FastAPI application
│   └── dataset/              # Image dataset (31 images)
│       ├── 0.jpg
│       ├── 1.jpg
│       └── ...
├── train2014/                 # Original COCO dataset
├── requirements.txt           # Python dependencies
└── CLAUDE.md                 # Development instructions
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd faiss-image-search
```

### 2. Set Up Backend
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
cd server
python main.py
```
The backend will be available at `http://localhost:8000`

### 3. Set Up Frontend
```bash
# Install Node.js dependencies
cd client
npm install

# Start the development server
npm run dev
```
The frontend will be available at `http://localhost:5173`

### 4. Start Searching!
Open your browser and navigate to `http://localhost:5173` to start searching images with natural language queries.

## 🎯 Example Queries

Try these example searches to see the system in action:

- `"cat sleeping on a bed"`
- `"person riding a bicycle"`
- `"food on a plate"`
- `"car on a street"`
- `"dog playing in water"`
- `"people at a beach"`

## 🔧 Development

### Backend Development
```bash
cd server
python main.py
```

### Frontend Development
```bash
cd client
npm run dev
```

### Building for Production
```bash
cd client
npm run build
```

### Linting
```bash
cd client
npm run lint
```

## 📊 Dataset

The system currently uses a subset of the COCO train2014 dataset containing 31 carefully selected images for demonstration purposes. The images are stored in:
- `server/dataset/` - Processed dataset (numbered 0.jpg to 30.jpg)
- `train2014/` - Original COCO images

## ⚡ Performance Notes

- **First Query**: Initial model loading takes ~10-30 seconds
- **Subsequent Queries**: Lightning fast (<100ms)
- **GPU Acceleration**: Automatically detected and used if available
- **Memory Usage**: ~2GB RAM for model and index
- **Scalability**: Can handle millions of images with proper FAISS configuration

## 🔒 Security Features

- CORS protection configured for development
- SSL certificate handling for macOS compatibility
- No sensitive data exposure in API responses
- Secure file serving through FastAPI static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

---

Built with ❤️ using CLIP, FAISS, React, and FastAPI
