import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./Slider.css";
import { roundToNearest } from "./utils";

function App() {
  const thumbRef = useRef(null);
  const rangeRef = useRef(null);
  const draggableRef = useRef(false);

  const RANGE_WIDTH = 500;
  const THUMB_SIZE = 30;
  const [range, setRange] = useState(null);
  const [value, setValue] = useState(null);
  const [userMaxInput, setUserMaxInput] = useState(200);
  const [userMinInput, setUserMinValue] = useState(100);
  const STEP_WIDTH = RANGE_WIDTH / (userMaxInput - userMinInput);

  const handleThumbChange = (e) => {
    const relativePosition = e.clientX - range?.MIN;
    if (!isNaN(relativePosition)) {
      thumbRef.current.style.left =
        roundToNearest(relativePosition, STEP_WIDTH) - THUMB_SIZE / 2 + "px";
      setValue(relativePosition, STEP_WIDTH);
    }
  };

  useEffect(() => {
    if (rangeRef.current) {
      const { left, right } = rangeRef.current.getBoundingClientRect();
      setRange({ MIN: left, MAX: right });
    }
  }, []);

  useEffect(() => {
    if (range) {
      document.addEventListener("mousemove", function (e) {
        const relativePosition = e.clientX - range.MIN;
        if (
          relativePosition >= 0 &&
          relativePosition <= RANGE_WIDTH - THUMB_SIZE / 2 &&
          draggableRef.current
        ) {
          handleThumbChange(e);
        }
      });
    }
  }, [range, userMaxInput, userMinInput]);

  useEffect(() => {
    if (range) {
      rangeRef.current.addEventListener("click", (e) => {
        handleThumbChange(e);
      });
    }
  }, [range, userMaxInput, userMinInput]);

  useEffect(() => {
    function setDraggable(value) {
      draggableRef.current = value;
    }
    thumbRef.current.addEventListener("mousedown", function (e) {
      draggableRef.current = true;
    });
    document.addEventListener("mouseup", function (e) {
      setDraggable(false);
      handleThumbChange(e);
    });
    return () => {
      thumbRef.current.removeEventListener("mousedown", function () {
        setDraggable(true);
      });
      document.removeEventListener("mouseup", function () {
        setDraggable(false);
      });
    };
  }, []);
  return (
    <>
      <label>Min</label>
      <input
        value={userMinInput}
        onChange={(e) => setUserMinValue(e.target.value)}
      />
      <label>Max</label>
      <input
        value={userMaxInput}
        onChange={(e) => setUserMaxInput(e.target.value)}
      />

      <div className="container">
        <div ref={thumbRef} className="slider-thumb">
          <div></div>
          <p>
            {Math.round(
              roundToNearest(value, STEP_WIDTH) / STEP_WIDTH + +userMinInput
            )}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div ref={rangeRef} className="range" />
          <div
            className="active-range"
            style={{ width: roundToNearest(value, STEP_WIDTH) ?? 0 + "px" }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
