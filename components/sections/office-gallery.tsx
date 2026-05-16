"use client";
import * as React from "react";
import Image from "next/image";

const IMAGES = [
  { src: "/office_1.jpeg", alt: "MindEd Connections office — welcoming desk and seating area" },
  { src: "/office_2.jpeg", alt: "Comfortable seating area for consultations" },
  { src: "/office_3.jpeg", alt: "Full office view with desk and evaluation area" },
];

export function OfficeGallery() {
  const [lightbox, setLightbox] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % IMAGES.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + IMAGES.length) % IMAGES.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <>
      <figure className="office-gallery" aria-label="MindEd Connections office">
        <button
          className="office-gallery-main"
          onClick={() => setLightbox(0)}
          aria-label="View office photo 1 fullscreen"
        >
          <Image
            src={IMAGES[0].src}
            alt={IMAGES[0].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="office-gallery-img"
          />
          <span className="gallery-zoom-hint" aria-hidden="true">⤢</span>
        </button>

        <div className="office-gallery-row">
          {IMAGES.slice(1).map((img, idx) => (
            <button
              key={img.src}
              className="office-gallery-thumb"
              onClick={() => setLightbox(idx + 1)}
              aria-label={`View office photo ${idx + 2} fullscreen`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="office-gallery-img"
              />
              <span className="gallery-zoom-hint" aria-hidden="true">⤢</span>
            </button>
          ))}
        </div>

        <figcaption className="office-gallery-caption">
          An ideal environment for focused work, meaningful conversations, and accurate psychological testing.
        </figcaption>
      </figure>

      {lightbox !== null && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightbox(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close image viewer"
          >
            ×
          </button>

          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            <Image
              src={IMAGES[lightbox].src}
              alt={IMAGES[lightbox].alt}
              fill
              sizes="100vw"
              className="lightbox-img"
            />
          </div>

          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + IMAGES.length) % IMAGES.length); }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % IMAGES.length); }}
            aria-label="Next image"
          >
            ›
          </button>

          <div className="lightbox-dots" role="tablist" aria-label="Image navigation">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === lightbox}
                aria-label={`Go to image ${i + 1}`}
                className={`lightbox-dot${i === lightbox ? " is-active" : ""}`}
                onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
