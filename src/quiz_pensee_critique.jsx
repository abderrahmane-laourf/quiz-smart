import { useState } from "react";

const questions = [
  {
    id: 1,
    category: "pensee",
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
    category: "pensee",
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
    category: "pensee",
    emoji: "⚖️",
    text: "Deux amis débattent d'un sujet d'actualité. L'un est très convaincant et passionné. Que faites-vous pour former votre propre opinion ?",
    options: [
      { id: "A", text: "Vous adoptez l'avis du plus éloquent — il doit avoir raison." },
      { id: "B", text: "Vous consultez plusieurs sources variées avant de vous positionner." },
      { id: "C", text: "Vous évitez de vous forger une opinion, c'est trop compliqué." },
    ],
    correct: "B",
    why: "La pensée critique implique de consulter plusieurs perspectives indépendantes plutôt que d'être influencé par le style oratoire.",
  },
  {
    id: 4,
    category: "pensee",
    emoji: "📊",
    text: "Une publicité annonce : « 9 dentistes sur 10 recommandent ce dentifrice. » Quelle question posez-vous en premier ?",
    options: [
      { id: "A", text: "Quel est le 10ème dentiste qui ne le recommande pas ?" },
      { id: "B", text: "Combien de dentistes ont participé à l'étude et qui l'a financée ?" },
      { id: "C", text: "Ce chiffre est impressionnant — je vais acheter ce produit." },
    ],
    correct: "B",
    why: "Interroger la méthodologie et la source du financement d'une étude est essentiel pour évaluer la crédibilité d'une statistique.",
  },
  {
    id: 5,
    category: "pensee",
    emoji: "💡",
    text: "Vous lisez un article qui correspond parfaitement à vos croyances existantes. Comment réagissez-vous ?",
    options: [
      { id: "A", text: "Vous le lisez attentivement en cherchant d'éventuelles failles dans le raisonnement." },
      { id: "B", text: "Vous le sauvegardez comme preuve que vous avez toujours eu raison." },
      { id: "C", text: "Vous le fermez — lire ce qu'on pense déjà ne sert à rien." },
    ],
    correct: "A",
    why: "Même les arguments qui nous plaisent méritent un regard critique. C'est ainsi qu'on évite le biais de confirmation.",
  },
  {
    id: 6,
    category: "audace",
    emoji: "🦁",
    text: "En réunion, vous avez une idée originale mais vous craignez d'être jugé(e). Que faites-vous ?",
    options: [
      { id: "A", text: "Vous gardez l'idée pour vous — ce n'est peut-être pas si bien." },
      { id: "B", text: "Vous la proposez en demandant d'abord la permission à votre voisin." },
      { id: "C", text: "Vous la partagez clairement, même si elle sort des sentiers battus." },
    ],
    correct: "C",
    why: "L'audace, c'est oser prendre la parole malgré la peur du jugement. Les idées originales sont souvent celles qui font avancer les choses.",
  },
  {
    id: 7,
    category: "audace",
    emoji: "🚀",
    text: "Un nouveau projet passionnant est lancé dans votre entreprise. On ne vous a pas sollicité(e). Que faites-vous ?",
    options: [
      { id: "A", text: "Vous attendez qu'on vous invite — ce n'est pas votre rôle." },
      { id: "B", text: "Vous vous portez volontaire et proposez votre contribution." },
      { id: "C", text: "Vous critiquez le projet pour montrer votre intérêt." },
    ],
    correct: "B",
    why: "Prendre l'initiative de s'impliquer sans y être invité(e) est une marque d'audace professionnelle et de leadership.",
  },
  {
    id: 8,
    category: "audace",
    emoji: "🗣️",
    text: "Vous remarquez qu'une procédure dans votre équipe est inefficace. Personne d'autre ne semble s'en plaindre. Vous...",
    options: [
      { id: "A", text: "Vous vous conformez — si personne ne dit rien, c'est que ça va." },
      { id: "B", text: "Vous signalez le problème à votre responsable avec une proposition de solution." },
      { id: "C", text: "Vous en parlez à vos collègues pour créer une fronde collective." },
    ],
    correct: "B",
    why: "L'audace consiste à signaler un problème de façon constructive, en proposant une solution plutôt qu'en se plaignant.",
  },
  {
    id: 9,
    category: "audace",
    emoji: "💬",
    text: "On vous donne un feedback négatif sur votre travail. Vous pensez que la critique est partiellement injuste. Que faites-vous ?",
    options: [
      { id: "A", text: "Vous acceptez tout sans rien dire pour éviter les conflits." },
      { id: "B", text: "Vous écoutez, remerciez, puis exprimez calmement votre point de vue." },
      { id: "C", text: "Vous défendez votre travail avec passion en coupant la parole." },
    ],
    correct: "B",
    why: "L'audace saine, c'est s'affirmer avec respect : écouter d'abord, puis exprimer son désaccord calmement et avec confiance.",
  },
  {
    id: 10,
    category: "audace",
    emoji: "🌟",
    text: "On vous propose une opportunité excitante mais qui sort de votre zone de confort. Votre premier réflexe ?",
    options: [
      { id: "A", text: "Refuser poliment — vous n'êtes pas prêt(e)." },
      { id: "B", text: "Demander un délai indéfini pour vous « préparer »." },
      { id: "C", text: "Accepter en vous disant que vous apprendrez en chemin." },
    ],
    correct: "C",
    why: "L'audace, c'est aussi accepter l'inconfort de la croissance. Les meilleures opportunités naissent rarement dans la zone de confort.",
  },
];

