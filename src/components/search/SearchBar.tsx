import { useRef } from "react";
import { SearchIcon } from "../home/icons";
import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        inputRef.current?.blur();
      }}
    >
      <input
        ref={inputRef}
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre, marca, modelo..."
        aria-label="Buscar productos"
        autoFocus
      />
      <button className="search-bar__submit" type="submit" aria-label="Buscar">
        <SearchIcon />
      </button>
    </form>
  );
}

export default SearchBar;
