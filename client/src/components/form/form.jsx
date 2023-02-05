import "./form.styles.scss";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentlyEditedId, setPopUpEffectForId } from "../../store/tweets.slice";
import { useMutation, useQueryClient } from "react-query";
import { postTweet, updateTweet } from "../../api/tweetsApi";

/* 
Interesting: Order of useEffects matters! At least if one useEffect is dependent on a value that another useEffect is changing.
In this component, one useEffect is dispatching "setCurrentlyEditedId(null)" while the other one is using "currentlyEditedId" to 
conditionally do stuff. If the useEffect with the dispatch is running first, the second useEffect (running in the same render cycle) 
will not have access to the updated value immediately, which will cause the problem of unwantedly refilling the input fields here.
*/

/*
If you want a mutation to stay in loading state while related queries update, you have to return the result of invalidateQueries() 
from the callback.
*/

const Form = () => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const currentlyEditedId = useSelector((state) => state.tweets.currentlyEditedId);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const tweets = queryClient.getQueryData("tweets");
  const loadingRef = useRef(false);

  const resetInputFields = () => {
    setTitle("");
    setParagraph("");
  };

  const postTweetMutation = useMutation(postTweet, {
    onSuccess: () => {
      return queryClient.invalidateQueries("tweets");
    },
  });

  const updateTweetMutation = useMutation(updateTweet, {
    onSuccess: () => {
      return queryClient.invalidateQueries("tweets");
    },
  });

  useEffect(() => {
    // If currentlyEditedId, fill in the corresponding tweet into form fields
    if (currentlyEditedId) {
      if (!tweets.find((tweet) => tweet.id === currentlyEditedId)) {
        // Tweet got deleted while being edited
        dispatch(setCurrentlyEditedId(null));
        resetInputFields();
        return;
      }
      setTitle(tweets.filter((tweet) => tweet.id === currentlyEditedId)[0].title);
      setParagraph(tweets.filter((tweet) => tweet.id === currentlyEditedId)[0].paragraph);
    }
  }, [currentlyEditedId, tweets]);

  useEffect(() => {
    // If isLoading state of one mutation changes from true to false, reset state and input fields
    // Right now assuming that no error occurs, in which case you would probably want to keep state and input fields
    if (postTweetMutation.isLoading || updateTweetMutation.isLoading || loadingRef.current === false) return;
    if (currentlyEditedId) {
      dispatch(setPopUpEffectForId(currentlyEditedId));
      dispatch(setCurrentlyEditedId(null));
    }
    resetInputFields();
    loadingRef.current = false;
  }, [postTweetMutation.isLoading, updateTweetMutation.isLoading, currentlyEditedId]);

  return (
    <form className="form">
      <label>Title:</label>
      <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} value={title} required />
      <label>Paragraph:</label>
      <textarea name="paragraph" onChange={(e) => setParagraph(e.target.value)} value={paragraph} required />
      <div className="form-buttons">
        {currentlyEditedId === null ? (
          <button
            type="submit"
            onClick={(e) => {
              if (title.length > 0 && paragraph.length > 0) {
                e.preventDefault();
                loadingRef.current = true;
                postTweetMutation.mutate({
                  title: title,
                  paragraph: paragraph,
                });
              }
            }}
            className={postTweetMutation.isLoading ? "is-loading" : ""}
          >
            {postTweetMutation.isLoading ? (
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
                  loadingRef.current = true;
                  updateTweetMutation.mutate({
                    id: currentlyEditedId,
                    title: title,
                    paragraph: paragraph,
                  });
                }
              }}
              className={updateTweetMutation.isLoading ? "is-loading" : ""}
            >
              {updateTweetMutation.isLoading ? (
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
