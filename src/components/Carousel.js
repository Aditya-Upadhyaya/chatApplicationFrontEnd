import { useState } from "react";
import './style.css';
import { Grid } from '@mui/material';

const Carousel = ({ images, size }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLeft , setimageLeft] = useState("./images/LeftArrow.png");
  const [imageRight , setimageRight] = useState("./images/RightArrow.png");

  function handleRightClick() {
    var i = currentIndex + 1;
    if (i >= size) {
      i = 0;
    }
    setCurrentIndex(i);
  }

  function handleLeftClick() {
    var i = currentIndex - 1;
    if (i < 0) {
      i = size - 1;
    }
    setCurrentIndex(i);
  }

  function moverHoverRight() {
    setimageRight("./images/rightHover.png");
  }
  function moverOutRight() {
    setimageRight("./images/RightArrow.png");
  }

  function moverHoverLeft() {
    setimageLeft("./images/leftHover.png");
  }
  function moverOutLeft() {
    setimageLeft("./images/LeftArrow.png");
  }
  


  return (
    <Grid container spacing={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Grid item >
        <img src={imageLeft} width="30" height="30" onClick={handleLeftClick} onMouseOver={moverHoverLeft} onMouseLeave={moverOutLeft}></img>
      </Grid>
      <Grid item >
        <div>
          <img src={images[currentIndex].src} alt="Connection Lost" width="250" height="250"></img>
        </div>
      </Grid>
      <Grid item >
        <img src={imageRight} width="30" height="30" onClick={handleRightClick} onMouseOver={moverHoverRight} onMouseLeave={moverOutRight}></img>
      </Grid>
    </Grid>


  );
};
export default Carousel;