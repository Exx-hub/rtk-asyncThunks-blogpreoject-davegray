import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";
import { updatePost, selectPostById, deletePost } from "./postsSlice";

function EditPostForm() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const singlePost = useSelector((state) => selectPostById(state, +postId));
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(singlePost?.title);
  const [body, setBody] = useState(singlePost?.body);
  const [userId, setUserId] = useState(singlePost?.userId);
  const [requestStatus, setRequestStatus] = useState("idle");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onBodyChanged = (e) => setBody(e.target.value);
  const onAuthorChanged = (e) => setUserId(+e.target.value);

  const dispatch = useDispatch();

  if (!singlePost) {
    return (
      <section>
        <h2>Post Not Found.</h2>
      </section>
    );
  }

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");

        dispatch(
          updatePost({
            id: singlePost.id,
            title,
            body,
            userId,
            reactions: singlePost.reactions,
          })
        ).unwrap();
        // redux toolkit unwrap function => returns the promise, either it will return the action payload or an error
        // enabling the use of try catch here

        setTitle("");
        setBody("");
        setUserId("");
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
        // navigate("/");
        navigate(`/post/${postId}`);
      }
    }
  };

  const onDeletePostClicked = () => {
    try {
      setRequestStatus("pending");
      dispatch(deletePost({ id: singlePost.id })).unwrap();

      setTitle("");
      setBody("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    } finally {
      setRequestStatus("idle");
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
      <h2>Edit Post</h2>
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
        <select
          id="postAuthor"
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
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
        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
}

export default EditPostForm;
