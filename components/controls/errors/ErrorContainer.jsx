import "./errorContainer.css";
import parse from "html-react-parser";

const ErrorContainer = ({ errors }) => {
  return (
    <>
      {errors.length > 0 && (
        <div className="errors-container">
          <p className="errors-text">Please rectify the issues below:</p>
          <ol className="errors-list">
            {errors.map((error, i) => (
              <li key={i} className="error-text">
                {parse(String(error))}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
};

export default ErrorContainer;
