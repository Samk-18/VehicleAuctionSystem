import { useState } from "react";

const ImageCarousel = ({ images, alt = "", height = "220px" }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-light" style={{ height }}>
        <span className="text-muted small">No images</span>
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="position-relative" onClick={(e) => e.stopPropagation()} style={{ overflow: "hidden" }}>
      <img
        src={`http://localhost:8080${images[index].imageUrl}`}
        alt={`${alt} - ${index + 1}`}
        style={{ width: "100%", height, objectFit: "cover", display: "block" }}
      />
      {images.length > 1 && (
        <>
          <button type="button" className="carousel-nav-btn carousel-nav-btn--prev" onClick={prev}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button type="button" className="carousel-nav-btn carousel-nav-btn--next" onClick={next}>
            <i className="bi bi-chevron-right"></i>
          </button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`carousel-dot ${i === index ? "active" : ""}`}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
