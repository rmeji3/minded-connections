"use client";
import * as React from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

const SLIDES = [
  { src: "/office_1.jpeg", alt: "MindEd Connections office, welcoming desk and seating area" },
  { src: "/office_2.jpeg", alt: "Comfortable seating area for consultations" },
  { src: "/office_3.jpeg", alt: "Full office view with desk and evaluation area" },
];

export function OfficeGallery() {
  const [index, setIndex] = React.useState(-1);

  return (
    <>
      <figure className="office-gallery" aria-label="MindEd Connections office">
        <button
          className="office-gallery-main"
          onClick={() => setIndex(0)}
          aria-label="View office photo 1 fullscreen"
        >
          <Image
            src={SLIDES[0].src}
            alt={SLIDES[0].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="office-gallery-img"
          />
          <span className="gallery-zoom-hint" aria-hidden="true">⤢</span>
        </button>

        <div className="office-gallery-row">
          {SLIDES.slice(1).map((img, idx) => (
            <button
              key={img.src}
              className="office-gallery-thumb"
              onClick={() => setIndex(idx + 1)}
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

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={SLIDES}
        plugins={[Fullscreen]}
      />
    </>
  );
}
