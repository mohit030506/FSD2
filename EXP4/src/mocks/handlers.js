import { http, HttpResponse } from 'msw'

// Helper to get YYYY-MM-DD format for a given offset from current day
function getDateWithOffset(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// In-memory store for mocked posts
let mockPosts = [
  {
    id: 'post-1',
    title: '🚀 Launching our new product! #startup',
    date: getDateWithOffset(0), // Today
    platform: 'twitter',
    content: 'Full details coming soon. Stay tuned!',
  },
  {
    id: 'post-2',
    title: '💡 5 design rules for clean dashboards',
    date: getDateWithOffset(2), // 2 days from now
    platform: 'linkedin',
    content: 'Rule 1: Content hierarchy. Rule 2: White space. Read more...',
  },
  {
    id: 'post-3',
    title: '🔥 Weekly team recap video',
    date: getDateWithOffset(-3), // 3 days ago
    platform: 'instagram',
    content: 'Check out what our devs built this week! #buildinpublic',
  },
  {
    id: 'post-4',
    title: '📅 Planning for Q3 marketing campaigns',
    date: getDateWithOffset(5), // 5 days from now
    platform: 'facebook',
    content: 'Discussing budget, targets, and content pipelines.',
  },
  {
    id: 'post-5',
    title: '🧠 Deep dive into React rendering model',
    date: getDateWithOffset(-1), // Yesterday
    platform: 'linkedin',
    content: 'How react fiber works under the hood. Explaining reconciliation.',
  }
]

export const handlers = [
  // GET all posts
  http.get('/api/posts', () => {
    return HttpResponse.json(mockPosts)
  }),

  // PUT update a post (e.g., date changed due to drag & drop)
  http.put('/api/posts/:id', async ({ request, params }) => {
    const { id } = params
    const updatedData = await request.json()
    
    let updatedPost = null
    mockPosts = mockPosts.map(post => {
      if (post.id === id) {
        updatedPost = { ...post, ...updatedData }
        return updatedPost
      }
      return post
    })

    if (!updatedPost) {
      return new HttpResponse(null, { status: 404, statusText: 'Post Not Found' })
    }

    return HttpResponse.json(updatedPost)
  })
]
