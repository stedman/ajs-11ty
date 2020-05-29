const Image = require('@11ty/eleventy-img');

module.exports = async (src, alt, className, outputFormat = 'jpeg') => {
  if (alt === undefined) {
    throw new Error(`Missing ALT attribute from: ${src}`);
  }

  const classAttr = className ? `class="${className}"` : '';

  try {
    const stats = await Image(src, {
      cacheDuration: '12w',
      formats: [outputFormat],
      urlPath: '/ajs-11ty/assets/avatar/', // path prefix: /ajs-11ty/
      outputDir: '_site/assets/avatar/',
      widths: [96],
    });

    const props = stats[outputFormat].pop();

    return `<img ${classAttr} src="${props.url}" width="${props.width}" height="${props.height}" alt="${alt}" loading="lazy">`;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err, `alt: ${alt}`);

    return '';
  }
};
