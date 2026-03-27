// --- 0. WebGL Shader Background (Ported from React) ---
const initShader = () => {
    const canvas = document.getElementById('shader-bg');
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

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

        const float overallSpeed = 0.08;
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
        const int linesPerGroup = 12;

        float random(float t) {
            return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
        }

        float drawCrispLine(float pos, float halfWidth, float t) {
            return smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - t));
        }

        float drawSmoothLine(float pos, float halfWidth, float t) {
            return smoothstep(halfWidth, 0.0, abs(pos - t));
        }

        float getPlasmaY(float x, float horizontalFade, float offset) {
            return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
        }

        void main() {
            vec2 fragCoord = gl_FragCoord.xy;
            vec2 uv = fragCoord.xy / iResolution.xy;
            vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

            float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
            float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

            space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
            space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

            vec4 lines = vec4(0.0);
            vec4 bgColor1 = vec4(0.01, 0.01, 0.05, 1.0); 
            vec4 bgColor2 = vec4(0.05, 0.01, 0.1, 1.0); 

            for(int l = 0; l < 12; l++) {
                float normalizedLineIndex = float(l) / 12.0;
                float offsetTime = iTime * offsetSpeed;
                float offsetPosition = float(l) + space.x * offsetFrequency;
                float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
                float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
                float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
                float linePosition = getPlasmaY(space.x, horizontalFade, offset);
                float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

                lines += line * lineColor * rand;
            }

            vec4 color = mix(bgColor1, bgColor2, uv.x);
            color *= verticalFade;
            color += lines;
            gl_FragColor = color;
        }
    `;

    const loadShader = (gl, type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    };

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, loadShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(shaderProgram, loadShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(shaderProgram);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const resolutionLoc = gl.getUniformLocation(shaderProgram, 'iResolution');
    const timeLoc = gl.getUniformLocation(shaderProgram, 'iTime');

    const render = (time) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(shaderProgram);
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, time * 0.001);
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
};

window.addEventListener('DOMContentLoaded', () => {
    initShader();
    // ... REST OF THE DOM CONTENT LOADED LOGIC ...
    // --- 1. Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // --- Animate Statistics ---
                if (entry.target.id === 'stats') {
                    const stats = entry.target.querySelectorAll('.stat-value');
                    stats.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        if (!isNaN(target)) {
                            let count = 0;
                            const interval = setInterval(() => {
                                count += Math.ceil(target / 20);
                                if (count >= target) {
                                    stat.innerText = target + '%';
                                    clearInterval(interval);
                                } else {
                                    stat.innerText = count + '%';
                                }
                            }, 50);
                        }
                    });
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 2. Smooth Scroll for Navbar ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- 3. The Quiz App Data ---
    const questions = [
        {
            id: 1,
            category: "Pensée Critique",
            emoji: "🧠",
            text: "Votre collègue partage un article viral qui affirme qu'une nouvelle étude prouve que « le café rend plus intelligent ». Que faites-vous ?",
            options: [
                { id: "A", text: "Vous le partagez immédiatement — c'est une bonne nouvelle !" },
                { id: "B", text: "Vous cherchez la source originale de l'étude avant de la relayer." },
                { id: "C", text: "Vous ignorez l'information, les études sont souvent fausses." },
            ],
            correct: "B",
            why: "La pensée critique consiste à vérifier les sources avant d'accepter ou de diffuser une information, même agréable.",
        },
        {
            id: 2,
            category: "Pensée Critique",
            emoji: "🔍",
            text: "Lors d'une réunion, votre manager dit : « Tout le monde est d'accord que notre produit est le meilleur du marché. » Vous pensez...",
            options: [
                { id: "A", text: "C'est forcément vrai, il est mieux placé que moi pour le savoir." },
                { id: "B", text: "C'est un biais de confirmation — il faudrait comparer avec des données concrètes." },
                { id: "C", text: "Il ment sûrement pour motiver l'équipe." },
            ],
            correct: "B",
            why: "Reconnaître un biais de confirmation (croire ce qu'on veut entendre) est une compétence clé de la pensée critique.",
        },
        {
            id: 3,
            category: "Pensée Critique",
            emoji: "⚖️",
            text: "Deux amis débattent d'un sujet d'actualité. L'un est très convaincant. Que faites-vous ?",
            options: [
                { id: "A", text: "Vous adoptez son avis." },
                { id: "B", text: "Vous consultez plusieurs sources variées." },
                { id: "C", text: "Vous évitez de vous forger une opinion." },
            ],
            correct: "B",
            why: "Consulter plusieurs perspectives est crucial.",
        },
        {
            id: 4,
            category: "Pensée Critique",
            emoji: "📊",
            text: "« 9 dentistes sur 10 recommandent ce dentifrice. » Quelle question posez-vous ?",
            options: [
                { id: "A", text: "Quel est le 10ème ?" },
                { id: "B", text: "Qui a financé l'étude ?" },
                { id: "C", text: "C'est impressionnant." },
            ],
            correct: "B",
            why: "L'origine du financement influence souvent les résultats.",
        },
        {
            id: 5,
            category: "Pensée Critique",
            emoji: "💡",
            text: "Un article correspond à vos croyances. Réaction ?",
            options: [
                { id: "A", text: "Vous cherchez des failles." },
                { id: "B", text: "Vous le gardez comme preuve." },
                { id: "C", text: "Vous le fermez." },
            ],
            correct: "A",
            why: "Défier ses propres convictions évite le biais de confirmation.",
        },
        {
            id: 6,
            category: "Audace",
            emoji: "🦁",
            text: "En réunion, vous avez une idée originale mais peur du jugement.",
            options: [
                { id: "A", text: "Vous la gardez." },
                { id: "B", text: "Vous demandez permission." },
                { id: "C", text: "Vous la partagez clairement." },
            ],
            correct: "C",
            why: "L'audace, c'est oser malgré la peur.",
        },
        {
            id: 7,
            category: "Audace",
            emoji: "🚀",
            text: "Un projet est lancé sans vous. Que faites-vous ?",
            options: [
                { id: "A", text: "Vous attendez." },
                { id: "B", text: "Vous vous portez volontaire." },
                { id: "C", text: "Vous critiquez." },
            ],
            correct: "B",
            why: "L'initiative est la clé de l'audace.",
        },
        {
            id: 8,
            category: "Audace",
            emoji: "🗣️",
            text: "Une procédure est inefficace. Personne ne dit rien.",
            options: [
                { id: "A", text: "Vous vous conformez." },
                { id: "B", text: "Vous signalez avec une solution." },
                { id: "C", text: "Vous créez une fronde." },
            ],
            correct: "B",
            why: "Signaler un problème avec une solution est constructif et audacieux.",
        },
        {
            id: 9,
            category: "Audace",
            emoji: "💬",
            text: "Feedback négatif mais injuste ? ",
            options: [
                { id: "A", text: "Vous acceptez tout." },
                { id: "B", text: "Vous exprimez calmement votre avis." },
                { id: "C", text: "Vous coupez la parole." },
            ],
            correct: "B",
            why: "S'affirmer avec respect est une audace saine.",
        },
        {
            id: 10,
            category: "Audace",
            emoji: "🌟",
            text: "Opportunité hors zone de confort. Réflexe ?",
            options: [
                { id: "A", text: "Refuser." },
                { id: "B", text: "Demander un délai." },
                { id: "C", text: "Accepter et apprendre." },
            ],
            correct: "C",
            why: "La croissance réside hors de la zone de confort.",
        }
    ];

    // --- 4. Quiz Engine logic ---
    const app = {
        currentIndex: 0,
        score: 0,
        container: document.getElementById('quiz-app'),

        startQuiz() {
            this.currentIndex = 0;
            this.score = 0;
            this.renderQuestion();
        },

        renderQuestion() {
            const q = questions[this.currentIndex];
            if (!q) {
                this.renderResults();
                return;
            }

            this.container.innerHTML = `
                <div class="quiz-header">
                    <span class="section-badge">${q.category}</span>
                    <p class="quiz-progress">Question ${this.currentIndex + 1} / ${questions.length}</p>
                </div>
                <h3 class="quiz-question">${q.text}</h3>
                <div class="options-list">
                    ${q.options.map(opt => `
                        <button class="quiz-option" onclick="app.handleAnswer('${opt.id}')">${opt.text}</button>
                    `).join('')}
                </div>
            `;
        },

        handleAnswer(selectedId) {
            const q = questions[this.currentIndex];
            const isCorrect = selectedId === q.correct;
            
            if (isCorrect) {
                this.score++;
                playCorrectSound();
            } else {
                playIncorrectSound();
            }

            // Show explanation
            this.container.innerHTML = `
                <div class="explanation-screen">
                    <h2 style="color: ${isCorrect ? 'var(--acc-emerald)' : '#ef4444'}">${isCorrect ? 'Bravo !' : 'Dommage...'}</h2>
                    <p class="why-text">${q.why}</p>
                    <button class="btn-primary" onclick="app.nextQuestion()">Continuer</button>
                </div>
            `;
        },

        nextQuestion() {
            this.currentIndex++;
            this.renderQuestion();
        },

        renderResults() {
            this.container.innerHTML = `
                <div class="results-screen">
                    <h2 class="title-main">${this.score} / ${questions.length}</h2>
                    <p>Votre potentiel est remarquable.</p>
                    <button class="btn-primary" onclick="app.startQuiz()">Recommencer</button>
                </div>
            `;
        }
    };

    // Attach to window so HTML onclick can reach it
    window.app = app;

    // --- 5. Audio Synthesis Logic (Ported from React version) ---
    const playTone = (type, freq, startTime, duration, vol, ctx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const playCorrectSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            playTone('sine', 523.25, now, 0.15, 0.4, ctx);
            playTone('sine', 659.25, now + 0.15, 0.15, 0.4, ctx);
            playTone('sine', 783.99, now + 0.3, 0.15, 0.4, ctx);
            playTone('sine', 1046.50, now + 0.45, 0.6, 0.4, ctx);
        } catch (e) {}
    };

    const playIncorrectSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            playTone('sawtooth', 392.00, now, 0.25, 0.1, ctx);
            playTone('sawtooth', 369.99, now + 0.25, 0.25, 0.1, ctx);
            playTone('sawtooth', 349.23, now + 0.5, 0.25, 0.1, ctx);
            playTone('sawtooth', 329.63, now + 0.75, 0.8, 0.1, ctx);
        } catch(e) {}
    };
});
