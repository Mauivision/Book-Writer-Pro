import { formatDate } from '@/utils/formatDate'

describe('formatDate utility', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('January 1, 2024')
  })

  it('handles invalid dates', () => {
    expect(formatDate(new Date('invalid'))).toBe('Invalid Date')
  })

  it('handles different date formats', () => {
    const date = new Date('2024-12-31')
    expect(formatDate(date)).toBe('December 31, 2024')
  })
}) 