const categoryConfig = {
  pensee: { label: "Pensée Critique", color: "indigo", icon: "🧠" },
  audace: { label: "Audace", color: "amber", icon: "🦁" },
};

// --- Audio Synthesizer ---
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
    // Triumphant success jingle (Arpeggio effect)
    playTone('sine', 523.25, now, 0.15, 0.4, ctx);       // C5
    playTone('sine', 659.25, now + 0.15, 0.15, 0.4, ctx); // E5
    playTone('sine', 783.99, now + 0.3, 0.15, 0.4, ctx);  // G5
    playTone('sine', 1046.50, now + 0.45, 0.6, 0.4, ctx); // C6 (long ring)
  } catch (e) {}
};

const playIncorrectSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    // Womp womp womp error jingle (Descending chromatic)
    playTone('sawtooth', 392.00, now, 0.25, 0.1, ctx);      // G4
    playTone('sawtooth', 369.99, now + 0.25, 0.25, 0.1, ctx); // F#4
    playTone('sawtooth', 349.23, now + 0.5, 0.25, 0.1, ctx);  // F4
    playTone('sawtooth', 329.63, now + 0.75, 0.8, 0.1, ctx);  // E4 (long drop)
  } catch(e) {}
};

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("quiz"); // quiz | results
  const [revealed, setRevealed] = useState(false);

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  const handleSelect = (id) => {
    if (revealed) return;
    setSelected(id);
  };

  const handleValidate = () => {
    if (!selected) return;
    setRevealed(true);
    
    if (selected === q.correct) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  const handleNext = () => {
    setAnswers([...answers, { qid: q.id, selected, correct: q.correct }]);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setPhase("results");
    }
  };

  const score = answers.filter((a) => a.selected === a.correct).length;
  const penseeScore = answers.filter(
    (a) => questions.find((q) => q.id === a.qid).category === "pensee" && a.selected === a.correct
  ).length;
  const audaceScore = answers.filter(
    (a) => questions.find((q) => q.id === a.qid).category === "audace" && a.selected === a.correct
  ).length;

  const getMessage = () => {
    if (score === 10) return { text: "Parfait ! Vous êtes un(e) véritable leader audacieux(se) et analytique. 🏆", color: "text-emerald-700" };
    if (score >= 7) return { text: "Excellent ! Votre esprit critique et votre audace sont de vrais atouts. 💪", color: "text-fuchsia-700" };
    if (score >= 5) return { text: "Bien joué ! Il y a encore de belles compétences à développer. 📈", color: "text-amber-700" };
    return { text: "C'est un bon début ! Continuez à challenger votre pensée et à oser. 🌱", color: "text-rose-700" };
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setPhase("quiz");
    setRevealed(false);
  };

  if (phase === "results") {
    const msg = getMessage();
    return (
      <div className="w-full max-w-2xl animate-fade-in my-10" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        
        {/* Résultat Header */}
        <div className="text-center mb-10 drop-shadow-xl">
          <div className="text-7xl mb-6">🎯</div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Résultats du Quiz</h1>
          <p className={`text-xl font-bold ${msg.color}`}>{msg.text}</p>
        </div>

        {/* Cadré Résultats Global (Glassmorphism Light) */}
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 mb-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-fuchsia-100/50 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 p-32 bg-indigo-100/50 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <div className="text-8xl font-black text-gray-900 mb-2 tracking-tighter">
              {score}<span className="text-gray-400 text-5xl">/10</span>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mt-2 font-bold">Score Global</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-indigo-50/70 border border-indigo-100 backdrop-blur-md rounded-2xl p-5 shadow-sm">
                <div className="text-4xl font-bold text-indigo-700 mb-1">{penseeScore}<span className="text-indigo-400/50 text-2xl">/5</span></div>
                <div className="text-xs text-indigo-800 uppercase tracking-wider font-extrabold">🧠 Pensée</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 backdrop-blur-md rounded-2xl p-5 shadow-sm">
                <div className="text-4xl font-bold text-amber-600 mb-1">{audaceScore}<span className="text-amber-400/50 text-2xl">/5</span></div>
                <div className="text-xs text-amber-700 uppercase tracking-wider font-extrabold">🦁 Audace</div>
              </div>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="space-y-4 mb-10">
          <h2 className="text-gray-800 text-xl font-black mb-6 border-b border-gray-200/80 pb-4 tracking-wide uppercase">📋 Corrigé Détaillé</h2>
          {questions.map((q, i) => {
            const ans = answers[i];
            const isCorrect = ans?.selected === q.correct;
            const cat = categoryConfig[q.category];
            return (
              <div key={q.id} className={`rounded-2xl border backdrop-blur-md p-5 transition-all shadow-md ${isCorrect ? "bg-emerald-50/90 border-emerald-200/80" : "bg-rose-50/90 border-rose-200/80"}`}>
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex items-center justify-center w-8 h-8 rounded-full shadow-sm ${isCorrect ? "bg-emerald-200/60 text-emerald-700" : "bg-rose-200/60 text-rose-700"}`}>
                    <span className="text-sm font-bold">{isCorrect ? "✓" : "✗"}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/70 text-gray-700 font-extrabold uppercase tracking-wider border border-gray-200/50 shadow-sm">{cat.icon} {cat.label}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-black">Q{q.id}</span>
                    </div>
                    <p className="text-gray-900 text-base font-bold mb-3 leading-relaxed">{q.text}</p>
                    {!isCorrect && (
                      <div className="bg-rose-100/50 border border-rose-200/80 rounded-lg p-3 mb-2">
                         <p className="text-rose-900/90 text-[13px] leading-relaxed font-medium">
                          Votre réponse : <strong className="text-rose-950 font-black">{ans?.selected}</strong><br/>
                          Bonne réponse : <strong className="text-emerald-700 font-black">{q.correct}</strong>
                        </p>
                      </div>
                    )}
                    <p className="text-gray-700 text-sm bg-black/5 border border-black/5 rounded-lg p-3 font-medium">
                      <span className="text-yellow-600 font-black mr-2 text-xs uppercase tracking-widest">Pourquoi ?</span> 
                      {q.why}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-5 rounded-2xl bg-gray-900 text-white font-extrabold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95 duration-300"
        >
          🔄 Recommencer le Quiz
        </button>
      </div>
    );
  }

  const cat = categoryConfig[q.category];

  return (
    <div className="w-full max-w-xl animate-fade-in" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Titre */}
      <div className="text-center mb-10 drop-shadow-xl relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-fuchsia-500/20 blur-[80px] -z-10 rounded-full pointer-events-none"/>
        <h1 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
          La Pensée Critique<br />
          <span className="text-fuchsia-400 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">& l'Audace</span>
        </h1>
        <p className="text-white/60 text-xs mt-3 uppercase tracking-[0.2em] font-extrabold">Évaluez vos compétences</p>
      </div>

      {/* Progress & Header Card */}
      <div className="mb-6 bg-white/95 backdrop-blur-xl border border-gray-200 p-5 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3 font-extrabold uppercase tracking-wider">
          <span>Question {current + 1} / {questions.length}</span>
          <span className={`px-2 py-1 rounded-md border text-xs bg-gray-50 ${q.category === "pensee" ? "text-indigo-700 border-indigo-200" : "text-amber-700 border-amber-200"}`}>
            {cat.icon} {cat.label}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200/80 rounded-full overflow-hidden shadow-inner mb-6">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-in-out relative ${q.category === "pensee" ? "bg-gradient-to-r from-indigo-500 to-indigo-400" : "bg-gradient-to-r from-amber-500 to-amber-400"}`}
            style={{ width: `${progress + (1 / questions.length) * 100}%` }}
          >
             <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30" />
          </div>
        </div>

        {/* Question Text */}
        <div className="text-center relative z-10 py-2">
          <div className="text-5xl mb-6 animate-bounce-slow">{q.emoji}</div>
          <p className="text-gray-900 text-xl font-bold leading-relaxed">{q.text}</p>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-4 mb-8">
        {q.options.map((opt) => {
          let baseStyle = "w-full text-left border rounded-2xl px-6 py-5 transition-all duration-300 relative overflow-hidden backdrop-blur-sm group ";
          let stateStyle = "";
          
          if (revealed) {
            if (opt.id === q.correct) {
              stateStyle = "bg-emerald-50/90 border-emerald-300/80 text-emerald-900 shadow-[0_5px_20px_rgba(16,185,129,0.15)]";
            } else if (opt.id === selected && selected !== q.correct) {
              stateStyle = "bg-rose-50/90 border-rose-300/80 text-rose-900";
            } else {
              stateStyle = "bg-white/80 border-gray-200/80 text-gray-400";
            }
          } else if (selected === opt.id) {
            stateStyle = q.category === "pensee"
              ? "bg-indigo-50/90 border-indigo-300 text-indigo-900 shadow-[0_10px_30px_rgba(99,102,241,0.15)] scale-[1.02] transform"
              : "bg-amber-50/90 border-amber-300 text-amber-900 shadow-[0_10px_30px_rgba(245,158,11,0.15)] scale-[1.02] transform";
          } else {
            stateStyle = "bg-white/95 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md cursor-pointer";
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={revealed}
              className={`${baseStyle} ${stateStyle}`}
            >
              {/* Subtle hover gradient */}
              {!revealed && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />}
              
              <div className="relative z-10 flex items-center">
                <span className="font-extrabold text-lg mr-4 opacity-40 uppercase text-gray-500">{opt.id}</span>
                <span className="text-sm font-bold leading-relaxed">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {revealed && (
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] animate-fade-in-up">
          <p className="text-gray-800 text-sm leading-relaxed font-medium">
            <span className="text-yellow-700 tracking-wider font-extrabold text-xs uppercase mr-2 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
              💡 Explication
            </span>
            {q.why}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="relative">
        {!revealed ? (
          <button
            onClick={handleValidate}
            disabled={!selected}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 transform shadow-md ${
              selected
                ? "bg-gray-900 text-white hover:bg-black hover:shadow-xl hover:scale-[1.02] active:scale-95"
                : "bg-gray-200/80 border border-gray-300/50 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            Valider ma réponse
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-wider bg-gray-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-pulse-light flex justify-center items-center gap-2"
          >
            {current + 1 < questions.length ? <span>Question suivante <span className="text-lg leading-none">→</span></span> : "Voir mes résultats 🎯"}
          </button>
        )}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? "w-8 h-2 bg-gray-800 shadow-sm"
                : i < current
                ? "w-2 h-2 bg-gray-400"
                : "w-2 h-2 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

