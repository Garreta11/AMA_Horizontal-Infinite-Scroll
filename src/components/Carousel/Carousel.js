import React, { useRef, useEffect, useState } from 'react';
import styles from './Carousel.module.scss';

import gsap from 'gsap';

const Carousel = ({ media }) => {
  const carouselRef = useRef();
  const infoRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredInfoElement, setHoveredInfoElement] = useState(null);

  // Media Carousel
  useEffect(() => {
    if (!carouselRef.current) return;
    const carouselContent = carouselRef.current.firstChild;
    if (!carouselContent) return;

    const carouselContentClone = carouselContent.cloneNode(true);
    carouselRef.current.append(carouselContentClone);

    let tween;

    const playCarousel = () => {
      let progress = tween ? tween.progress() : 0;
      tween && tween.progress(0).kill();

      const width = parseFloat(
        getComputedStyle(carouselContent).getPropertyValue('width'),
        10
      );

      const distanceToTranslate = -1 * width;

      tween = gsap.fromTo(
        carouselRef.current.children,
        {
          x: 0,
        },
        {
          x: distanceToTranslate,
          duration: 50,
          ease: 'none',
          repeat: -1,
        }
      );
      tween.progress(progress);
    };

    setTimeout(playCarousel, 500);

    window.addEventListener('resize', playCarousel);
  }, [media]);

  // Mouse Position
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element) return;
      const id = element?.getAttribute('data-id');
      setHoveredInfoElement(media[id].info);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  useEffect(() => {
    if (infoRef.current) {
      infoRef.current.style.left = `${mousePosition.x}px`;
      infoRef.current.style.top = `${mousePosition.y}px`;
    }
  }, [mousePosition]);

  return (
    <>
      <div ref={carouselRef} className={styles.carousel}>
        <div className={styles.carousel__inner}>
          {media.map((mediaItem, i) => {
            if (mediaItem.type === 'image') {
              return (
                <div
                  key={i}
                  className={styles.carousel__item}
                  style={{ width: `${mediaItem.width}px` }}
                >
                  <img
                    className={styles.carousel__item__media}
                    src={mediaItem.src}
                    data-id={i}
                    alt={`media-${i}`}
                  />
                </div>
              );
            } else if (mediaItem.type === 'video') {
              return (
                <div
                  key={i}
                  className={styles.carousel__item}
                  style={{ width: `${mediaItem.width}px` }}
                >
                  <video
                    className={styles.carousel__item__media}
                    data-id={i}
                    muted
                    controls={false}
                    autoPlay={true}
                    loop
                  >
                    <source src={mediaItem.src} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            } else {
              return null; // handle any other types if necessary
            }
          })}
        </div>
      </div>

      {hoveredInfoElement && (
        <div ref={infoRef} className={styles.info}>
          {hoveredInfoElement}
        </div>
      )}
    </>
  );
};

export default Carousel;
