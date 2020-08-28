import React from "react";

// reactstrap components
import {
  Carousel,
  CarouselItem,
  CarouselIndicators,
} from "reactstrap";

// core components

function CarouselSection(props) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);
  let items = props.boat.images;
  const onExiting = () => {
    setAnimating(true);
  };
  const onExited = () => {
    setAnimating(false);
  };
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === props.boat.images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };
  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? props.boat.images.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };
  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };
  return (
    <>
      <div className="carousel-container">
        <Carousel
          activeIndex={activeIndex}
          next={next}
          previous={previous}
        >
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {items.map((item) => {
            return (
              <CarouselItem
                onExiting={onExiting}
                onExited={onExited}
              >
                <img
                  src={item}
                  alt=''
                  className="d-block"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>{item.caption}</h5>
                </div>
              </CarouselItem>
            );
          })}
          <a
            className="carousel-control-prev"
            data-slide="prev"
            href="#pablo"
            onClick={(e) => {
              e.preventDefault();
              previous();
            }}
            role="button"
          >
            <i className="now-ui-icons arrows-1_minimal-left"></i>
          </a>
          <a
            className="carousel-control-next"
            data-slide="next"
            href="#pablo"
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
            role="button"
          >
            <i className="now-ui-icons arrows-1_minimal-right"></i>
          </a>
        </Carousel>
      </div>
    </>
  );
}

export default CarouselSection;
