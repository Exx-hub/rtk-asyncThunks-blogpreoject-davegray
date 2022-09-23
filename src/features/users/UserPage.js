import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { selectPostsByUser } from "../posts/postsSlice";
import { Link, useParams } from "react-router-dom";

const UserPage = () => {
  const { userId } = useParams(); // getting the user id from url / route

  const user = useSelector((state) => selectUserById(state, +userId)); // getting user from store using userId

  // getting all posts by user using userId
  const postsForUser = useSelector((state) =>
    selectPostsByUser(state, +userId)
  );

  // mapping through all posts by user and creating list item for each.
  // each list item routes to singlepost page using postid
  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  const postListOfUser =
    postTitles.length > 0 ? (
      <ol>{postTitles}</ol>
    ) : (
      <p>No Posts by {user?.name} found.</p>
    );

  return (
    <section>
      <h2>{user?.name}</h2>

      {postListOfUser}
    </section>
  );
};

export default UserPage;
