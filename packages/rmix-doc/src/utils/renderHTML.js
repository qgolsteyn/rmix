import React from "react";

const rmixToReact = ([tag, ...tail]) => {
  if (tag.match(/^html\./)) {
    const HTMLTag = tag.split(".")[1];

    return (
      <HTMLTag>
        {tail.map((item) => {
          if (Array.isArray(item)) {
            return rmixToReact(item);
          } else {
            return item + " ";
          }
        })}
      </HTMLTag>
    );
  } else {
    return (
      <>
        {[tag, ...tail].map((item) => {
          if (Array.isArray(item)) {
            return rmixToReact(item);
          } else if (item !== "_") {
            return item + " ";
          }
        })}
      </>
    );
  }
};

export default rmixToReact;
