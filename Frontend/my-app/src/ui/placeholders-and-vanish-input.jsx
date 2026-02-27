import React, { useEffect, useState, useRef } from "react";
import Search from "../assets/icons/search.svg"
// Named export expected by SearchBar.jsx
export function PlaceholdersAndVanishInput({
  placeholders = [],
  onChange = () => {},
  onSubmit = () => {},
  className = "",
  cycleInterval = 3000,
  // container class for outer wrapper
  containerClassName = "",
}) {
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!placeholders || placeholders.length === 0) return;

    const id = setInterval(() => {
      // only cycle when input is not focused and it's empty (so placeholder is visible)
      if (!mounted.current) return;
      setIndex((i) => (i + 1) % placeholders.length);
    }, cycleInterval);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [placeholders, cycleInterval]);

  function handleChange(e) {
    setValue(e.target.value);
    onChange(e);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(e);
  }

  const placeholderText = !focused && value === "" && placeholders.length ? placeholders[index] : "";

  return (
    <form onSubmit={handleSubmit} className={`w-full ${containerClassName}`}>
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><img src={Search} alt="" className="w-4"/> </span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholderText}
          className={`w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-200 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${className}`}
        />
      </div>
    </form>
  );
}

export default PlaceholdersAndVanishInput;
