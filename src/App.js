import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import ImageGrid from "./components/ImageGrid";
import Lightbox from "react-image-lightbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-image-lightbox/style.css";
import "./App.css";

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState("light");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

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

  const fetchImages = async () => {
    const API_KEY = "_pk_LFx614VAsvRbuRL1X11lS5Ub8bQUEaVLAw29RGc";
    const url = `https://api.unsplash.com/search/photos?query=${query || "nature"}&page=${page}&client_id=${API_KEY}`;

    try {
      const response = await axios.get(url);
      setImages((prevImages) => [...prevImages, ...response.data.results]);
    } catch (error) {
      console.error("Erreur lors de la récupération des images :", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page, fetchImages]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.query.value;
    if (!searchInput.trim()) return;

    setQuery(searchInput);
    setPage(1);
    setImages([]);
    saveSearch(searchInput);
  };

  const handleHistoryClick = (query) => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const addToFavorites = (image) => {
    setFavorites((prevFavorites) => [...prevFavorites, image]);
    // Afficher une notification
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
    <div className={`App ${theme}`}>
      <ToastContainer /> {/* Container pour les notifications */}
      <header>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "Mode sombre" : "Mode clair"}
        </button>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="toggle-view"
        >
          {showFavorites ? "Retour à la galerie" : "Voir les favoris"}
        </button>
        <h1>Galerie d'images</h1>
      </header>

      {!showFavorites && (
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
                onClick={() => handleHistoryClick(item)}
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
      )}

      {showFavorites && (
        <div className="favorites">
          <h2>Mes favoris</h2>
          <ImageGrid images={favorites} openLightbox={openLightbox} />
        </div>
      )}

      {lightboxOpen && currentImage && (
        <Lightbox
          mainSrc={currentImage.urls.full}
          onCloseRequest={() => setLightboxOpen(false)}
          imageCaption={currentImage.description || "Image sans description"}
        />
      )}
    </div>
  );
};

export default App;
