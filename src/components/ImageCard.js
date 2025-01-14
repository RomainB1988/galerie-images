import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ImageCard.css";

const ImageCard = ({ image, addToFavorites, openLightbox }) => {
  // Si l'image n'est pas disponible, affiche un squelette
  if (!image) {
    return (
      <motion.div
        className="image-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton height={200} />
        <Skeleton count={2} style={{ marginTop: "10px" }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="image-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={() => openLightbox(image)} // Ouvre le Lightbox
    >
      <img src={image.urls.small} alt={image.alt_description} />
      <p>{image.description || "Image sans description"}</p>
      <div className="image-actions">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Empêche d'ouvrir le Lightbox
            addToFavorites(image);
          }}
        >
          Ajouter aux favoris
        </button>
        <a href={image.urls.full} download target="_blank" rel="noopener noreferrer">
          <button>Télécharger</button>
        </a>
      </div>
    </motion.div>
  );
};

export default ImageCard;
