export const checkIsOpen = (
  openingTime: string,
  closingTime: string,
): boolean => {
  const now = new Date();
  const currMinutes = now.getHours() * 60 + now.getMinutes();
  const [openHour = 0, openMin = 0] = openingTime.split(":").map(Number);
  const [closeHour = 0, closeMin = 0] = closingTime.split(":").map(Number);
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  // Handle overnight closing (e.g., 22:00 - 02:00)
  if (closeMinutes < openMinutes) {
    return currMinutes >= openMinutes || currMinutes < closeMinutes;
  }

  return currMinutes >= openMinutes && currMinutes < closeMinutes;
};
