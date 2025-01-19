export const formattedTimestamp = () => {
  const now = new Date();
  const formattedDateTime = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return formattedDateTime;
};
