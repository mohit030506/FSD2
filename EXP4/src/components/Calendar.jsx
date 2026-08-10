import React, { useMemo } from 'react'
import { CalendarDayRaw, CalendarDayMemo } from './CalendarDay'

const EMPTY_ARRAY = []

export default function Calendar({ 
  posts, 
  memoEnabled, 
  lagEnabled, 
  onDropPost,
  onDragStartPost
}) {
  const currentMonthDate = useMemo(() => new Date(), [])
  const year = currentMonthDate.getFullYear()
  const month = currentMonthDate.getMonth()

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' })

  // Calculate calendar days
  const calendarDays = useMemo(() => {
    const days = []
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const startDayOfWeek = firstDay.getDay()
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    
    // Fill previous month days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({
        dayNumber: prevDate.getDate(),
        isCurrentMonth: false,
        dateString: `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`
      })
    }

    // Fill current month days
    const totalDays = lastDay.getDate()
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: true,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      })
    }

    // Fill next month days
    const totalGridDays = days.length > 35 ? 42 : 35
    const remainingDays = totalGridDays - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateString: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`
      })
    }

    return days
  }, [year, month])

  // Group posts by dateString for efficient lookup (O(N) vs O(GridDays * N))
  // This is a great memoization showcase!
  const postsByDate = useMemo(() => {
    const map = {}
    posts.forEach(post => {
      if (!map[post.date]) {
        map[post.date] = []
      }
      map[post.date].push(post)
    })
    return map
  }, [posts])

  const DayComponent = memoEnabled ? CalendarDayMemo : CalendarDayRaw

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3>📅 {monthName} {year}</h3>
      </div>
      
      <div className="calendar-weekdays">
        {daysOfWeek.map(d => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-grid" data-testid="calendar-grid">
        {calendarDays.map(day => (
          <DayComponent
            key={day.dateString}
            dayNumber={day.dayNumber}
            dateString={day.dateString}
            isCurrentMonth={day.isCurrentMonth}
            posts={postsByDate[day.dateString] || EMPTY_ARRAY}
            memoEnabled={memoEnabled}
            lagEnabled={lagEnabled}
            onDragStartPost={onDragStartPost}
            onDropPost={onDropPost}
          />
        ))}
      </div>
    </div>
  )
}
