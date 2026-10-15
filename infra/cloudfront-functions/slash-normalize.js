function buildQueryString(queryString) {
  var keys = Object.keys(queryString);
  if (!keys.length) return '';
  var parts = keys.map(function (k) {
    var val = queryString[k];
    var raw;
    if (val && val.multiValue) {
      raw = val.multiValue.map(function (v) { return encodeURIComponent(v.value); }).join('&');
    } else if (val && val.value !== '') {
      raw = encodeURIComponent(val.value);
    } else {
      raw = '';
    }
    return encodeURIComponent(k) + (raw !== '' ? '=' + raw : '');
  });
  return '?' + parts.join('&');
}

function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var uri = request.uri;
  var isFile = /\.[a-zA-Z0-9]+$/.test(uri);

  // Canonicalize host: www.pantrytostore.com -> pantrytostore.com
  var canonicalHost = host.indexOf('www.') === 0 ? host.slice(4) : host;
  var hostChanged = canonicalHost !== host;

  // Directories get a trailing slash (root already has one).
  var pathEndsWithSlash = uri.charAt(uri.length - 1) === '/';
  var needsSlash = !isFile && !pathEndsWithSlash;

  if (hostChanged || needsSlash) {
    var targetPath = needsSlash ? uri + '/' : uri;
    return {
      statusCode: 301,
      statusDescription: 'Permanent Redirect',
      headers: {
        location: { value: 'https://' + canonicalHost + targetPath + buildQueryString(request.querystring) }
      }
    };
  }

  if (!isFile) {
    request.uri = uri + 'index.html';
  }
  return request;
}
