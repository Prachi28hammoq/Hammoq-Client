import React from "react";

export default (props) => {
  return (
    <button
      className={`btn btn-${
        props.category === props.selectedCategory ? "dark" : "outline-primary"
      } btn-sm mx-1`}
      id="category"
      onClick={() => props.setCategory(props.category)}
    >
      {props.category}
    </button>
  );
};
