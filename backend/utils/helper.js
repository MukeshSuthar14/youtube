exports.createSlug = (title) => {
  const separator = '-';

  // Convert to lowercase (you can use .toLocaleLowerCase() for i18n support)
  title = title.toLowerCase();

  // Replace @ with -at-
  title = title.replace(/@/g, `${separator}at${separator}`);

  // Replace all dashes/underscores into single separator
  title = title.replace(/[-_]+/g, separator);

  // Remove all characters except letters, numbers, whitespace, and separator
  title = title.replace(new RegExp(`[^\\p{L}\\p{N}\\s${separator}]`, 'gu'), '');

  // Replace whitespace and repeated separators with a single separator
  title = title.replace(new RegExp(`[\\s${separator}]+`, 'g'), separator);

  // Trim leading/trailing separators
  return title.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
}
