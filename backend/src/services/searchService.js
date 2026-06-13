const tavily = require("tavily");

async function searchWeb(query) {
  const result = await tavily.search({
    api_key: process.env.TAVILY_API_KEY,
    query,
    search_depth: "advanced",
    max_results: 5,
  });

  return result.results;
}

module.exports = { searchWeb };

async function searchWeb(query) {
  const result = await tavily.search(query);
  return result.results;
}

module.exports = { searchWeb };