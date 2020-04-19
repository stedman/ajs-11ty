module.exports = (input) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const newDate = new Date(input);

  return `${monthNames[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
};
