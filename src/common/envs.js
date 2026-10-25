// @ts-check

const whitelist = process.env.WHITELIST
  ? process.env.WHITELIST.split(",")
  : undefined;

const gistWhitelist = process.env.GIST_WHITELIST
  ? process.env.GIST_WHITELIST.split(",")
  : undefined;

const excludeRepositories = process.env.EXCLUDE_REPO
  ? process.env.EXCLUDE_REPO.split(",")
  : [];

// Self-hosted instances whose PAT can read private repositories may opt in to
// pinning them. Keep this off on public deployments.
const allowPrivateRepos = process.env.ALLOW_PRIVATE_REPOS === "true";

// With include_all_commits, count the user's commits on every branch of every
// repository they own (forks too) instead of using commit search, which only
// sees default branches of non-forks. Costs a few hundred REST requests.
const countAllBranchCommits = process.env.COUNT_ALL_BRANCH_COMMITS === "true";

export {
  whitelist,
  gistWhitelist,
  excludeRepositories,
  allowPrivateRepos,
  countAllBranchCommits,
};
