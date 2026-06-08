import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomDropdown.css';

export const CustomDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option...", 
  className = "", 
  icon: Icon 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Convert options to standard format if they are just strings
  const formattedOptions = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return opt;
  });

  const selectedOption = formattedOptions.find((opt) => opt.value === value);

  return (
    <div className={`custom-dropdown-container ${className}`} ref={dropdownRef}>
      <button 
        type="button" 
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-dropdown-value">
          {Icon && <Icon size={16} className="custom-dropdown-icon" />}
          <span className={!selectedOption ? "placeholder" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={16} className="custom-dropdown-chevron" />
      </button>

      {isOpen && (
        <div className="custom-dropdown-menu">
          {formattedOptions.map((option) => (
            <div
              key={option.value}
              className={`custom-dropdown-item ${option.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
          {formattedOptions.length === 0 && (
            <div className="custom-dropdown-empty">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};
