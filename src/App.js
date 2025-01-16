import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ImageGrid from "./components/ImageGrid";
import Lightbox from "react-image-lightbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-image-lightbox/style.css";
import "./App.css";

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState("light");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setTheme(savedTheme);
    setSearchHistory(savedHistory);
  }, []);

  const saveSearch = (query) => {
    const updatedHistory = [query, ...searchHistory.filter((q) => q !== query)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const fetchImages = useCallback(async () => {
    const API_KEY = "_pk_LFx614VAsvRbuRL1X11lS5Ub8bQUEaVLAw29RGc";
    const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${API_KEY}`;

    try {
      const response = await axios.get(url);
      setImages((prevImages) => [...prevImages, ...response.data.results]);
    } catch (error) {
      console.error("Erreur lors de la récupération des images :", error);
    }
  }, [query, page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.query.value;
    if (!searchInput.trim()) return;

    setQuery(searchInput);
    setPage(1);
    setImages([]);
    saveSearch(searchInput);
  };

  const addToFavorites = (image) => {
    setFavorites((prevFavorites) => [...prevFavorites, image]);
    toast.success("Ajouté aux favoris !", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const openLightbox = (image) => {
    setCurrentImage(image);
    setLightboxOpen(true);
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        <ToastContainer />
        <header>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? "Mode sombre" : "Mode clair"}
          </button>
          <Link to="/" className="toggle-view">
            Galerie
          </Link>
          <Link to="/favorites" className="toggle-view">
            Favoris
          </Link>
          <h1>
            <Link to="/" className="title-link">
              Galerie d'images
            </Link>
          </h1>

        </header>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <form onSubmit={handleSearch}>
                  <input type="text" name="query" placeholder="Rechercher des images..." />
                  <button type="submit">Rechercher</button>
                </form>
                <div className="search-history">
                  <h3>Recherches récentes :</h3>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(item);
                        setPage(1);
                        setImages([]);
                      }}
                      className="history-item"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <InfiniteScroll
                  dataLength={images.length}
                  next={() => setPage((prevPage) => prevPage + 1)}
                  hasMore={true}
                  loader={<h4>Chargement...</h4>}
                >
                  <ImageGrid
                    images={images}
                    addToFavorites={addToFavorites}
                    openLightbox={openLightbox}
                  />
                </InfiniteScroll>
              </>
            }
          />
          <Route
            path="/favorites"
            element={
              <div className="favorites">
                <h2>Mes favoris</h2>
                <ImageGrid images={favorites} openLightbox={openLightbox} />
              </div>
            }
          />
        </Routes>

        {lightboxOpen && currentImage && (
          <Lightbox
            mainSrc={currentImage.urls.full}
            onCloseRequest={() => setLightboxOpen(false)}
            imageCaption={currentImage.description || "Image sans description"}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
