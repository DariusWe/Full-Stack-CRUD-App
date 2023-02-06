import "./App.styles.scss";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import Tweet from "./components/tweet/tweet";
import ArrowDown from "./components/arrow-down/arrow-down";
import INITIAL_TWEETS from "./constants/INITIAL_TWEETS";
import AppDescription from "./components/app-description/app-description";
import Form from "./components/form/form";
import LoadingSpinner from "./components/loading-spinner/loading-spinner";
import { fetchTweets, resetDB } from "./api/tweetsApi";

function App() {
  const [databaseResetCompleted, setDatabaseResetCompleted] = useState(false);
  const [tweetsOverflowing, setTweetsOverflowing] = useState(false);
  const [userScrolledToBottom, setUserScrolledToBottom] = useState(false);
  const elementRef = useRef();

  const { data: tweets, status } = useQuery("tweets", fetchTweets, {
    refetchOnWindowFocus: false,
    enabled: !!databaseResetCompleted,
  });

  const tweetsQuantity = tweets ? tweets.length : 0;

  const resetDbMutation = useMutation(resetDB, {
    onSuccess: () => {
      setDatabaseResetCompleted(true);
    },
  });

  useEffect(() => {
    resetDbMutation.mutate(INITIAL_TWEETS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    const maxScrollPosition = elementRef.current.scrollHeight - elementRef.current.clientHeight;
    elementRef.current.scrollTop = maxScrollPosition;
  };

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
    if (elementRef.current.scrollHeight > elementRef.current.clientHeight + 100) {
      setTweetsOverflowing(true);
    } else {
      setTweetsOverflowing(false);
    }
  }, [tweets]);

  useEffect(() => {
    if (!elementRef.current) return;
    elementRef.current.scrollTop = 0;
  }, [tweetsQuantity]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="app">
        <div className="left-section">
          <div className="left-section-content">
            <AppDescription />
            <Form />
          </div>
        </div>
        <div className="right-section">
          <div className="tweets">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <p>Error!</p>;
  }

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
          {tweets &&
            [...tweets]
              .sort((a, b) => {
                return b.id - a.id;
              })
              .map((item) => <Tweet key={item.id} item={item} />)}
        </div>
        {tweetsOverflowing && !userScrolledToBottom ? <ArrowDown scrollToBottom={scrollToBottom} /> : null}
      </div>
    </div>
  );
}

export default App;
