
const { Octokit } = require('@octokit/rest');

/**
 * Updates a GitHub issue with the provided data.
 * @param {object} issueData - The data to update the issue with.
 * @param {string} issueData.owner - The owner of the repository.
 * @param {string} issueData.repo - The name of the repository.
 * @param {number} issueData.issue_number - The number of the issue to update.
 * @param {object} issueData.data - The data to update the issue with (e.g., title, body, state).
 * @returns {Promise<object>} The updated issue object.
 */
async function updateIssue(issueData) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const { owner, repo, issue_number, data } = issueData;

  const response = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number,
    ...data,
  });

  return response.data;
}

module.exports = updateIssue;
