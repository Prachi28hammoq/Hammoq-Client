import React, { useState } from "react";
import "./Carousel.css";

const Carousel = (props) => {
  return (
    <div
      style={{ display: "inline-flex", margin: "0 auto", marginBottom: "40px" }}
    >
      {[...Array(props.numberOfDots)].map((e, i) => (
        <div
          className={
            props.selectedDot == i
              ? "carousel_dot_active"
              : "carousel_dot_inactive"
          }
        ></div>
      ))}
    </div>
  );
};

export default Carousel;
