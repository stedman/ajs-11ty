module.exports = (eleventyConfig) => {
  // Copy the `assets` directory to the compiled site folder
  eleventyConfig.addPassthroughCopy('assets');

  // Add appropriate TARGET and REL to external links.
  eleventyConfig.addTransform('external-link-rel', (content) => {
    const desired = {
      target: 'target="_blank"',
      rel: 'rel="nofollow noopener noreferrer"'
    };
    // Find all external links--lazily we'll assume those start with https.
    const reLinkMatch = /<a .*href="https?:\/\/[^"]+".*?>/g;
    // Find target and rel attributes.
    const reTarget = /.*target="([^"]+)".*/;
    const reRel = /.*rel="([^"]+)".*/;

    return content.replace(reLinkMatch, (linkMatch) => {
      const hasTarget = reTarget.test(linkMatch);

      if (hasTarget && reRel.test(linkMatch)) {
        return linkMatch;
      } else if (hasTarget) {
        return linkMatch.replace('>', ` ${desired.rel}>`);
      }

      return linkMatch.replace('>', ` ${desired.target} ${desired.rel}>`);
    });
  });

  // Convert dates to MMMM D, YYYY format.
  eleventyConfig.addNunjucksFilter('fullDate', (value) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const newDate = new Date(value);

    return `${monthNames[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
  });

  // Create meetup posts collection.
  eleventyConfig.addCollection('meetups', (collection) => {
    return collection.getFilteredByGlob('./posts/**meetup.md').reverse();
  });

  return {
    dir: {
      input: './',
      output: './_site'
    },
    passthroughFileCopy: true,
    pathPrefix: '',
    templateFormats: [
      "html",
      "liquid",
      "md",
      "njk",
    ],
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}
