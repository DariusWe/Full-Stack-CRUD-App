import "./app-description.styles.scss";

const AppDescription = () => {
  return (
    <div className="app-description">
      <h3>What is this?</h3>
      <p>
        This simple app was built to improve my Express.js and MySQL skills as well as to learn how to deploy a
        full-stack-app to the web. You can write simple text paragraphs to the database and see the database entries on
        the right side. You can further edit or delete entries. The database gets reset when reloading the page.
      </p>
    </div>
  );
};

export default AppDescription;
