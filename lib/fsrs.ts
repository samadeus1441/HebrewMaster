/**
 * FSRS (Free Spaced Repetition Scheduler) Algorithm v4 - Simplified Implementation
 * 
 * This is a simplified version of FSRS for the Hebrew Master LMS.
 * It calculates next review intervals based on stability and difficulty.
 */

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface FSRSResult {
  newStability: number
  newDifficulty: number
  nextInterval: number // in days
  nextReviewDate: Date
}

export class FSRS {
  private static readonly BASE_FACTOR = 1.3
  private static readonly INTERVAL_SCALAR = 9 // For A1 level learners

  /**
   * Calculate next review parameters based on user rating
   * 
   * Formula:
   * - New Stability = Current Stability * (1 + Factor * Difficulty)
   * - Next Interval = Current Stability * Scalar
   * 
   * @param currentStability Current stability value (S in FSRS)
   * @param currentDifficulty Current difficulty value (D in FSRS, 0-1)
   * @param rating User's rating: 'again', 'hard', 'good', or 'easy'
   * @returns FSRSResult with new stability, difficulty, interval, and next review date
   */
  static calculateNextReview(
    currentStability: number,
    currentDifficulty: number,
    rating: Rating
  ): FSRSResult {
    let factor: number
    let newDifficulty: number = currentDifficulty

    // Determine factor and difficulty adjustment based on rating
    switch (rating) {
      case 'again':
        factor = 0.1 // Very low retention, reset stability
        newDifficulty = Math.min(1.0, currentDifficulty + 0.15) // Increase difficulty
        break
      case 'hard':
        factor = 0.5 // Low retention
        newDifficulty = Math.min(1.0, currentDifficulty + 0.05) // Slightly increase difficulty
        break
      case 'good':
        factor = 1.0 // Normal retention
        // Keep difficulty mostly stable
        break
      case 'easy':
        factor = 1.5 // High retention
        newDifficulty = Math.max(0.1, currentDifficulty - 0.05) // Slightly decrease difficulty
        break
    }

    // Calculate new stability: S_new = S_old * (1 + Factor * D)
    const newStability = Math.max(
      0.1, // Minimum stability
      currentStability * (1 + factor * this.BASE_FACTOR * currentDifficulty)
    )

    // Calculate next interval in days
    // For A1 level, use simpler intervals based on rating
    let nextInterval: number
    switch (rating) {
      case 'again':
        nextInterval = 0.042 // ~1 hour (in days)
        break
      case 'hard':
        nextInterval = 2 // 2 days
        break
      case 'good':
        nextInterval = 4 // 4 days
        break
      case 'easy':
        nextInterval = 7 // 7 days
        break
      default:
        nextInterval = 1
    }

    // Calculate next review date
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval)

    return {
      newStability,
      newDifficulty,
      nextInterval,
      nextReviewDate,
    }
  }

  /**
   * Get initial stability for a new card
   */
  static getInitialStability(): number {
    return 0.4 // Low initial stability for A1 learners
  }

  /**
   * Get initial difficulty for a new card
   */
  static getInitialDifficulty(): number {
    return 0.3 // Moderate initial difficulty
  }

  /**
   * Format interval for display
   */
  static formatInterval(intervalInDays: number): string {
    if (intervalInDays < 1) {
      const hours = Math.round(intervalInDays * 24)
      return hours === 1 ? '1 hour' : `${hours} hours`
    }
    if (intervalInDays === 1) {
      return '1 day'
    }
    return `${Math.round(intervalInDays)} days`
  }
}

// Export convenience function
export function calculateNextReview(
  currentStability: number,
  currentDifficulty: number,
  rating: Rating
): FSRSResult {
  return FSRS.calculateNextReview(currentStability, currentDifficulty, rating)
}
