// Required Imports
const axios = require("axios");

// Fetch a motivational quote from an AI-powered API
module.exports.fetchMotivationalQuote = async function () {
  try {
    const quoteResponse = await axios.get("https://zenquotes.io/api/random");
    const quote = quoteResponse.data[0].q;
    return quote;
  } catch (error) {
    console.error("Error fetching motivational quote:", error);
    return "You did it! Great job on completing the task!";
  }
};