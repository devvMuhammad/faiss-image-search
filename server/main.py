import torch
import clip
from PIL import Image
import ssl
import faiss
import os
from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

# Fix SSL certificate issues on macOS
ssl._create_default_https_context = ssl._create_unverified_context

app = FastAPI(title="FAISS Image Search API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and index
device = None
model = None
preprocess = None
index = None
image_files = []

def initialize_model_and_index():
    global device, model, preprocess, index, image_files
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load("ViT-B/32", device=device)
    
    d = 512  # dimension of the image features
    index = faiss.IndexFlatL2(d)
    
    # Load and encode all images in the dataset
    with torch.no_grad():
        files = os.listdir("dataset")
        # convert the name to int and sort
        files = [int(file.split(".")[0]) for file in files if file.endswith(".jpg")]
        files.sort()
        image_files = files
        
        for file in files:
            image_path = f"dataset/{file}.jpg"
            image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
            image_features = model.encode_image(image)
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
            index.add(image_features.cpu().numpy())
    
    print(f"Initialized FAISS index with {index.ntotal} images")

def search_images(query: str, k: int = 6) -> List[Dict[str, Any]]:
    """Search for images based on text query"""
    with torch.no_grad():
        text_features = model.encode_text(clip.tokenize(query).to(device))
        text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        text_features = text_features.cpu().numpy()
    
    distances, indices = index.search(text_features, k=k)
    
    results = []
    for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
        if idx != -1:  # Valid index
            image_id = image_files[idx]
            results.append({
                "image_url": f"http://localhost:8080/static/images/{image_id}.jpg",
                "score": float(distance),
                "index": int(idx),
                "image_id": int(image_id)
            })
    
    return results

@app.on_event("startup")
async def startup_event():
    initialize_model_and_index()

# Mount static files for serving images
app.mount("/static/images", StaticFiles(directory="dataset"), name="images")

@app.get("/search")
async def search_endpoint(q: str = Query(..., description="Text query for image search")):
    """Search for images using text query"""
    try:
        results = search_images(q)
        return JSONResponse(content={"results": results, "query": q})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/images")
async def list_images():
    """Get all available images in the dataset"""
    try:
        images = []
        for i, image_id in enumerate(image_files):
            images.append({
                "image_url": f"http://localhost:8080/static/images/{image_id}.jpg",
                "index": i,
                "image_id": int(image_id)
            })
        return JSONResponse(content={"images": images, "total": len(images)})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "FAISS Image Search API",
        "endpoints": {
            "/search?q=<query>": "Search images by text query",
            "/images": "List all available images",
            "/docs": "Interactive API documentation"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
