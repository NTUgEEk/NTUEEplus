import fetch from 'isomorphic-fetch';

// API for fetching json
// Send reqJSON to url, get json response, and use jsonFunc to set states or other process
// Remember to bind "this" to jsonFunc, or use ()=>{}, just like what I did in several places

export function fetchJSON(url, reqJSON, jsonFunc) {
  fetch(url, {
    credentials: 'include',
    method: 'post',
    headers: {
      Accept: 'basic, application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqJSON),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log('Fetched JSON:', json);
      jsonFunc(json);
    });
}

// Read cookie with name, quite obvious :)

export function readCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
