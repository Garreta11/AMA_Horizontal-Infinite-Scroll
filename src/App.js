import './App.scss';

import React, { useEffect, useState } from 'react';

import Slider from './components/Slider/Slider';
import SliderMobile from './components/SliderMobile/SliderMobile';

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

function App() {
  const isMobile = useIsMobile();

  const media = [
    {
      src: '/img1.jpg',
      type: 'image',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.',
    },
    {
      src: '/img2.jpg',
      type: 'image',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultricies ligula sed magna dictum porta.',
    },
    {
      src: '/video1.mp4',
      type: 'video',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget tortor risus. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. ',
    },
    {
      src: '/img3.jpg',
      type: 'image',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor accumsan tincidunt. ',
    },
    {
      src: '/img4.jpg',
      type: 'image',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    },
    {
      src: '/img5.jpg',
      type: 'image',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Proin eget tortor risus. Nulla quis lorem ut libero malesuada feugiat. Donec sollicitudin molestie malesuada.',
    },
  ];

  return (
    <div className='App'>
      {!isMobile && <Slider media={media} />}
      {isMobile && <SliderMobile media={media} />}
    </div>
  );
}

export default App;
