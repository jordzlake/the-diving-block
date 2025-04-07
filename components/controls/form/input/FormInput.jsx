import "./formInput.css";
import { z } from "zod";
import { useState } from "react";

const FormInput = ({
  label,
  type,
  name,
  value,
  description,
  required,
  rows,
  onChange,
  options,
  checkedOptions,
  defaultOption,
  validationSchema, // Zod schema for this input
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    onChange(e);
    if (validationSchema) {
      try {
        if (type == "number") {
          validationSchema.parse(parseFloat(e.target.value));
        } else {
          validationSchema.parse(e.target.value);
        }
        setErrorMessage("");
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrorMessage(error.errors[0].message);
        }
      }
    }
  };

  const handleCheckboxChange = (e) => {
    onChange(e);
    // Validation for checkboxes might be more complex and could still involve
    // the parent if you need to validate a group of checkboxes together.
    // For simple cases, you could add validation based on individual checkbox changes.
  };

  switch (type) {
    case "text":
      return (
        <div className={`form-group ${errorMessage ? "form-group-error" : ""}`}>
          {label && <label className="form-label">{label}:</label>}
          {description && (
            <label className="form-label-info">{description}</label>
          )}
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleInputChange}
            required={required}
            className={`form-input ${errorMessage ? "form-input-error" : ""}`}
          />
          {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        </div>
      );
    case "number":
      return (
        <div className={`form-group ${errorMessage ? "form-group-error" : ""}`}>
          <label className="form-label">{label}:</label>
          {description && (
            <label className="form-label-info">{description}</label>
          )}
          <input
            type={type}
            name={name}
            value={value}
            min={0}
            onChange={handleInputChange}
            className={`form-input ${errorMessage ? "form-input-error" : ""}`}
          />
          {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        </div>
      );
    case "dropdown":
      return (
        <div className={`form-group ${errorMessage ? "form-group-error" : ""}`}>
          <label className="form-label">{label}:</label>
          {description && (
            <label className="form-label-info">{description}</label>
          )}
          <select
            name={name}
            value={value}
            onChange={handleInputChange}
            required={required}
            className={`form-select ${errorMessage ? "form-select-error" : ""}`}
          >
            {defaultOption && <option value={""}>{defaultOption}</option>}
            {options.map((option, i) => (
              <option key={`${option}-${i}`} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        </div>
      );
    case "textarea":
      return (
        <div className={`form-group ${errorMessage ? "form-group-error" : ""}`}>
          <label className="form-label">{label}:</label>
          {description && (
            <label className="form-label-info">{description}</label>
          )}
          <textarea
            name={name}
            value={value}
            onChange={handleInputChange}
            rows={rows}
            required={required}
            className={`form-textarea ${
              errorMessage ? "form-textarea-error" : ""
            }`}
          />
          {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        </div>
      );
    case "checkbox":
      return (
        <div
          className={`form-group ${
            errorMessage ? "form-checkbox-group-error" : ""
          }`}
        >
          <label className="form-label">{label}:</label>
          <div
            className={`form-checkbox-group ${
              errorMessage ? "form-group-error" : ""
            }`}
          >
            {description && (
              <label className="form-label-info">{description}</label>
            )}
            {options.map((option) => (
              <label key={option} className="form-checkbox-label">
                <input
                  type="checkbox"
                  name={name}
                  value={option}
                  checked={checkedOptions?.includes(option)}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                {option}
              </label>
            ))}
            {errorMessage && (
              <p className="form-error-message">{errorMessage}</p>
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default FormInput;
