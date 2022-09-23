// import Counter from "./features/counter/Counter";
import AddPostForm from "./features/posts/AddPostForm";
import PostsList from "./features/posts/PostsList";
import SinglePostPage from "./features/posts/SinglePostPage";
import Layout from "./components/Layout";
import EditPostForm from "./features/posts/EditPostForm";
import { Routes, Route, Navigate } from "react-router-dom";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";
import PageNotFound from "./components/404";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* 404 page or catch all route that navigates back to home page  */}
        {/* <Route path="*" element={<PageNotFound />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      {/* <Counter /> */}
    </Routes>
  );
}

export default App;
