import "./tweet.styles.scss";

const Tweet = ({ item, editItem, deleteTweet, popEffectActive }) => {
  return (
    <div className={popEffectActive ? "tweet pop" : "tweet"}>
      <h3>{item.title}</h3>
      <p>{item.paragraph}</p>
      <div className="tweet-bottom">
        <i className="fa-solid fa-pen-to-square" onClick={() => editItem(item.id)} />
        <i
          className="fa-solid fa-trash"
          onClick={(e) => {
            e.target.parentNode.parentNode.style.opacity = "0";
            e.target.parentNode.parentNode.style.transform = "translateX(40px)";
            setTimeout(() => {
              deleteTweet(item.id);
            }, 200);
          }}
        />
      </div>
    </div>
  );
};

export default Tweet;
