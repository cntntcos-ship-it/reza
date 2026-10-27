import { useEffect, useState } from 'react';
import { formatNumber } from '../../lib/format.js';

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [name]);

  if (!images?.length) return null;

  return (
    <div className={`gallery ${images.length > 1 ? 'gallery--thumbs' : ''}`}>
      {images.length > 1 ? (
        <div className="gallery__thumbs">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`gallery__thumb ${index === active ? 'is-active' : ''}`}
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              aria-label={`نمایش تصویر ${formatNumber(index + 1)} از ${formatNumber(images.length)}`}
            >
              <img src={src} alt="" width={120} height={150} loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="gallery__main">
        {images.map((src, index) => (
          <img
            key={src}
            className={`gallery__image ${index === active ? 'is-active' : ''}`}
            src={src}
            alt={`${name} — تصویر ${formatNumber(index + 1)}`}
            width={900}
            height={1125}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}
