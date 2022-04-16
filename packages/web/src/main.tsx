import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import { ApiProvider } from "@reduxjs/toolkit/query/react";
// import { api } from "./redux/baseApi";
import Apollo from "./graphql";
import { Flow } from "./components/Flow";
import "./draft";
import "./drawflow.scss";
import { store } from "./redux/store";

export function log(json: Record<string, any> | string) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 1);
  }

  const arr = [],
    _string = "color:green",
    _number = "color:red",
    _boolean = "color:blue",
    _null = "color:magenta",
    _key = "color:purple; font-weight: bold";

  json = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match: string) {
      let style = _number;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          style = _key;
          match = match.slice(1, match.length - 2) + ":";
        } else {
          style = _string;
        }
      } else if (/true|false/.test(match)) {
        style = _boolean;
      } else if (/null/.test(match)) {
        style = _null;
      }
      arr.push(style);
      arr.push("");
      return "%c" + match + "%c";
    }
  );

  arr.unshift(json);

  console.log(...arr);
}

console.log({ envVite: import.meta.env });

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <Apollo>
        <Flow />
      </Apollo>
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);
