import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { updatePlatformCount } from '../platforms/platformsSlice';

// Create entity adapter for posts, sorted by date descending (newest first)
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
});

// Initial mock data to seed if local storage is empty
const MOCK_POSTS = [
  {
    id: 'post-1',
    title: 'Launching our new design system!',
    content: 'We are thrilled to announce the release of glassmorphism-ui! A highly responsive, premium React design framework designed to make your web apps look gorgeous out of the box. Check it out and let us know what you think! 🚀✨',
    platformId: 'twitter',
    status: 'published',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    reactions: { thumbsUp: 12, heart: 8, rocket: 15, eyes: 3 }
  },
  {
    id: 'post-2',
    title: 'The Rise of Centralized State Management',
    content: 'Managing state across large React applications doesn\'t have to be a nightmare. In our latest technical deep-dive, we explore how Redux Toolkit helps normalize state and simplify complex frontend architectures. Read the full article on our engineering blog.',
    platformId: 'linkedin',
    status: 'published',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    reactions: { thumbsUp: 24, heart: 14, rocket: 4, eyes: 5 }
  },
  {
    id: 'post-3',
    title: 'Weekend Project: Crafting Premium Interfaces',
    content: 'Spent this Saturday experimenting with CSS backdrop-filters, custom HSL gradients, and Redux Toolkit. There is something incredibly satisfying about bringing complex states and sleek UI together. What are you building this weekend?',
    platformId: 'instagram',
    status: 'published',
    date: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    reactions: { thumbsUp: 45, heart: 32, rocket: 8, eyes: 12 }
  },
  {
    id: 'post-4',
    title: 'Upcoming Feature Launch Announcement',
    content: 'A sneak peek at our upcoming scheduling tool. Draft posts, select target social networks, set your timers, and let our background workers handle the publishing pipeline. Launching next Tuesday!',
    platformId: 'facebook',
    status: 'scheduled',
    date: new Date(Date.now() + 1000 * 60 * 600).toISOString(), // in 10 hours
    reactions: { thumbsUp: 5, heart: 2, rocket: 1, eyes: 0 }
  }
];

// Async Thunks for Mock API calls
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const stored = localStorage.getItem('rtk_posts');
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem('rtk_posts', JSON.stringify(MOCK_POSTS));
    return MOCK_POSTS;
  }
);

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (newPostData, { dispatch }) => {
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const newPost = {
      id: `post-${Date.now()}`,
      date: new Date().toISOString(),
      reactions: { thumbsUp: 0, heart: 0, rocket: 0, eyes: 0 },
      ...newPostData
    };
    
    // Save to localStorage
    const stored = localStorage.getItem('rtk_posts');
    const posts = stored ? JSON.parse(stored) : [...MOCK_POSTS];
    posts.push(newPost);
    localStorage.setItem('rtk_posts', JSON.stringify(posts));
    
    // Increment the count in platform slice
    dispatch(updatePlatformCount({ platformId: newPost.platformId, change: 1 }));
    return newPost;
  }
);

export const updatePostAsync = createAsyncThunk(
  'posts/updatePostAsync',
  async (updatedPostData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const stored = localStorage.getItem('rtk_posts');
    const posts = stored ? JSON.parse(stored) : [...MOCK_POSTS];
    const index = posts.findIndex(p => p.id === updatedPostData.id);
    let previousPlatformId = null;
    
    if (index !== -1) {
      previousPlatformId = posts[index].platformId;
      posts[index] = { ...posts[index], ...updatedPostData };
      localStorage.setItem('rtk_posts', JSON.stringify(posts));
    }
    
    return { post: { ...posts[index] }, previousPlatformId };
  }
);

export const deletePostAsync = createAsyncThunk(
  'posts/deletePostAsync',
  async ({ postId, platformId }, { dispatch }) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const stored = localStorage.getItem('rtk_posts');
    const posts = stored ? JSON.parse(stored) : [...MOCK_POSTS];
    const filtered = posts.filter(p => p.id !== postId);
    localStorage.setItem('rtk_posts', JSON.stringify(filtered));
    
    // Decrement the count in platform slice
    dispatch(updatePlatformCount({ platformId, change: -1 }));
    return postId;
  }
);

const initialState = postsAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        if (!existingPost.reactions) {
          existingPost.reactions = { thumbsUp: 0, heart: 0, rocket: 0, eyes: 0 };
        }
        existingPost.reactions[reaction]++;
        
        // Update local storage in reaction reducer to persist it
        const stored = localStorage.getItem('rtk_posts');
        if (stored) {
          const posts = JSON.parse(stored);
          const idx = posts.findIndex(p => p.id === postId);
          if (idx !== -1) {
            posts[idx].reactions = existingPost.reactions;
            localStorage.setItem('rtk_posts', JSON.stringify(posts));
          }
        }
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        const { post } = action.payload;
        postsAdapter.upsertOne(state, post);
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
      });
  }
});

export const { reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

// Export selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts);
