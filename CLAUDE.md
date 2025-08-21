# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a FAISS-based image search system that uses OpenAI's CLIP model for semantic image retrieval. The system allows searching for images using natural language text queries by encoding both images and text into the same vector space.

## Core Architecture

- **main.py**: Main script that loads CLIP model, encodes images from the `subset/` directory into FAISS index, and performs text-to-image search
- **FAISS Index**: Uses L2 distance metric with 512-dimensional vectors (CLIP ViT-B/32 features)
- **CLIP Model**: OpenAI's ViT-B/32 model for encoding both images and text queries
- **Image Dataset**: COCO train2014 dataset stored in `train2014/` and `dataset/` directories
- **Processing Pipeline**: Images are preprocessed using CLIP's preprocess function and normalized before indexing

## Key Components

### Image Processing
- Images are loaded from `subset/` directory (numbered 0.jpg, 1.jpg, etc.)
- CLIP preprocessing and encoding to 512-dimensional vectors
- L2 normalization of feature vectors before indexing

### Search Process
1. Text query encoded using CLIP text encoder
2. Normalized text features used to search FAISS index
3. Returns k nearest neighbors with distances and indices

### Dataset Structure
- `subset/`: Contains numbered image files (0.jpg, 1.jpg, ..., 30.jpg)
- `train2014/`: Original COCO train2014 images with COCO naming
- `dataset/`: Contains COCO annotations and metadata

## Frontend Web Interface

### Client Application Structure
- **React + TypeScript + Vite** setup in `client/` directory
- **Components**: Single-page application with two main views:
  - Search interface with query input and results grid
  - Dataset viewer showing all available images
- **Styling**: Custom CSS with responsive design and skeleton loading animations

### UI Features
- **Search Interface**: Text input with search button, displays 6 image results in grid
- **Dataset View**: Shows all 31 images from the subset in a grid layout
- **Loading States**: Skeleton loader cards with shimmer animation during API calls
- **Responsive Design**: Works on desktop and mobile devices
- **Navigation**: "View Dataset Here" link and back button for navigation

### Fake API Simulation
- 2.5-second delay simulation for realistic loading experience
- Dummy image generation using Picsum for development
- Mock distance scores for search results
- Matches actual dataset size (31 images in subset)

## Development Commands

### Running the Backend Search
```bash
python main.py
```

### Running the Frontend Client
```bash
cd client
npm install
npm run dev
```

### Building the Frontend
```bash
cd client
npm run build
```

### Dataset Management
```bash
# Rename files in subset to indexed format (0.jpg, 1.jpg, etc.)
./rename_subset.sh
```

## Dependencies

### Backend (Python)
- PyTorch
- CLIP (OpenAI)
- FAISS
- PIL (Pillow)

### Frontend (Node.js)
- React 19.1.1
- TypeScript
- Vite
- ESLint

## Notes

- SSL certificate verification is disabled for macOS compatibility
- Uses CUDA if available, falls back to CPU
- Current implementation searches for "zebra green" as example query
- Returns top 10 most similar images with distances and indices
- Frontend currently uses mock data - needs integration with Python backend
- Images load from Picsum.photos for development purposes