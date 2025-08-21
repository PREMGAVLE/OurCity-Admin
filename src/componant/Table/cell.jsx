import React from "react";
import classNames from "classnames";

const Cell = ({ text, subtext, onClick,bold }) => {
  return (
    <div
      onClick={onClick}
      className={classNames({ "cursor-pointer": onClick })}
    >

      <div className={`font-${bold} text-black`}>{text}</div>
      <div className="text-gray-500 text-sm">{subtext}</div>
    </div>
  );
};

Cell.defaultProps = {};

export default Cell;
