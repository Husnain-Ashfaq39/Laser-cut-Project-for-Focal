// Utility to format time in seconds into a human-readable format
export const formatCuttingTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (totalSeconds % 60).toFixed(2); // Round seconds to 2 decimal places

  let timeString = "";
  if (hours > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    timeString += `${minutes}min `;
  }
  if (parseFloat(seconds) > 0 || (hours === 0 && minutes === 0)) {
    timeString += `${seconds}s`;
  }

  return timeString.trim();
};
