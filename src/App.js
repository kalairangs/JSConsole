import React, { useRef } from "react";
import "./App.css";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";
import Interpreter from "./interpreter";
import Visitor from "./visitors";
import Input from './input';
const acorn = require("acorn");
const App = () => {
  let [inputValue, setInputValue] = React.useState()
  let [prevData, setPrevData] = React.useState([]);
  let [inputValueHis, setInputValueHis] = React.useState([]);
  let recentValues = [];
  let pos = useRef(0);

  const inputRef = useRef(null);
  let Value = inputRef.current;
  const updateInputValue = () => {
    setInputValue(inputRef.current.value);
  };

  React.useEffect(() => {
    const Observable$ = fromEvent(Value, "keyup").pipe(
      filter((e) => e.keyCode === 13 && !e.shiftKey)
    );

    if (Value !== null || undefined) {
      Observable$.subscribe((e) => {
        e.preventDefault();
      });

      const getPreviousData = (element, arrow_func) =>
        fromEvent(element, "keyup").pipe(filter((e) => e.key === arrow_func));

      let arrowUp = getPreviousData(Value, "ArrowUp");
      let arrowDown = getPreviousData(
        Value,
        "ArrowDown"
      );

      arrowUp.subscribe(() => {
        if (recentValues.length > 0 && pos.current >= 0) {
          setInputValue(
            recentValues[pos.current] ? recentValues[pos.current] : ""
          );
          pos.current = pos.current - 1;
        }
      });
      arrowDown.subscribe(() => {
        if (recentValues.length > 0 && pos.current < recentValues.length) {
          setInputValue(
            recentValues[pos.current] ? recentValues[pos.current] : ""
          );
          pos.current = pos.current + 1;
        }
      });
    }
  });

  const interpretJsCode = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const value = inputRef.current.value.trim();
      let eValue = "";
      if (value) {
        if (!/(var|let|const)/.test(value)) {
          eValue = `print(${value})`;
        }
        try {
          const body = acorn.parse(eValue || value, { ecmaVersion: 2020 }).body;
          console.log(body);
          const jsInterpreter = new Interpreter(new Visitor());
          jsInterpreter.interpret(body);
          const answer = jsInterpreter.getValue();
          const finalResult = answer? value + " = " + answer : value;
          // console.log(finalResult);
          setPrevData((prevHistory) => [...prevHistory, finalResult]);
          setInputValueHis((prevValue) => [...prevValue, value]);
          recentValues.push(...inputValueHis, value);
          pos.current = recentValues.length; // intermiediatary
          setInputValue("");
        } catch {}
      }
    }
  };

  return (
    <div className="App">
      <Input prevData={prevData} inputRef={inputRef} inputValue={inputValue} updateInputValue={updateInputValue} interpretJsCode={interpretJsCode} />
    </div>
  );
};

export default App;
