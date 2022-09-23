import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, incrementByValue, reset } from "./counterSlice";

function Counter() {
  const count = useSelector((state) => state.counterState.count);
  const dispatch = useDispatch();
  const [incrementValue, setIncrementValue] = useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
      <button onClick={() => dispatch(reset())}>reset</button>
      <button onClick={() => dispatch(incrementByValue(incrementValue))}>
        ADD!
      </button>
      <input
        type="number"
        value={incrementValue}
        onChange={(e) => setIncrementValue(+e.target.value)}
      />
    </div>
  );
}

export default Counter;
