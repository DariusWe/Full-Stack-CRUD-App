import "./loading-spinner.styles.scss";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
