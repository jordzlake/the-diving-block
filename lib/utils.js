export const generateQueryString = (params) => {
  return Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined && params[key] !== null && params[key] !== ""
    )
    .map((key) => {
      if (Array.isArray(params[key])) {
        return params[key]
          .map(
            (value) =>
              `<span class="math-inline">\{encodeURIComponent\(key\)\}\=</span>{encodeURIComponent(value)}`
          )
          .join("&");
      }
      return `<span class="math-inline">\{encodeURIComponent\(key\)\}\=</span>{encodeURIComponent(params[key])}`;
    })
    .join("&");
};
