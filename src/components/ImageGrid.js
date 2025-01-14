import React from "react";
import Masonry from "react-masonry-css";
import ImageCard from "./ImageCard";
import "./ImageGrid.css";

const ImageGrid = ({ images, addToFavorites, openLightbox }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          addToFavorites={addToFavorites}
          openLightbox={openLightbox}
        />
      ))}
    </Masonry>
  );
};

export default ImageGrid;
