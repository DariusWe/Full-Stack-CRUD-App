import "./tweet.styles.scss";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTweets, setCurrentlyEditedId } from "../../store/tweets.slice";
import BASE_URL from "../../constants/BASE_URL";

const Tweet = ({ item }) => {
  const [isLoading, setIsLoading] = useState(false);
  const popUpEffectForId = useSelector((state) => state.tweets.popUpEffectForId);
  const dispatch = useDispatch();
  const elementRef = useRef();

  const reFetchTweets = async () => {
    const response = await fetch(`${BASE_URL}/api/get`);
    const data = await response.json();
    dispatch(setTweets(data));
  };

  const deleteTweet = async (id) => {
    setIsLoading(true);
    const response = await fetch(`${BASE_URL}/api/delete/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    await reFetchTweets();
    setIsLoading(false);
  };

  return (
    <div className={popUpEffectForId === item.id ? "tweet animation-active" : "tweet"} ref={elementRef}>
      <h3>{item.title}</h3>
      <p>{item.paragraph}</p>
      <div className="tweet-bottom">
        <i className="fa-solid fa-pen-to-square" onClick={() => dispatch(setCurrentlyEditedId(item.id))} />
        {isLoading ? (
          <div className="loading-spinner-button">
            <div className="lds-facebook">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <i
            className="fa-solid fa-trash"
            onClick={(e) => {
              // e.target.parentNode.parentNode.style.opacity = "0";
              // e.target.parentNode.parentNode.style.transform = "translateX(40px)";
              deleteTweet(item.id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Tweet;
