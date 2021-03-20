import * as React from "react";
import rmix from "rmix";

import "./style.css";

// markup
const IndexPage = () => {
  const [value, setValue] = React.useState("(hello (list.range 10))");
  const [compiledValue, setCompiledValue] = React.useState("press run");

  return (
    <main className="sandbox">
      <div>
        <textarea value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <div className="sandbox__controls">
        <button
          onClick={() =>
            setCompiledValue(
              rmix(["_", ["rmix.stringify", ["rmix.parse", value]]])[1]
            )
          }
        >
          run
        </button>
      </div>
      <div className="sandbox__result-box">
        <pre>{compiledValue}</pre>
      </div>
    </main>
  );
};

export default IndexPage;
