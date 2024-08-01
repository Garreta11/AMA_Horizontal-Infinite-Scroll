import React, { useRef, useEffect, useState } from 'react';
import styles from './InfiniteScroll.module.scss';
import gsap from 'gsap';

import useOnScreen from '../../utils/useOnScreen';

let iteration = 1;

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
  const [dirScroll, setDirScroll] = useState(null);
  const carouselRef = useRef();
  const carouselWrapperRef = useRef();
  const carouselInnerRef = useRef();

  const infoRef = useRef();

  const widthRef = useRef();

  const positionScroll = useRef(0);

  const [carouselContent, isOnScreen] = useOnScreen({ threshold: 0.0 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredInfoElement, setHoveredInfoElement] = useState(null);

  useEffect(() => {
    if (!carouselRef.current) return;
    carouselContent.current = carouselInnerRef.current;

    widthRef.current = 0;

    const buildCarousel = () => {
      widthRef.current = parseFloat(
        getComputedStyle(carouselContent.current).getPropertyValue('width'),
        10
      );

      // positionScroll.current = -width;

      if (!carouselContent.current) return;
      // Append
      const carouselContentCloneAppend =
        carouselContent.current.cloneNode(true);
      carouselContentCloneAppend.style.left =
        iteration * widthRef.current + 'px';
      carouselContentCloneAppend.dataset.id = 0;
      carouselWrapperRef.current.append(carouselContentCloneAppend);

      // Prepend
      const carouselContentClonePrepend =
        carouselContent.current.cloneNode(true);
      carouselContentClonePrepend.style.left =
        iteration * -widthRef.current + 'px';
      carouselContentClonePrepend.dataset.id = 2;
      carouselWrapperRef.current.prepend(carouselContentClonePrepend);
    };

    setTimeout(buildCarousel, 500);

    const handleWheel = (event) => {
      positionScroll.current += event.deltaY;
      carouselWrapperRef.current.style.transform =
        'translateX(' + positionScroll.current + 'px)';

      if (event.deltaY > 0) {
        setDirScroll('right');
      } else {
        setDirScroll('left');
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [media]);

  useEffect(() => {
    if (isOnScreen) {
      console.log('CENTER');
    } else {
      console.log('NO CENTER');
      if (dirScroll === 'left') {
        iteration++;
        const centerSibling = carouselContent.current.nextElementSibling;

        const prevSibling = carouselContent.current.previousElementSibling;
        prevSibling.style.left = iteration * widthRef.current + 'px';

        carouselContent.current = centerSibling;
        carouselContent.current.after(prevSibling);
      } else if (dirScroll === 'right') {
        iteration++;
        const centerSibling = carouselContent.current.previousElementSibling;

        const nextSibling = carouselContent.current.nextElementSibling;
        nextSibling.style.left = -iteration * widthRef.current + 'px';

        carouselContent.current = centerSibling;
        carouselContent.current.before(nextSibling);
      }
    }
  }, [isOnScreen]);

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
      // setHoveredInfoElement(media[id].info);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  useEffect(() => {
    if (infoRef.current) {
      const { width, height } = infoRef.current.getBoundingClientRect();
      infoRef.current.style.left = `${mousePosition.x - width / 2}px`;
      infoRef.current.style.top = `${mousePosition.y - height / 2}px`;
    }
  }, [mousePosition]);

  return (
    <>
      <div ref={carouselRef} className={styles.carousel}>
        <div ref={carouselWrapperRef} className={styles.carousel__wrapper}>
          <div
            data-id={1}
            ref={carouselInnerRef}
            className={styles.carousel__inner}
          >
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
