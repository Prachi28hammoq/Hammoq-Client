import React from "react";

export default (props) => {
  return (
    //selected category
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
