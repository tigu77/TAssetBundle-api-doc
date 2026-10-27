(function () {
  'use strict';
  var nav = document.querySelector('[data-docs-version]');
  if (!nav) return;
  var root = new URL(nav.getAttribute('data-site-root'), window.location.href);
  var select = nav.querySelector('select');
  fetch(new URL('versions.json', root)).then(function (response) {
    if (!response.ok) throw new Error('Version manifest unavailable');
    return response.json();
  }).then(function (manifest) {
    select.textContent = '';
    manifest.versions.forEach(function (entry) {
      var option = document.createElement('option');
      option.value = entry.id;
      option.textContent = entry.label;
      option.selected = entry.id === nav.getAttribute('data-docs-version');
      select.appendChild(option);
    });
    select.disabled = false;
    select.addEventListener('change', function () {
      var entry = manifest.versions.find(function (v) { return v.id === select.value; });
      if (!entry) return;
      var relative = nav.getAttribute('data-page');
      var exists = entry.pages.indexOf(relative) >= 0;
      var target = new URL(entry.path + (exists ? relative : 'index.html'), root);
      if (exists) target.hash = window.location.hash;
      window.location.assign(target.href);
    });
  }).catch(function () { /* Static navigation remains available without JS/network. */ });
}());
