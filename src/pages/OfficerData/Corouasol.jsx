import { useState, useEffect, useRef } from "react";
import img1 from "../../Images/img1.jpg";
import img2 from "../../Images/img2.jpg";
import img3 from "../../Images/img3.jpg";
import img4 from "../../Images/img4.jpg";

const slides = [
  {
    img: img1,
    author: "LUNDEV",
    title: "DESIGN SLIDER",
    topic: "ANIMAL",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit...",
  },
  {
    img: img2,
    author: "LUNDEV",
    title: "DESIGN SLIDER",
    topic: "ANIMAL",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit...",
  },
  {
    img: img3,
    author: "LUNDEV",
    title: "DESIGN SLIDER",
    topic: "ANIMAL",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit...",
  },
  {
    img: img4,
    author: "LUNDEV",
    title: "DESIGN SLIDER",
    topic: "ANIMAL",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit...",
  },
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [thumbnailTranslateX, setThumbnailTranslateX] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const timeoutRef = useRef(null);
  const thumbnailStep = 170; // 150px width + 20px gap
  const totalSlides = slides.length;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 7000);

    return () => {
      resetTimeout();
    };
  }, [activeIndex]);

  useEffect(() => {
    if (isResetting) {
      setThumbnailTranslateX(activeIndex * thumbnailStep);
      setIsResetting(false);
    } else {
      let newTranslate = activeIndex * thumbnailStep;
      if (direction === "next" && activeIndex === 0) {
        newTranslate = totalSlides * thumbnailStep;
        setIsResetting(true);
      } else if (direction === "prev" && activeIndex === totalSlides - 1) {
        newTranslate = -thumbnailStep;
        setIsResetting(true);
      }
      setThumbnailTranslateX(newTranslate);
    }
  }, [activeIndex, direction]);

  const handleNext = () => {
    setDirection("next");
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setDirection("prev");
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleThumbnailClick = (index) => {
    setDirection(index > activeIndex ? "next" : "prev");
    setActiveIndex(index);
  };

  return (
    <div className="h-screen bg-black text-gray-200 font-poppins text-sm">
      <header className="w-[1140px] max-w-[80%] h-12 mx-auto flex items-center relative z-[100]">
        <nav className="flex gap-10">
          <a href="#" className="text-gray-200">
            Home
          </a>
          <a href="#" className="text-gray-200">
            Contacts
          </a>
          <a href="#" className="text-gray-200">
            Info
          </a>
        </nav>
      </header>

      <div
        className={`carousel relative h-[100vh] -mt-12 overflow-hidden ${direction}`}
      >
        <div className="list relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`item absolute inset-0 w-full h-full transition-opacity duration-500 ${
                index === activeIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.img}
                className="w-full h-full object-cover"
                alt="Slide"
              />
              <div className="content absolute top-[20%] left-1/2 -translate-x-1/2 w-[1140px] max-w-[80%] pr-[30%] text-white text-shadow">
                <div className="author font-bold tracking-[10px] animate-showContent">
                  {slide.author}
                </div>
                <div className="title text-5xl font-bold leading-[1.3] animate-showContent">
                  {slide.title}
                </div>
                <div className="topic text-5xl font-bold text-[#f1683a] animate-showContent">
                  {slide.topic}
                </div>
                <p className="des my-4 animate-showContent">
                  {slide.description}
                </p>
                <div className="buttons grid grid-cols-[repeat(2,130px)] grid-rows-[40px] gap-1 mt-5 animate-showContent">
                  <button className="bg-gray-200 text-black tracking-[3px] font-medium">
                    SEE MORE
                  </button>
                  <button className="border border-white bg-transparent text-gray-200">
                    SUBSCRIBE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="thumbnail-wrapper absolute bottom-12 left-2/3 -translate-x-1/2 w-[85vw] max-w-[800px] h-[220px] overflow-hidden z-[100]">
          <div
            className="thumbnail flex gap-5 transition-transform duration-500"
            style={{ transform: `translateX(-${thumbnailTranslateX}px)` }}
            onTransitionEnd={() => {
              if (isResetting) {
                setThumbnailTranslateX(activeIndex * thumbnailStep);
                setIsResetting(false);
              }
            }}
          >
            {[...slides, ...slides].map((slide, index) => (
              <div
                key={index}
                className="item w-[150px] h-[220px] shrink-0 relative cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => handleThumbnailClick(index % totalSlides)}
              >
                <img
                  src={slide.img}
                  className="w-full h-full object-cover rounded-xl"
                  alt="Thumbnail"
                />
                <div className="content absolute bottom-2 left-2 right-2 text-white">
                  <div className="title font-medium">Name Slider</div>
                  <div className="description font-light">Description</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="arrows absolute top-[80%] right-[62%] z-[100] w-[300px] max-w-[30%] flex gap-2 items-center">
          <button
            className="w-10 h-10 rounded-full bg-gray-200/40 text-white font-bold hover:bg-gray-200 hover:text-black transition-colors"
            onClick={handlePrev}
          >
            &lt;
          </button>
          <button
            className="w-10 h-10 rounded-full bg-gray-200/40 text-white font-bold hover:bg-gray-200 hover:text-black transition-colors"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>

        <div className="time absolute z-[1000] h-[3px] bg-[#f1683a] top-0 left-0 animate-runningTime" />
      </div>
    </div>
  );
};

export default Carousel;
