import React from "react";

const ButtonGroup = (props) => {
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
export default ButtonGroup;
