import "./App.styles.scss";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTweets } from "./store/tweets.slice";
import Tweet from "./components/tweet/tweet";
import ArrowDown from "./components/arrow-down/arrow-down";
import INITIAL_TWEETS from "./constants/INITIAL_TWEETS";
import BASE_URL from "./constants/BASE_URL";
import AppDescription from "./components/app-description/app-description";
import Form from "./components/form/form";
import LoadingSpinner from "./components/loading-spinner/loading-spinner";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweetsOverflowing, setTweetsOverflowing] = useState(false);
  const [userScrolledToBottom, setUserScrolledToBottom] = useState(false);
  const tweets = useSelector((state) => state.tweets.tweets);
  const dispatch = useDispatch();
  const elementRef = useRef();

  const fetchTweets = async () => {
    const response = await fetch(`${BASE_URL}/api/get`);
    const data = await response.json();
    dispatch(setTweets(data));
  };

  useEffect(() => {
    setIsLoading(true);
    const resetDB = async () => {
      await fetch(`${BASE_URL}/api/delete/all`, {
        method: "DELETE",
      });
      await fetch(`${BASE_URL}/api/insert-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(INITIAL_TWEETS),
      });
      fetchTweets();
      setIsLoading(false);
    };
    resetDB();
    // make fetchTweets and baseUrl useRef or useCallback and include them here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserPosition = (e) => {
    const maxScrollPosition = e.target.scrollHeight - e.target.clientHeight;
    if (e.target.scrollTop >= maxScrollPosition - 5) {
      setUserScrolledToBottom(true);
    } else {
      setUserScrolledToBottom(false);
    }
  };

  useEffect(() => {
    if (!elementRef.current) return;
    elementRef.current.scrollTop = 0;
  }, [tweets.length]);

  useEffect(() => {
    if (!elementRef.current) return;
    if (elementRef.current.scrollHeight > elementRef.current.clientHeight + 100) {
      setTweetsOverflowing(true);
    } else {
      setTweetsOverflowing(false);
    }
  }, [tweets]);

  return (
    <div className="app">
      <div className="left-section">
        <div className="left-section-content">
          <AppDescription />
          <Form />
        </div>
      </div>
      <div className="right-section">
        <div className="tweets" ref={elementRef} onScroll={checkUserPosition}>
          {isLoading && <LoadingSpinner />}
          {[...tweets]
            .sort((a, b) => {
              return b.id - a.id;
            })
            .map((item) => (
              <Tweet key={item.id} item={item} />
            ))}
        </div>
        {tweetsOverflowing && !userScrolledToBottom ? <ArrowDown /> : null}
      </div>
    </div>
  );
}

export default App;
