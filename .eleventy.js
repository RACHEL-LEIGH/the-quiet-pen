module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/og-image.png");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value, null, 2));

  eleventyConfig.addCollection("blogPosts", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/blog/*.njk").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addShortcode("faqSchema", function (faq) {
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  });

  eleventyConfig.addShortcode("articleSchema", function (article) {
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      author: {
        "@type": "Organization",
        name: "The Quiet Pen",
      },
      publisher: {
        "@type": "Organization",
        name: "The Quiet Pen",
      },
    };
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
