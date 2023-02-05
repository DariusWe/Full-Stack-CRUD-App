import "./tweet.styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentlyEditedId, setPopUpEffectForId } from "../../store/tweets.slice";
import { useQueryClient, useMutation } from "react-query";
import { deleteTweet } from "../../api/tweetsApi";

const Tweet = ({ item }) => {
  const popUpEffectForId = useSelector((state) => state.tweets.popUpEffectForId);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const deleteTweetMutation = useMutation(deleteTweet, {
    onSuccess: () => {
      return queryClient.invalidateQueries("tweets");
    },
  });

  if (popUpEffectForId) {
    setTimeout(() => {
      dispatch(setPopUpEffectForId(null));
    }, 200);
  }

  return (
    <div className={popUpEffectForId === item.id ? "tweet animation-active" : "tweet"}>
      <h3>{item.title}</h3>
      <p>{item.paragraph}</p>
      <div className="tweet-bottom">
        <i className="fa-solid fa-pen-to-square" onClick={() => dispatch(setCurrentlyEditedId(item.id))} />
        {deleteTweetMutation.isLoading ? (
          <div className="loading-animation">
            <div className="lds-facebook">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <i
            className="fa-solid fa-trash"
            onClick={() => {
              deleteTweetMutation.mutate(item.id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Tweet;
