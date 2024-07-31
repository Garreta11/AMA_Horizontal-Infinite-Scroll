import React, { useRef, useEffect, useState } from 'react';
import styles from './Carousel.module.scss';

import gsap from 'gsap';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

const Carousel = ({ media }) => {
  const isMobile = useIsMobile();

  const carouselRef = useRef();
  const infoRef = useRef();
  const tweenRef = useRef();
  const carouselContent = useRef();

  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredInfoElement, setHoveredInfoElement] = useState(null);

  useEffect(() => {
    if (!carouselRef.current) return;
    carouselContent.current = carouselRef.current.firstChild;
    if (!carouselContent.current) return;

    const carouselContentClone = carouselContent.current.cloneNode(true);
    carouselRef.current.append(carouselContentClone);

    const playCarousel = () => {
      let progress = tweenRef.current ? tweenRef.current.progress() : 1;
      tweenRef.current && tweenRef.current.progress(0).kill();

      const width = parseFloat(
        getComputedStyle(carouselContent.current).getPropertyValue('width'),
        10
      );
      const height = parseFloat(
        getComputedStyle(carouselContent.current).getPropertyValue('height'),
        10
      );

      const distanceToTranslate = isMobile ? -1 * height : -1 * width;

      tweenRef.current = isMobile
        ? gsap.fromTo(
            carouselRef.current.children,
            {
              y: 0,
            },
            {
              y: distanceToTranslate,
              duration: 50,
              ease: 'none',
              repeat: -1,
            }
          )
        : gsap.fromTo(
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
      tweenRef.current.progress(progress);
    };

    const handleWheel = (event) => {
      tweenRef.current.pause();

      let p = tweenRef.current.progress();
      p += event.deltaY * 0.001;

      tweenRef.current.progress(p);

      setTimeout(() => {
        tweenRef.current.play();
      }, 100);
    };

    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0].clientY;
      tweenRef.current.pause();
    };

    const handleTouchMove = (event) => {
      touchEndY.current = event.touches[0].clientY;

      let p = tweenRef.current.progress();
      p += (touchStartY.current - touchEndY.current) * 0.00005;
      tweenRef.current.progress(p);

      setTimeout(() => {
        tweenRef.current.play();
      }, 100);
    };

    setTimeout(playCarousel, 500);

    window.addEventListener('resize', playCarousel);
    window.addEventListener('wheel', handleWheel);

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('resize', playCarousel);
      window.removeEventListener('wheel', handleWheel);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
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
