export const matchRoute = (pattern: string, path: string) => {
  // convert "/user-profile/:id" → ^/user-profile/[^/]+$
  const regexPattern = "^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$";
  const regex = new RegExp(regexPattern);
  return regex.test(path);
};