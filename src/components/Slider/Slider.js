import React, { useEffect, useRef, useState } from 'react';
import styles from './Slider.module.scss';

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

const Slider = ({ media }) => {
  const isMobile = useIsMobile();

  const sliderRef = useRef(null);
  const sliderWrapperRef = useRef(null);

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

    const getClonesHeight = () => {
      let height = 0;
      clones.forEach((clone, index) => {
        height += clone.offsetHeight;
      });
      return height;
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

      sliderWrapperRef.current.style.transform = isMobile
        ? `translateY(${-window.scrollY}px)`
        : `translateX(${-window.scrollY}px)`;

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
      clonesWidth = isMobile ? getClonesHeight() : getClonesWidth();
      console.log(sliderWidth, clonesWidth);
    };

    setTimeout(onLoad, 500);
  }, [media]);

  return (
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
  );
};

export default Slider;
