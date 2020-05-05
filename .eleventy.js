const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const scMeetupDetails = require('./_includes/shortcode-meetup-details');
const filterFullDate = require('./_includes/filter-full-date');

module.exports = (eleventyConfig) => {
  // PLUGIN: RSS feed
  eleventyConfig.addPlugin(pluginRss);

  // PASSTHRU: Copy the `assets` directory to the compiled site folder
  eleventyConfig.addPassthroughCopy('assets');

  // COLLECTION: Create meetup posts collection.
  eleventyConfig.addCollection('meetups', async (collection) => {
    const posts = collection.getFilteredByGlob('./posts/**meetup.md');
    const statPromise = (fileUrl) => new Promise((resolve, reject) => {
      fs.stat(
        fileUrl,
        (err, stats) => {
          if (err) reject(err);

          resolve(stats.mtime);
        },
      );
    });

    // Add file lastModified property
    for (let idx = 0; idx < posts.length; idx += 1) {
      const post = posts[idx];

      // eslint-disable-next-line no-await-in-loop
      post.lastModified = await statPromise(post.inputPath);
    }

    // Reverse the collection (to LIFO)
    // so collections.meetups[0] is always the upcoming|latest meetup.
    return posts.reverse();
  });

  // NUNJUCKS SHORTCODE: Format meeting details message block.
  eleventyConfig.addShortcode('meetupDetails', scMeetupDetails);

  // TRANSFORM: Add appropriate TARGET and REL to external links.
  eleventyConfig.addTransform('external-link-rel', (content) => {
    const desired = {
      target: 'target="_blank"',
      rel: 'rel="nofollow noopener noreferrer"',
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
      } if (hasTarget) {
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

    if (typeof input === 'string') {
      if (limit >= 0) {
        return input.substring(0, limit);
      }

      return input.substring(limit);
    }
    if (Array.isArray(input)) {
      const minLimit = Math.min(limit, input.length);

      if (minLimit >= 0) {
        return input.slice(0, minLimit);
      }

      return input.slice(input.length + minLimit, input.length);
    }

    return input;
  });

  return {
    dir: {
      input: './',
      output: './_site',
      layouts: './_layouts',
    },
    pathPrefix: '/ajs-11ty/',
    templateFormats: [
      'njk',
      'liquid',
      'md',
      'html',
    ],
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
};
