export const formatRelativeOrDate = (dateInput?: number | string | Date): string => {
  if (!dateInput) return 'Recently';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds >= 0 && diffInSeconds < 60) {
    return 'Just now';
  }
  if (diffInSeconds > 0 && diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
  }
  if (diffInSeconds > 0 && diffInSeconds < 86400 && now.getDate() === d.getDate()) {
    const hours = Math.floor(diffInSeconds / 3600);
    if (hours < 1) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
