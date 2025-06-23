import React from "react";
import { useSelector, useDispatch } from "react-redux";
export default function Effectspages() {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <div className="">
      <button type="button" onClick={() => dispatch({ type: "INCREMENT" })}>
        +1
      </button>
      <button type="button" onClick={() => dispatch({ type: "DECREMENT" })}>
        -1
      </button>
      <button type="button" onClick={() => dispatch({ type: "RESET" })}>
        0
      </button>
      <h2>{count}</h2>
    </div>
  );
}
