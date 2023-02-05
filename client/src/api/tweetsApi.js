const BASE_URL =
  process.env.REACT_APP_ENVIRONMENT === "local"
    ? "http://localhost:3001"
    : "https://full-stack-crud-app-production.up.railway.app";

export const fetchTweets = async () => {
  const res = await fetch(`${BASE_URL}/api/get`);
  // Line below is to imitate slow network speed in local testing environment:
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return res.json();
};

export const deleteTweet = async (id) => {
  const res = await fetch(`${BASE_URL}/api/delete/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const postTweet = async (tweet) => {
  try {
    await fetch(`${BASE_URL}/api/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tweet),
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const updateTweet = async (tweet) => {
  await fetch(`${BASE_URL}/api/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(tweet),
  });
};

export const resetDB = async (INITIAL_TWEETS) => {
  console.log("Resetting DB");
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
};
