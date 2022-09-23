import { useSelector } from "react-redux";

import PostItem from "./PostItem";
import { selectPostIds, getPostStatus, getPostsError } from "./postsSlice";

function PostsList() {
  // const posts = useSelector((state) => state.postState.posts);
  // const posts = useSelector(selectAllPosts); // this instead, details in postSlice.

  const orderedPostIds = useSelector(selectPostIds);
  const status = useSelector(getPostStatus);
  const error = useSelector(getPostsError);

  let content;

  if (status === "loading") {
    content = <p>Loading...</p>;
  } else if (status === "succeeded") {
    content = orderedPostIds.map((postId) => (
      <PostItem key={postId} postId={postId} />
    ));
  } else if (status === "failed") {
    content = <p>{error}</p>;
  }

  return <div>{content}</div>;
}

export default PostsList;
