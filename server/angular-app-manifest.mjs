
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Alabanzas-front/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Alabanzas-front"
  },
  {
    "renderMode": 2,
    "route": "/Alabanzas-front/song"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5264, hash: 'fedd0bc4138c79d0fb36af6f32f7f0978b9b1ffae679994cb0402a2db4ad2a94', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1031, hash: '3daee2b0fcbd3ea5f2fe79550e276fd3528d54fe812a804390d703bf1d2e84e0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'song/index.html': {size: 13864, hash: 'd42833fb4f2117108e7ab891ea413cef54dee512a51df54cadf56bd61023b927', text: () => import('./assets-chunks/song_index_html.mjs').then(m => m.default)},
    'index.html': {size: 17455, hash: '9680c1943d3578266148c1ff0c67a07a863944e66f62d41e7d8b784a70e5eade', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-R37GORVW.css': {size: 226826, hash: 'd0uUHn5AnKw', text: () => import('./assets-chunks/styles-R37GORVW_css.mjs').then(m => m.default)}
  },
};
