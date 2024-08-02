import React, { useEffect, useRef, useState } from 'react';
import styles from './Slider.module.scss';

const Slider = ({ media }) => {
  const sliderRef = useRef(null);
  const sliderWrapperRef = useRef(null);

  const infoRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredInfoElement, setHoveredInfoElement] = useState(null);

  useEffect(() => {
    let clonesWidth;
    let sliderWidth;
    let clones = [];
    let disableScroll = false;
    let scrollPos;

    let items = [...document.querySelectorAll('.slider-item')];

    const getClonesWidth = () => {
      let width = 0;
      clones.forEach((clone, index) => {
        width += clone.offsetWidth;
      });
      return width;
    };

    const getScrollPos = () => {
      return window.scrollY;
    };

    const scrollUpdate = () => {
      scrollPos = getScrollPos();

      if (clonesWidth + scrollPos >= sliderWidth) {
        window.scrollTo({ top: 1 });
      } else if (scrollPos <= 0) {
        window.scrollTo({ top: sliderWidth - clonesWidth - 1 });
      }

      sliderWrapperRef.current.style.transform = `translateX(${-window.scrollY}px)`;

      requestAnimationFrame(scrollUpdate);
    };

    const onLoad = () => {
      items.forEach((item, index) => {
        let clone = item.cloneNode(true);
        clone.classList.add('clone');
        sliderWrapperRef.current.appendChild(clone);
        clones.push(clone);
      });

      calculateDimensions();
      document.body.style.height = `${sliderWidth}px`;
      window.scrollTo({ top: 1 });
      scrollUpdate();
    };

    const calculateDimensions = () => {
      sliderWidth = sliderWrapperRef.current.getBoundingClientRect().width;
      clonesWidth = getClonesWidth();
    };

    setTimeout(onLoad, 500);
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
      const { width, height } = infoRef.current.getBoundingClientRect();
      infoRef.current.style.left = `${mousePosition.x - width / 2}px`;
      infoRef.current.style.top = `${mousePosition.y - height / 2}px`;
    }
  }, [mousePosition]);

  return (
    <>
      <div ref={sliderRef} className={styles.slider}>
        <div ref={sliderWrapperRef} className={styles.slider__wrapper}>
          {media.map((mediaItem, i) => {
            if (mediaItem.type === 'image') {
              return (
                <div
                  key={i}
                  className={`${styles.slider__item} slider-item`}
                  style={{ width: `${mediaItem.width}px` }}
                >
                  <img
                    className={styles.slider__item__media}
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
                  className={`${styles.slider__item} slider-item`}
                  style={{ width: `${mediaItem.width}px` }}
                >
                  <video
                    className={styles.slider__item__media}
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

export default Slider;
