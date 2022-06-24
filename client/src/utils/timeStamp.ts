type CalculateLifeTime = (timeStamp: number) => string

export const calculateLifetime: CalculateLifeTime = timeStamp => {
  const postTimeStampInMinutes = timeStamp / (1000 * 60)
  const differenceInMinutes = Math.floor((Date.now() / (1000 * 60)) - postTimeStampInMinutes)

  if(differenceInMinutes > 59) {
    const differenceInHours = Math.floor(differenceInMinutes / 60)

    if(differenceInHours > 23) {
      const differenceInDays = Math.floor(differenceInHours / 24)

      if(differenceInDays > 29) {
        const differenceInMonths = Math.floor(differenceInDays / 30)

        if(differenceInMonths > 11) {
          const differenceInYears = Math.floor(differenceInMonths / 12)

          return `${differenceInYears} year${differenceInYears > 1 ? 's' : ''}`
        }

        return `${differenceInMonths} month${differenceInMonths > 1 ? 's' : ''}`
      }

      return `${differenceInDays} day${differenceInHours > 1 ? 's' : ''}`
    }

    return `${differenceInHours} hour${differenceInHours > 1 ? 's' : ''}`
  }

  return `${differenceInMinutes} min${differenceInMinutes > 1 ? 's' : ''}`
}