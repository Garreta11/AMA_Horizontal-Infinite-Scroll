import './App.scss';
import Carousel from './components/Carousel/Carousel';

function App() {
  const media = [
    {
      src: '/img1.jpg',
      type: 'image',
      info: 'Lorem Ipsum #1',
    },
    {
      src: '/img2.jpg',
      type: 'image',
      info: 'Lorem Ipsum #2',
    },
    {
      src: '/video1.mp4',
      type: 'video',
      info: 'Lorem Ipsum #3',
    },
    {
      src: '/img3.jpg',
      type: 'image',
      info: 'Lorem Ipsum #4',
    },
    {
      src: '/img4.jpg',
      type: 'image',
      info: 'Lorem Ipsum #5',
    },
    {
      src: '/img5.jpg',
      type: 'image',
      info: 'Lorem Ipsum #6',
    },
  ];

  return (
    <div className='App'>
      <Carousel media={media} />
    </div>
  );
}

export default App;
