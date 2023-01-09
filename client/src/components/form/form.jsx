import "./form.styles.scss";

const Form = ({
  title,
  setTitle,
  paragraph,
  setParagraph,
  resetInputFields,
  currentlyEditedID,
  setCurrentlyEditedID,
  postTweet,
  updateTweet,
  isLoading,
}) => {
  return (
    <div className="form">
      <label>Title:</label>
      <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} value={title}></input>
      <label>Paragraph:</label>
      <textarea name="paragraph" onChange={(e) => setParagraph(e.target.value)} value={paragraph}></textarea>
      <div className="form-buttons">
        {currentlyEditedID === null ? (
          <button onClick={postTweet} className={isLoading ? "is-loading" : ""}>
            Submit
          </button>
        ) : (
          <>
            <button onClick={updateTweet} className={isLoading ? "is-loading" : ""}>
              Save
            </button>
            <button
              onClick={() => {
                setCurrentlyEditedID(null);
                resetInputFields();
              }}
            >
              Discard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Form;
