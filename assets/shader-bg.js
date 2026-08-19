/* =========================================================
   DNY Bilişim — WebGL dalga arka planı
   ---------------------------------------------------------
   Gönderilen React/three.js bileşenindeki fragment shader'ı
   temel alır; three.js olmadan, doğrudan WebGL ile çizilir
   (kütüphane indirilmez, ~0 KB ek yük).

   Orijinal shader saf kırmızı/yeşil/mavi şeritler üretiyordu.
   Burada renkler sitenin paletine bağlandı: mavi, mor ve
   camgöbeği. Kanal başına hafif kayma (kromatik sapma) korundu.

   Kullanım:  <canvas class="aurora" data-bg="wave"></canvas>
   WebGL yoksa canvas boş kalır, sayfa bozulmaz.
   ========================================================= */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-color-scheme: dark)') && false;
  try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { RM = false; }

  var VERT =
    'attribute vec2 p;' +
    'void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

  var FRAG = [
    'precision highp float;',
    'uniform vec2 res;',
    'uniform float time;',
    'uniform vec2 mouse;',      // -1..1
    'uniform float xScale;',
    'uniform float yScale;',
    'uniform float distortion;',

    // marka renkleri
    'const vec3 C1 = vec3(0.180, 0.486, 0.965);',   // #2E7CF6 mavi
    'const vec3 C2 = vec3(0.478, 0.361, 0.941);',   // #7A5CF0 mor
    'const vec3 C3 = vec3(0.149, 0.776, 0.863);',   // #26C6DC camgöbeği

    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy * 2.0 - res) / min(res.x, res.y);',
    '  uv.y -= mouse.y * 0.12;',                    // imleç şeridi hafifçe eğer
    '  float d = length(uv) * distortion;',
    '  float sx = xScale + mouse.x * 0.15;',

    // üç şerit, aralarında küçük faz farkı: kromatik sapma hissi
    '  float a = uv.x * (1.0 + d);',
    '  float b = uv.x;',
    '  float c = uv.x * (1.0 - d);',

    '  float i1 = 0.028 / abs(uv.y + sin((a + time) * sx) * yScale);',
    '  float i2 = 0.028 / abs(uv.y + sin((b + time * 0.92) * sx) * yScale);',
    '  float i3 = 0.028 / abs(uv.y + sin((c + time * 0.84) * sx) * yScale);',

    '  vec3 col = C1 * i1 + C2 * i2 + C3 * i3;',
    '  col = col / (col + vec3(0.85));',            // yumuşak sıkıştırma, patlamasın
    '  float vig = 1.0 - smoothstep(0.6, 1.6, length(uv));',
    '  col *= 0.55 + 0.45 * vig;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      if (window.console) console.warn('[dny] shader derlenemedi', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function start(canvas) {
    var gl = null;
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false }); } catch (e) {}
    if (!gl) return false;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'res');
    var uTime = gl.getUniformLocation(prog, 'time');
    var uMouse = gl.getUniformLocation(prog, 'mouse');
    gl.uniform1f(gl.getUniformLocation(prog, 'xScale'), 1.15);
    gl.uniform1f(gl.getUniformLocation(prog, 'yScale'), 0.42);
    gl.uniform1f(gl.getUniformLocation(prog, 'distortion'), 0.06);

    var t = 0, raf = null, visible = true;
    var mx = 0, my = 0, tx = 0, ty = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.25 : 1.75);
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    }

    function frame() {
      size();
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!RM) t += 0.006;
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', size);
    if (!RM) {
      window.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      }, { passive: true });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !visible) { visible = true; raf = requestAnimationFrame(frame); }
          else if (!e.isIntersecting && visible) { visible = false; cancelAnimationFrame(raf); }
        });
      }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible) raf = requestAnimationFrame(frame);
    });

    frame();
    if (RM) cancelAnimationFrame(raf);   // hareket azaltılmışsa tek kare kalsın
    return true;
  }

  Array.prototype.slice.call(document.querySelectorAll('canvas[data-bg="wave"]'))
    .forEach(function (c) {
      // WebGL yoksa 2B ağ arka planına düş
      if (!start(c)) c.setAttribute('data-bg', 'flat');
    });
})();
