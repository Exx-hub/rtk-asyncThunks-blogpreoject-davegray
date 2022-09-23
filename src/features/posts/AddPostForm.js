import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost, addNewPost } from "../posts/postsSlice";
import { selectAllUsers } from "../users/usersSlice";

function AddPostForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  // local (component) state. does not need to be in the global state.
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [requestStatus, setRequestStatus] = useState("idle");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onBodyChanged = (e) => setBody(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(addNewPost({ title, body, userId })).unwrap();
        // redux toolkit unwrap function => returns the promise, either it will return the action payload or an error
        // enabling the use of try catch here

        setTitle("");
        setBody("");
        setUserId("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const canSave =
    Boolean(title) &&
    Boolean(body) &&
    Boolean(userId) &&
    requestStatus === "idle";

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));
  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={onBodyChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}

export default AddPostForm;

// const onSavePostClicked = () => {
//   if (title && content) {
//     dispatch(addPost({ title, body: content, userId }));
//     setTitle("");
//     setContent("");
//     setUserId("");
//   }
// };
