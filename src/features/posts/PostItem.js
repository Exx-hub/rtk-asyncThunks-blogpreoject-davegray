import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPostById } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";

function PostItem({ postId }) {
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article>
      <h2>{post?.title}</h2>
      <p className="excerpt">{post?.body.substring(0, 100)}</p>
      <p className="postCredit">
        <Link to={`/post/${post?.id}`}>View Post</Link>
        <PostAuthor userId={post?.userId} />
        <TimeAgo timestamp={post?.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
}

// const MemoizedPostItem = React.memo(PostItem);

// export default MemoizedPostItem;

export default PostItem;
