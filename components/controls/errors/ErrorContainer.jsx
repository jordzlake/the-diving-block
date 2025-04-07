import "./errorContainer.css";

const ErrorContainer = ({ errors }) => {
  return (
    <>
      {errors.length > 0 && (
        <div className="errors-container">
          <p className="errors-text">Please rectify the issues below:</p>
          <ol className="errors-list">
            {errors.map((error, i) => (
              <li key={i} className="error-text">
                {error}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
};

export default ErrorContainer;
