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
    </form>
  );
};

export default Form;
