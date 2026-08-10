import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import App from '../App'

describe('Interactive Calendar & Performance Optimization Tests', () => {
  
  test('renders the calendar and fetches initial posts via MSW', async () => {
    render(<App />)

    // Verify loading state shows initially
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()

    // Wait for the mock posts to fetch and render
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    // Verify dashboard is present
    expect(screen.getByText(/Laboratory Controls/i)).toBeInTheDocument()

    // Verify first mock post is rendered in the calendar
    const postCard = await screen.findByTestId('post-card-post-1')
    expect(postCard).toBeInTheDocument()
    expect(screen.getByText(/Launching our new product!/i)).toBeInTheDocument()
  })

  test('successfully moves a post via HTML5 drag-and-drop simulation', async () => {
    render(<App />)
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    const postCard = await screen.findByTestId('post-card-post-1')
    
    // Find a target day to drop onto (let's target a day with an offset)
    const d = new Date()
    d.setDate(d.getDate() + 4)
    const targetDateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    
    const targetDay = screen.getByTestId(`calendar-day-${targetDateString}`)
    expect(targetDay).toBeInTheDocument()

    // Mock dataTransfer object for HTML5 drag-and-drop
    const mockData = {}
    const dataTransfer = {
      setData: (key, val) => { mockData[key] = val },
      getData: (key) => mockData[key],
      effectAllowed: 'move'
    }

    // Simulate drag start, drag over, drop
    fireEvent.dragStart(postCard, { dataTransfer })
    fireEvent.dragOver(targetDay)
    fireEvent.drop(targetDay, { dataTransfer })

    // Verify postCard is moved to the target day
    await waitFor(() => {
      const movedCard = screen.getByTestId('post-card-post-1')
      expect(targetDay).toContainElement(movedCard)
    })
  })

  test('verifies that React.memo prevents unnecessary re-renders when enabled', async () => {
    render(<App />)
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    // Calculate dates
    const dToday = new Date()
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 4)
    const otherDate = new Date()
    otherDate.setDate(otherDate.getDate() - 2) // an unaffected date

    const todayStr = `${dToday.getFullYear()}-${String(dToday.getMonth() + 1).padStart(2, '0')}-${String(dToday.getDate()).padStart(2, '0')}`
    const targetStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`
    const otherStr = `${otherDate.getFullYear()}-${String(otherDate.getMonth() + 1).padStart(2, '0')}-${String(otherDate.getDate()).padStart(2, '0')}`

    // 1. First test with MEMOIZATION DISABLED (default state)
    // Verify memo toggle is unchecked
    const memoToggle = screen.getByTestId('toggle-memo')
    expect(memoToggle.checked).toBe(false)

    // Reset render counts to get a clean baseline
    const resetCountsBtn = screen.getByTestId('btn-reset-counts')
    fireEvent.click(resetCountsBtn)

    // Retrieve render badge content for an unaffected day
    let unaffectedDayBadge = screen.getByTestId(`calendar-day-${otherStr}`).querySelector('[data-testid="render-badge"]')
    expect(unaffectedDayBadge.textContent).toBe('R: 1')

    // Drag and drop post-1 to targetStr
    const card = screen.getByTestId('post-card-post-1')
    const targetDay = screen.getByTestId(`calendar-day-${targetStr}`)
    
    const mockData = {}
    const dataTransfer = {
      setData: (key, val) => { mockData[key] = val },
      getData: (key) => mockData[key],
      effectAllowed: 'move'
    }

    fireEvent.dragStart(card, { dataTransfer })
    fireEvent.dragOver(targetDay)
    fireEvent.drop(targetDay, { dataTransfer })

    // Wait for update
    await screen.findByTestId('post-card-post-1')

    // Since memoization was OFF, unaffected day should have re-rendered (badge increments)
    unaffectedDayBadge = screen.getByTestId(`calendar-day-${otherStr}`).querySelector('[data-testid="render-badge"]')
    const unoptimizedRenders = parseInt(unaffectedDayBadge.textContent.replace('R: ', ''), 10)
    expect(unoptimizedRenders).toBeGreaterThan(1)

    // 2. Now enable MEMOIZATION
    fireEvent.click(memoToggle)
    expect(memoToggle.checked).toBe(true)

    // Reset render counts to start clean at 1
    fireEvent.click(resetCountsBtn)

    // Unaffected day badge resets to R: 1
    unaffectedDayBadge = screen.getByTestId(`calendar-day-${otherStr}`).querySelector('[data-testid="render-badge"]')
    expect(unaffectedDayBadge.textContent).toBe('R: 1')

    // Perform another drag-and-drop (move it back to todayStr)
    const card2 = screen.getByTestId('post-card-post-1')
    const todayDay = screen.getByTestId(`calendar-day-${todayStr}`)

    const mockData2 = {}
    const dataTransfer2 = {
      setData: (key, val) => { mockData2[key] = val },
      getData: (key) => mockData2[key],
      effectAllowed: 'move'
    }

    fireEvent.dragStart(card2, { dataTransfer: dataTransfer2 })
    fireEvent.dragOver(todayDay)
    fireEvent.drop(todayDay, { dataTransfer: dataTransfer2 })

    // Wait for update
    await screen.findByTestId('post-card-post-1')

    // Since memoization was ON, unaffected day should NOT have re-rendered. It should still be R: 1!
    unaffectedDayBadge = screen.getByTestId(`calendar-day-${otherStr}`).querySelector('[data-testid="render-badge"]')
    expect(unaffectedDayBadge.textContent).toBe('R: 1')
  })

  test('toggles lag simulation control and exercises simulated delays', async () => {
    render(<App />)
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    })

    const lagToggle = screen.getByTestId('toggle-lag')
    expect(lagToggle.checked).toBe(false)

    // Enable lag simulation
    fireEvent.click(lagToggle)
    expect(lagToggle.checked).toBe(true)

    // Trigger a drag and drop while lag is enabled to exercise the lag loop in CalendarDay
    const postCard = await screen.findByTestId('post-card-post-1')
    const d = new Date()
    d.setDate(d.getDate() + 3)
    const targetDateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    
    const targetDay = screen.getByTestId(`calendar-day-${targetDateString}`)
    
    const mockData = {}
    const dataTransfer = {
      setData: (key, val) => { mockData[key] = val },
      getData: (key) => mockData[key],
      effectAllowed: 'move'
    }

    fireEvent.dragStart(postCard, { dataTransfer })
    fireEvent.dragOver(targetDay)
    fireEvent.drop(targetDay, { dataTransfer })

    // Wait for update to complete
    await screen.findByTestId('post-card-post-1')
  })
})
