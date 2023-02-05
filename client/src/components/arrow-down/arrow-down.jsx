import "./arrow-down.styles.scss";

const ArrowDown = ({ scrollToBottom }) => {
  return <i className="fa-solid fa-caret-down" onClick={scrollToBottom}></i>;
};
export default ArrowDown;
