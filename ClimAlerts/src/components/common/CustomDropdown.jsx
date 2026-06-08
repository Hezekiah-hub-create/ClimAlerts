import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomDropdown.css';

export const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select an option',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div 
      className={`custom-dropdown-container ${className} ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`} 
      ref={dropdownRef}
    >
      <div 
        className="custom-dropdown-header" 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`custom-dropdown-selected ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`custom-dropdown-icon ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className="custom-dropdown-menu">
          {options.map((option, idx) => (
            <div 
              key={`${option.value}-${idx}`}
              className={`custom-dropdown-item ${value === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              <span className="custom-dropdown-item-label">{option.label}</span>
              {value === option.value && <Check size={14} className="custom-dropdown-check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
