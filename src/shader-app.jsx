import { useEffect, useRef, useState } from "react";

// ─── ShaderBackground component (/components/ui/shader-background.tsx) ───────
const ShaderBackground = () => {
  const canvasRef = useRef(null);

  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    const float overallSpeed = 0.2;
    const float gridSmoothWidth = 0.015;
    const float axisWidth = 0.05;
    const float majorLineWidth = 0.025;
    const float minorLineWidth = 0.0125;
    const float majorLineFrequency = 5.0;
    const float minorLineFrequency = 1.0;
    const vec4 gridColor = vec4(0.5);
    const float scale = 5.0;
    const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.2;
    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.2;
    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;
    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;
    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;
    const int linesPerGroup = 16;

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
    #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

    float drawGridLines(float axis) {
      return drawCrispLine(0.0, axisWidth, axis)
            + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
            + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
    }

    float drawGrid(vec2 space) {
      return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
    }

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec4 fragColor;
      vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);
      vec4 bgColor1 = vec4(0.1, 0.1, 0.3, 1.0);
      vec4 bgColor2 = vec4(0.3, 0.1, 0.5, 1.0);

      for(int l = 0; l < linesPerGroup; l++) {
        float normalizedLineIndex = float(l) / float(linesPerGroup);
        float offsetTime = iTime * offsetSpeed;
        float offsetPosition = float(l) + space.x * offsetFrequency;
        float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
        float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
        float linePosition = getPlasmaY(space.x, horizontalFade, offset);
        float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

        float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

        line = line + circle;
        lines += line * lineColor * rand;
      }

      fragColor = mix(bgColor1, bgColor2, uv.x);
      fragColor *= verticalFade;
      fragColor.a = 1.0;
      fragColor += lines;

      gl_FragColor = fragColor;
    }
  `;

  const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initShaderProgram = (gl, vsSource, fsSource) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) return null;
    return shaderProgram;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const programInfo = {
      program: shaderProgram,
      attribLocations: { vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition") },
      uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, "iResolution"),
        time: gl.getUniformLocation(shaderProgram, "iTime"),
      },
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let animId;
    const startTime = Date.now();
    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(programInfo.program);
      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(programInfo.uniformLocations.time, currentTime);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }} />;
};

// ─── Main App (/app/page.tsx or App.tsx) ──────────────────────────────────────
const features = [
  { icon: "⚡", title: "Blazing Fast", desc: "Optimized WebGL rendering at 60fps with zero layout shifts." },
  { icon: "🎨", title: "Fully Customizable", desc: "Tweak colors, speed, amplitude and wave frequency via props." },
  { icon: "📱", title: "Responsive", desc: "Adapts to any screen size. Canvas resizes on every viewport change." },
  { icon: "🧩", title: "Drop-in Ready", desc: "One import, zero config. Works with any React + Tailwind project." },
];

export default function App() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily: "'Courier New', monospace", minHeight: "100vh", color: "white", position: "relative", overflow: "hidden" }}>
      {/* WebGL Background */}
      <ShaderBackground />

      {/* Overlay for readability */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(5,5,20,0.45)", zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: "1rem", letterSpacing: "0.2em", fontWeight: 700, color: "#c084fc" }}>SHADER/UI</span>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
            <span style={{ cursor: "pointer", transition: "color .2s" }} onMouseEnter={e => e.target.style.color="#c084fc"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.5)"}>DOCS</span>
            <span style={{ cursor: "pointer" }} onMouseEnter={e => e.target.style.color="#c084fc"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.5)"}>GITHUB</span>
            <span style={{ cursor: "pointer" }} onMouseEnter={e => e.target.style.color="#c084fc"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.5)"}>NPM</span>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ textAlign: "center", padding: "7rem 2rem 5rem" }}>
          <div style={{ display: "inline-block", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "999px", padding: "0.4rem 1.2rem", marginBottom: "2.5rem" }}>
            WEBGL · REACT · SHADCN COMPATIBLE
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.05, margin: "0 auto 1.5rem", maxWidth: "800px", letterSpacing: "-0.02em" }}>
            Plasma waves.<br />
            <span style={{ background: "linear-gradient(135deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Behind everything.
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto 3rem", lineHeight: 1.7 }}>
            A single React component that renders a living, breathing WebGL shader as your page background. Zero deps, full TypeScript.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleCopy}
              style={{ background: "white", color: "#0a0a1a", padding: "0.85rem 2rem", borderRadius: "8px", border: "none", fontFamily: "inherit", fontSize: "0.8rem", letterSpacing: "0.1em", fontWeight: 700, cursor: "pointer", transition: "opacity .2s" }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              {copied ? "✓ COPIED!" : "COPY IMPORT"}
            </button>
            <button style={{ background: "transparent", color: "white", padding: "0.85rem 2rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", fontFamily: "inherit", fontSize: "0.8rem", letterSpacing: "0.1em", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.borderColor = "#c084fc"}
              onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            >
              VIEW SOURCE →
            </button>
          </div>
        </section>

        {/* Code snippet */}
        <section style={{ maxWidth: "650px", margin: "0 auto 6rem", padding: "0 2rem" }}>
          <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca41" }} />
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>page.tsx</span>
            </div>
            <pre style={{ margin: 0, padding: "1.5rem", fontSize: "0.8rem", lineHeight: 1.8, overflowX: "auto", color: "rgba(255,255,255,0.8)" }}>
{`import ShaderBackground from
  "@/components/ui/shader-background";

export default function Page() {
  return (
    <>
      `}<span style={{ color: "#c084fc" }}>{`<ShaderBackground />`}</span>{`
      <main>`}<span style={{ color: "#6ee7b7" }}>{`{/* your content */}`}</span>{`</main>
    </>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: "900px", margin: "0 auto 8rem", padding: "0 2rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", marginBottom: "3rem" }}>WHY USE IT</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {features.map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.75rem", transition: "border-color .3s, transform .3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(192,132,252,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Setup instructions */}
        <section style={{ maxWidth: "650px", margin: "0 auto 8rem", padding: "0 2rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", marginBottom: "2rem" }}>SETUP IN 3 STEPS</h2>
          {[
            { step: "01", cmd: "npx create-next-app@latest my-app --typescript --tailwind", label: "Scaffold with shadcn CLI" },
            { step: "02", cmd: "npx shadcn@latest init", label: "Init shadcn (creates /components/ui)" },
            { step: "03", cmd: "# paste shader-background.tsx into /components/ui/", label: "Drop in the component" },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.65rem", color: "#c084fc", letterSpacing: "0.15em", minWidth: "1.5rem", paddingTop: "0.75rem" }}>{s.step}</span>
              <div style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>{s.label}</div>
                <code style={{ fontSize: "0.72rem", color: "#86efac" }}>{s.cmd}</code>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)" }}>
          SHADER/UI — MIT LICENSE — BUILT WITH REACT + WEBGL
        </footer>
      </div>
    </div>
  );
}
