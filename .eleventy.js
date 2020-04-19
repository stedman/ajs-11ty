const scMeetupDetails = require('./_includes/shortcode-meetup-details');
const filterFullDate = require('./_includes/filter-full-date');

module.exports = (eleventyConfig) => {
  // PASSTHRU: Copy the `assets` directory to the compiled site folder
  eleventyConfig.addPassthroughCopy('assets');

  // COLLECTION: Create meetup posts collection.
  eleventyConfig.addCollection('meetups', (collection) => {
    // Reverse the collection (to LIFO) so collections.meetups[0] is always the upcoming|latest meetup.
    return collection.getFilteredByGlob('./posts/**meetup.md').reverse();
  });

  // NUNJUCKS SHORTCODE: Format meeting details message block.
  eleventyConfig.addShortcode('meetupDetails', scMeetupDetails);

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

  // FILTER: Convert dates to MMMM D, YYYY format.
  eleventyConfig.addFilter('fullDate', filterFullDate);

  // FILTER: Limit array length (https://gist.github.com/jbmoelker/9693778)
  eleventyConfig.addFilter('limitTo', (input, limit) => {
    if (typeof limit !== 'number') {
      return input;
    }

    if (typeof input === 'string'){
      if (limit >= 0) {
        return input.substring(0, limit);
      } else {
        return input.substring(limit);
      }
    }
    if (Array.isArray(input)) {
      const minLimit = Math.min(limit, input.length);

      if (minLimit >= 0) {
        return input.slice(0, minLimit);
      } else {
        return input.slice(input.length + minLimit, input.length);
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
