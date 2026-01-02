export const isoToday = () => new Date().toISOString().split("T")[0];

export const getDaysDifference = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today - date);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTimeAgoString = (dateString) => {
  const days = getDaysDifference(dateString);
  if (days === 0) return "Heute";
  if (days === 1) return "Gestern";
  return `vor ${days} Tagen`;
};


