import React from "react";

const ButtonGroup = (props) => {
  return (
    <button
      type="button"
      className={`btn btn-${
        props.category === props.selectedCategory ? "secondary" : "outline-secondary"
      } btn-sm`}
      id="category"
      onClick={() => props.setCategory(props.category)}
    >
      {props.category}
    </button>
  );
};
export default ButtonGroup;