import "./App.styles.scss";
import { useState, useEffect, useRef } from "react";
import Tweet from "./components/tweet/tweet";
import ArrowDown from "./components/arrow-down/arrow-down";
import INITIAL_TWEETS from "./constants/INITIAL_TWEETS";
import AppDescription from "./components/app-description/app-description";
import Form from "./components/form/form";

function App() {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [tweets, setTweets] = useState([]);
  const [tweetsOverflowing, setTweetsOverflowing] = useState(false);
  const [currentlyEditedID, setCurrentlyEditedID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popEffectForID, setPopEffectForID] = useState(null);
  const [userScrolledToBottom ,setUserScrolledToBottom] = useState(false);
  const elementRef = useRef();

  const resetInputFields = () => {
    setTitle("");
    setParagraph("");
  };

  const fetchTweets = async () => {
    const response = await fetch("https://full-stack-crud-app-production.up.railway.app/api/get");
    const data = await response.json();
    setTweets(data);
  };

  const postTweet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://full-stack-crud-app-production.up.railway.app/api/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          paragraph: paragraph,
        }),
      });
      const data = await response.json();
      console.log(data);
      await fetchTweets();
      resetInputFields();
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateTweet = async () => {
    setIsLoading(true);
    const response = await fetch("https://full-stack-crud-app-production.up.railway.app/api/update/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: currentlyEditedID,
        title: title,
        paragraph: paragraph,
      }),
    });
    const data = await response.json();
    console.log(data);
    await fetchTweets();
    resetInputFields();
    setPopEffectForID(currentlyEditedID);
    setCurrentlyEditedID(null);
    setTimeout(() => {
      setPopEffectForID(null);
    }, 200);
    setIsLoading(false);
  };

  const deleteTweet = async (id) => {
    const response = await fetch("https://full-stack-crud-app-production.up.railway.app/api/delete/" + id, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    fetchTweets();
  };

  const editItem = (id) => {
    setCurrentlyEditedID(id);
    setTitle(tweets.filter((tweet) => tweet.id === id)[0].title);
    setParagraph(tweets.filter((tweet) => tweet.id === id)[0].paragraph);
  };

  useEffect(() => {
    const resetDB = async () => {
      await fetch("https://full-stack-crud-app-production.up.railway.app/api/delete/all", {
        method: "DELETE",
      });
      await fetch("https://full-stack-crud-app-production.up.railway.app/api/insert-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(INITIAL_TWEETS),
      });
      fetchTweets();
    };
    resetDB();
  }, []);

  const checkUserPosition = (e) => {
    const maxScrollPosition = e.target.scrollHeight - e.target.clientHeight;
    if (e.target.scrollTop >= maxScrollPosition - 5) {
      setUserScrolledToBottom(true);
    } else {
      setUserScrolledToBottom(false);
    }
  }

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
          <Form
            title={title}
            setTitle={setTitle}
            paragraph={paragraph}
            setParagraph={setParagraph}
            resetInputFields={resetInputFields}
            currentlyEditedID={currentlyEditedID}
            setCurrentlyEditedID={setCurrentlyEditedID}
            postTweet={postTweet}
            updateTweet={updateTweet}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="right-section">
        <div className="tweets" ref={elementRef} onScroll={checkUserPosition}>
          {tweets
            .sort((a, b) => {
              return b.id - a.id;
            })
            .map((item) => (
              <Tweet
                key={item.id}
                item={item}
                editItem={editItem}
                deleteTweet={deleteTweet}
                popEffectActive={popEffectForID === item.id}
              />
            ))}
        </div>
        {tweetsOverflowing && !userScrolledToBottom ? <ArrowDown /> : null}
      </div>
    </div>
  );
}

export default App;
