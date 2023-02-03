import "./form.styles.scss";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTweets, setCurrentlyEditedId, setPopUpEffectForId } from "../../store/tweets.slice";
import BASE_URL from "../../constants/BASE_URL";

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const tweets = useSelector((state) => state.tweets.tweets);
  const currentlyEditedID = useSelector((state) => state.tweets.currentlyEditedId);
  const dispatch = useDispatch();

  const resetInputFields = () => {
    setTitle("");
    setParagraph("");
  };

  const reFetchTweets = async () => {
    const response = await fetch(`${BASE_URL}/api/get`);
    const data = await response.json();
    dispatch(setTweets(data));
  };

  useEffect(() => {
    if (currentlyEditedID === null) return;
    if (!tweets.find((tweet) => (tweet.id === currentlyEditedID))) {
      // Tweet got deleted while being edited
      dispatch(setCurrentlyEditedId(null));
      resetInputFields();
      return;
    }
    setTitle(tweets.filter((tweet) => tweet.id === currentlyEditedID)[0].title);
    setParagraph(tweets.filter((tweet) => tweet.id === currentlyEditedID)[0].paragraph);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyEditedID, tweets]);

  const postTweet = async () => {
    setIsLoading(true);
    try {
      const postResponse = await fetch(`${BASE_URL}/api/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          paragraph: paragraph,
        }),
      });
      const postData = await postResponse.json();
      console.log(postData);
      await reFetchTweets();
      resetInputFields();
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateTweet = async () => {
    setIsLoading(true);
    const response = await fetch(`${BASE_URL}/api/update`, {
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
    await reFetchTweets();
    dispatch(setPopUpEffectForId(currentlyEditedID));
    setTimeout(() => {
      dispatch(setPopUpEffectForId(null));
    }, 200);
    resetInputFields();
    dispatch(setCurrentlyEditedId(null));
    setIsLoading(false);
  };

  return (
    <form className="form">
      <label>Title:</label>
      <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} value={title} required />
      <label>Paragraph:</label>
      <textarea name="paragraph" onChange={(e) => setParagraph(e.target.value)} value={paragraph} required />
      <div className="form-buttons">
        {currentlyEditedID === null ? (
          <button
            type="submit"
            onClick={(e) => {
              if (title.length > 0 && paragraph.length > 0) {
                e.preventDefault();
                postTweet();
              }
            }}
            className={isLoading ? "is-loading" : ""}
          >
            {isLoading ? (
              <div className="loading-spinner-button">
                <div className="lds-facebook">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        ) : (
          <>
            <button
              type="submit"
              onClick={(e) => {
                if (title.length > 0 && paragraph.length > 0) {
                  e.preventDefault();
                  updateTweet();
                }
              }}
              className={isLoading ? "is-loading" : ""}
            >
              {isLoading ? (
                <div className="loading-spinner-button">
                  <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={() => {
                dispatch(setCurrentlyEditedId(null));
                resetInputFields();
              }}
            >
              Discard
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default Form;
