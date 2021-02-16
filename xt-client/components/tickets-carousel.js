import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TicketsList from './tickets-list';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators
} from 'reactstrap';
import styles from '../styles/TicketsCarousel.module.scss';
import { Container, Row, Col } from 'reactstrap';

const TicketsCarousel = ({ tickets, category }) => {
  const [numCardsInRow, setnumCardsInRow] = useState(5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const updateNumberInRow = () => {
    const vw = window.innerWidth;
    const cw = 265;
    const iw = vw * 0.04 * 2;
    const numInRow = Math.floor((vw - iw) / cw);
    setnumCardsInRow(numInRow);
  }

  const arrayToChuncks = (arr, chunkSize) => {
    var index = 0;
    var arrayLength = arr.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunkSize) {
      const chunck = arr.slice(index, index + chunkSize);
      tempArray.push(chunck);
    }

    return tempArray;
  }

  useEffect(() => {
    updateNumberInRow();

    window.addEventListener('resize', updateNumberInRow);

    return () => {
      window.removeEventListener('resize', updateNumberInRow);
    }
  }, []);

  if (!tickets) {
    return null;
  }

  const items = arrayToChuncks(tickets, numCardsInRow).map((ticketsCunck, index) => (
    <CarouselItem
      onExiting={ () => setAnimating(true) }
      onExited={ () => setAnimating(false) }
      key={ `item-${index}` }
    >
      <TicketsList tickets={ ticketsCunck } />
    </CarouselItem>
  ));

  return (
    <div className={ styles.CategoryRow }>
      <h2>{ category }</h2>
      <Carousel
        activeIndex={ activeIndex }
        next={ next }
        previous={ previous }
        interval={ false }
      >
        <CarouselIndicators items={ items } activeIndex={ activeIndex } onClickHandler={ goToIndex } />
        { items }
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={ previous } />
        <CarouselControl direction="next" directionText="Next" onClickHandler={ next } />
      </Carousel>
    </div>
  )
}

TicketsCarousel.propTypes = {
  tickets: PropTypes.array,
  category: PropTypes.string
}

export default TicketsCarousel;
