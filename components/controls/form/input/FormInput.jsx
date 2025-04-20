import "./formInput.css";
import { z } from "zod";
import { useState, useRef } from "react";

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
  readOnly,
  dataIndex,
  dataCategoryIndex,
  validationSchema, // Zod schema for this input
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const timeoutId = useRef(null);

  const validate = (inputValue) => {
    if (validationSchema) {
      try {
        if (type === "number") {
          validationSchema.parse(parseFloat(inputValue));
        } else {
          validationSchema.parse(inputValue);
        }
        setErrorMessage("");
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrorMessage(error.errors[0].message);
        }
      }
    } else {
      setErrorMessage(""); // Clear error if no validation schema
    }
  };

  const handleInputChange = (e) => {
    onChange(e);
    const inputValue = e.target.value;

    // Clear any existing timeout
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Set a new timeout for validation
    timeoutId.current = setTimeout(() => {
      validate(inputValue);
    }, 500); // 2000 milliseconds = 2 seconds
  };

  const handleCheckboxChange = (e) => {
    onChange(e);
    // Validation for checkboxes might be more complex and could still involve
    // the parent if you need to validate a group of checkboxes together.
    // For simple cases, you could add validation based on individual checkbox changes.
    // You might need to adjust the validation logic here based on your specific
    // checkbox validation requirements. For instance, you might want to validate
    // after a certain number of checkboxes are selected or after a blur event
    // on the group. For now, no delayed validation is applied to checkboxes.
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
            data-index={String(dataIndex) ? dataIndex : undefined}
            data-category-index={
              String(dataCategoryIndex) ? dataCategoryIndex : undefined
            }
            className={`form-input ${errorMessage ? "form-input-error" : ""}`}
            readOnly={readOnly ? true : false}
          />
          {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        </div>
      );
    case "email":
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
            data-index={String(dataIndex) ? dataIndex : undefined}
            data-category-index={
              String(dataCategoryIndex) ? dataCategoryIndex : undefined
            }
            className={`form-input ${errorMessage ? "form-input-error" : ""}`}
            readOnly={readOnly ? true : false}
          />
          {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        </div>
      );
    case "password":
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
            data-index={String(dataIndex) ? dataIndex : undefined}
            data-category-index={
              String(dataCategoryIndex) ? dataCategoryIndex : undefined
            }
            className={`form-input ${errorMessage ? "form-input-error" : ""}`}
            readOnly={readOnly ? true : false}
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
            data-index={String(dataIndex) ? dataIndex : undefined}
            data-category-index={
              String(dataCategoryIndex) ? dataCategoryIndex : undefined
            }
            className={`form-input ${errorMessage ? "form-input-error" : ""}`}
            readOnly={readOnly ? true : false}
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
            {defaultOption && <option value="">{defaultOption}</option>}
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
            data-index={String(dataIndex) ? dataIndex : undefined}
            data-category-index={
              String(dataCategoryIndex) ? dataCategoryIndex : undefined
            }
            className={`form-textarea ${
              errorMessage ? "form-textarea-error" : ""
            }`}
            readOnly={readOnly ? true : false}
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
    case "radio":
      return (
        <div
          className={`form-group ${
            errorMessage ? "form-checkbox-group-error" : ""
          }`}
        >
          <label className="form-label">{label}:</label>
          {description && (
            <label className="form-label-info">{description}</label>
          )}
          {options.map((option, i) => (
            <label
              key={`radio-${i}`}
              className="form-radio-label"
              htmlFor={`${name}-${option.value}-${i}`}
            >
              {option.displayValue}
              <input
                className="form-input-radio"
                type="radio"
                id={`${name}-${option.value}-${i}`}
                name={name}
                value={option.value}
                checked={String(value) === String(option.value)}
                onChange={handleInputChange}
              />
              <span className="form-radio-checkmark"></span>
            </label>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default FormInput;
