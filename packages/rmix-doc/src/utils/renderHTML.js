import React from "react";

const rmixToReact = ([tag, ...tail]) => {
  const children = [];
  const attr = {};
  const style = {};
  for (const child of tail) {
    if (Array.isArray(child)) {
      const innerTag = child[0];
      if (innerTag.match(/^attr\./)) {
        attr[innerTag.split(".")[1]] = child[1];
      } else if (innerTag.match(/^style\./)) {
        style[innerTag.split(".")[1]] = child[1];
      } else {
        children.push(rmixToReact(child));
      }
    } else if (child !== "_") {
      children.push(child + " ");
    }
  }

  if (tag.match(/^html\./)) {
    const HTMLTag = tag.split(".")[1];

    return (
      <HTMLTag style={style} {...attr}>
        {children.length > 0 ? children : null}
      </HTMLTag>
    );
  } else {
    return <>{children.length > 0 ? children : null}</>;
  }
};

export default rmixToReact;
