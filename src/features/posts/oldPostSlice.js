import {
  createSlice,
  createAsyncThunk,
  createSelector,
  nanoid,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (err) {
    return err.message;
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (postContent) => {
    try {
      const response = await axios.post(POSTS_URL, postContent);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (editContent) => {
    const { id } = editContent;

    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, editContent);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postContent) => {
    const { id } = postContent;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return postContent;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      // uses immer under the hood. only works in create slice
      reducer: (state, action) => {
        state.posts.push(action.payload);
      },
      prepare: ({ title, body, userId }) => {
        // prepare receives parameters from dispatch function first.
        // convert parameters into a payload, then passed to the reducer's action.payload
        // got confused because i thought passed params goes into above reducer first,  then into this prepare cb

        // converts into payload then passed to reducer as payload
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    addReaction: (state, action) => {
      // console.log(action);
      const { id, name } = action.payload;
      const foundItem = state.posts.find((item) => item.id === id);
      foundItem.reactions[name] = foundItem.reactions[name] + 1;
    },
    increaseCount: (state, action) => {
      state.count = state.count + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // add date and reactions to every post object
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };

          return post;
        });

        // set newly created posts array into posts state
        state.posts = loadedPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        console.log("eto ang action ng rejected:", action);
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // fake api always returns response with id: 101
        // so get the id of the post with the highest id, then add 1.

        // // Fix for API post IDs:
        // // Creating sortedPosts & assigning the id
        // // would be not be needed if the fake API
        // // returned accurate new post IDs
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        // // End fix for fake API post IDs

        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }

        action.payload.date = new Date().toISOString();

        const { id } = action.payload;
        const filtered = state.posts.filter((post) => post.id !== id);

        state.posts = [...filtered, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }

        const { id } = action.payload;
        const filtered = state.posts.filter((post) => post.id !== id);
        state.posts = filtered;
      });
  },
});

// state here is the store which holds all global state
// access the postState of that global state
// postState is state you have here in postSlice, which has posts array

// same logic as used in useSelector. getting the state and returning state.postState
//const posts = useSelector((state) => state.postState); ==== in PostList.js
// doing this so that if you will change the logic, you only change the logic here
// instead of changing it everywhere state.postState is used

export const selectAllPosts = (state) => state.postState.posts;

export const selectPostById = (state, id) =>
  state.postState.posts.find((post) => post.id === id);

export const getPostStatus = (state) => state.postState.status;
export const getPostsError = (state) => state.postState.error;

// export const selectPostsByUser = (state, userId) =>
//   state.postState.posts.filter((post) => post.userId === userId);

//memoize selectPostByUser

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const getCount = (state) => state.postState.count;

// action creator functions are automatically created when in the reducer of createSlice. (actions from reducer)
export const { addPost, addReaction, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;

// uses immer under the hood that's why this seems like mutating the state, like state.push
// only works inside createSlice

// did this slice initially without prepare.

// const postsSlice = createSlice({
//   name: "posts",
//   initialState,
//   reducers: {
//     addPost: (state, action) => {
//       state.push(action.payload);
//     },
//     updatePost: () => {},
//     deletePost: () => {},
//   },
// });

// const initialState = [
//   {
//     id: "1",
//     title: "Learning Redux Toolkit",
//     content: "I've heard good things.",
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
//   {
//     id: "2",
//     title: "Slices...",
//     content: "The more I say slice, the more I want pizza.",
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
// ];
