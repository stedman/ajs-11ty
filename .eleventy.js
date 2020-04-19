module.exports = (eleventyConfig) => {
  // PASSTHRU: Copy the `assets` directory to the compiled site folder
  eleventyConfig.addPassthroughCopy('assets');

  // COLLECTION: Create meetup posts collection.
  eleventyConfig.addCollection('meetups', (collection) => {
    // Reverse the collection (to LIFO) so collections.meetups[0] is always the upcoming|latest meetup.
    return collection.getFilteredByGlob('./posts/**meetup.md').reverse();
  });

  // TRANSFORM: Add appropriate TARGET and REL to external links.
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

  // NUNJUCKS: Convert dates to MMMM D, YYYY format.
  eleventyConfig.addNunjucksFilter('fullDate', (input) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const newDate = new Date(input);

    return `${monthNames[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
  });

  // NUNJUCKS: Limit array length (https://gist.github.com/jbmoelker/9693778)
  eleventyConfig.addNunjucksFilter('limitTo', (input, limit) => {
    if (typeof limit !== 'number') {
      return input;
    }

    if (typeof input === 'string'){
      if (limit >= 0) {
        return input.substring(0, limit);
      } else {
        return input.substr(limit);
      }
    }
    if (Array.isArray(input)) {
      limit = Math.min(limit, input.length);
      if (limit >= 0) {
        return input.splice(0, limit);
      } else {
        return input.splice(input.length + limit, input.length);
      }
    }
    return input;
  });

  return {
    dir: {
      input: './',
      output: './_site'
    },
    passthroughFileCopy: true,
    pathPrefix: '/ajs-11ty/',
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
