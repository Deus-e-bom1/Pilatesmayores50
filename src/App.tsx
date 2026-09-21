import { Activity, ArrowLeft, BarChart3, BatteryCharging, BriefcaseBusiness, Check, CheckCircle2, Clock3, Dumbbell, Frown, Heart, Home, Leaf, LockKeyhole, Meh, Shield, ShieldCheck, Smile, Sparkles, Sun, UserRound, Weight, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import heroTransformation from "@/assets/new-hero-transformation.webp";
import authorityPhone from "@/assets/new-authority-phone.webp";
import bodyCurrent1 from "@/assets/new-body-current-1.webp";
import bodyCurrent2 from "@/assets/new-body-current-2.webp";
import bodyCurrent3 from "@/assets/new-body-current-3.webp";
import pilatesResult from "@/assets/new-pilates-result.webp";
import successTransformation from "@/assets/new-success-transformation.webp";
import { Button } from "@/components/ui/button";
import { funnelConfig } from "@/lib/funnel-config";
import { trackCustom, trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

type Question = { title: string; options: string[] };
const questions: Record<number, Question> = {
  1: { title: "¿Cómo te sientes con tu cuerpo actualmente?", options: ["Necesito bajar bastante de peso", "Quiero perder algunos kilos", "Estoy relativamente bien"] },
  2: { title: "¿Qué problema te molesta más hoy?", options: ["Los dolores", "El peso", "Ambos"] },
  3: { title: "¿Sientes que tu cuerpo ya no responde como antes?", options: ["Sí, mucho", "Un poco", "No realmente"] },
  4: { title: "¿Qué te gustaría recuperar primero?", options: ["Más energía", "Menos dolores", "Más confianza en mi cuerpo"] },
  6: { title: "¿Cuál es tu principal objetivo?", options: ["Bajar de peso", "Sentirme más ligera", "Reducir dolores"] },
  7: { title: "¿Te cuesta bajar de peso más que antes?", options: ["Sí", "Un poco", "No"] },
  8: { title: "¿Te da inseguridad hacer ejercicios?", options: ["Sí", "A veces", "No"] },
  9: { title: "¿La zona abdominal es una preocupación para ti?", options: ["Sí", "Un poco", "No"] },
  10: { title: "Después de los 40 años...", options: ["Todo se volvió más difícil", "Algunas cosas empeoraron", "No noté grandes cambios"] },
  13: { title: "¿Qué te gustaría mejorar además?", options: ["Mi apariencia", "Mi calidad de vida", "Mi salud"] },
  14: { title: "¿Qué es lo que más te frena?", options: ["Falta de tiempo", "Cansancio", "Miedo a lastimarme"] },
  15: { title: "¿Cómo es tu rutina?", options: ["Muy ocupada", "Moderada", "Flexible"] },
  16: { title: "¿Haces ejercicio actualmente?", options: ["Sí", "No"] },
  19: { title: "Si nada cambia... ¿qué es lo que más te preocupa?", options: ["Que los dolores empeoren", "Seguir aumentando de peso", "Ninguna ropa me va a quedar bien", "Perder calidad de vida"] },
  20: { title: "¿Estás dispuesta a dedicar pocos minutos al día durante una semana?", options: ["Sí, necesito cambiar", "Sí, quiero intentarlo"] },
};
const finalStep = 22;

export default function PilatesQuiz() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [confirming, setConfirming] = useState(false);
  const goForward = () => setStep((current) => Math.min(current + 1, finalStep));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (step !== 11 && step !== 17 && step !== 21) return;
    const timer = window.setTimeout(goForward, step === 11 ? 2500 : step === 17 ? 2600 : 3300);
    return () => window.clearTimeout(timer);
  }, [step]);

  const choose = (option: string) => {
    if (confirming) return;
    setSelected((current) => ({ ...current, [step]: option }));
    setConfirming(true);
    if ("vibrate" in navigator) navigator.vibrate(18);
    window.setTimeout(() => { setConfirming(false); goForward(); }, 300);
  };
  const progress = Math.max(4, (step / finalStep) * 100);

  return <main className="quiz-shell">
    {step > 0 && <header className="quiz-progress" aria-label={`Progreso: ${Math.round(progress)}%`}>
      <Button variant="ghost" size="icon" aria-label="Volver" onClick={goBack}><ArrowLeft /></Button>
      <div className="progress-status"><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><span>{Math.round(progress)}%</span></div>
    </header>}
    <section key={step} className={cn("quiz-stage animate-step-in", step === finalStep && "offer-stage")}>{renderStep()}</section>
  </main>;

  function renderStep() {
    if (step === 0) return <Cover onStart={goForward} />;
    const question = questions[step];
    if (question) return <QuestionScreen step={step} question={question} selected={selected[step]} confirming={confirming} onChoose={choose} />;
    if (step === 5) return <SocialProof onContinue={goForward} />;
    if (step === 11) return <Analyzing title="ANALIZANDO RESPUESTAS" values={[40, 60, 75]} />;
    if (step === 12) return <ProfileResult onContinue={goForward} />;
    if (step === 17) return <Authority />;
    if (step === 18) return <Validation onContinue={goForward} />;
    if (step === 21) return <FinalAnalysis />;
    return <Offer />;
  }
}

function Cover({ onStart }: { onStart: () => void }) {
  return <div className="cover-content">
    <h1 className="cover-title"><span>TERMINA CON LOS DOLORES</span> Y BAJA DE PESO DESPUÉS DE LOS 50 AÑOS</h1>
    <p className="yellow-marker">CON EJERCICIOS SEGUROS DE PILATES EN CASA</p>
    <img className="hero-photo" src={heroTransformation} alt="Mujer mayor de 50 años activa, saludable y sonriente" width={912} height={912} fetchPriority="high" />
    <p className="cover-call">Descubre en 2 minutos qué está dificultando tu bienestar y qué puedes hacer para recuperar movilidad, energía y confianza.</p>
    <div className="age-grid">{["40-50 años", "51-60 años", "61 años o más"].map((age) => <Button key={age} onClick={onStart} className="age-button"><span className="option-circle" />{age}</Button>)}</div>
    <div className="cover-footer"><span><LockKeyhole /> Diagnóstico gratuito</span><span><Clock3 /> Tiempo estimado: 2 minutos</span></div>
  </div>;
}

const questionIcons: Record<number, LucideIcon[]> = {
  3: [Frown, Meh, Smile], 4: [Zap, Sparkles, Heart], 6: [BriefcaseBusiness, Leaf, UserRound],
  7: [Frown, Meh, Smile], 8: [Frown, Meh, Smile], 10: [BarChart3, Activity, BatteryCharging],
  13: [Sparkles, Heart, Activity], 14: [Clock3, BriefcaseBusiness, Shield], 15: [BriefcaseBusiness, Home, Sun],
  16: [Dumbbell, Activity], 19: [Frown, Weight, UserRound, Heart], 20: [CheckCircle2, Smile],
};
const questionImages: Record<number, string[]> = {
  1: [bodyCurrent1, bodyCurrent2, bodyCurrent3],
  2: [bodyCurrent2, bodyCurrent3, bodyCurrent1],
  9: [bodyCurrent1, bodyCurrent2, bodyCurrent3],
};

function QuestionScreen({ step, question, selected, confirming, onChoose }: { step: number; question: Question; selected: string | undefined; confirming: boolean; onChoose: (option: string) => void }) {
  return <div className="question-wrap">
    <h1 className="question-title">{question.title}</h1>
    <div className="options-list">{question.options.map((option, index) => {
      const checked = selected === option;
      const Icon = questionIcons[step]?.[index];
      const image = questionImages[step]?.[index];
      return <Button key={option} variant="outline" disabled={confirming} onClick={() => onChoose(option)} className={cn("option-button", checked && "option-selected")}>
        {image ? <img className="option-thumb" src={image} alt="" /> : Icon ? <Icon className="option-icon" /> : <span className={cn("option-circle", checked && "checked")}>{checked && <Check />}</span>}
        <span className="option-copy">{option}</span>
      </Button>;
    })}</div>
    {confirming && <p className="answer-confirmation"><CheckCircle2 /> Respuesta registrada</p>}
  </div>;
}

function SocialProof({ onContinue }: { onContinue: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const started = performance.now(); let frame = 0;
    const update = (now: number) => { const ratio = Math.min((now - started) / 1000, 1); setCount(Math.round(20000 * ratio)); if (ratio < 1) frame = requestAnimationFrame(update); };
    frame = requestAnimationFrame(update); return () => cancelAnimationFrame(frame);
  }, []);
  return <div className="interim-wrap">
    <p className="result-kicker">BUENAS NOTICIAS</p>
    <h1 className="question-title">Más de 20.000 mujeres después de los 50 ya lograron mejorar su movilidad y recuperar su confianza.</h1>
    <figure className="story-card"><img src={successTransformation} alt="Mujer de 58 años satisfecha con su progreso" loading="lazy" width={912} height={912} /><figcaption>“Volví a sentirme capaz de hacer cosas simples sin dolor.”<strong>María, 58 años</strong></figcaption></figure>
    <p className="social-count"><strong>{count.toLocaleString("es-ES")}+</strong><span>mujeres ayudadas</span></p>
    <Button onClick={onContinue} className="continue-button uppercase">Continuar</Button>
  </div>;
}

function Analyzing({ title, values }: { title: string; values: number[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setIndex((current) => Math.min(current + 1, values.length - 1)), 750); return () => window.clearInterval(timer); }, [values.length]);
  const percent = values[index] ?? values[0] ?? 0;
  return <div className="analysis-wrap"><h1>{title === "ANALIZANDO RESPUESTAS" ? "Analizando tus respuestas..." : title}</h1><div className="analysis-ring" style={{ "--analysis-progress": `${percent * 3.6}deg` } as CSSProperties}><span>{percent}%</span></div><p>Identificando la causa raíz del problema...</p></div>;
}

function ProfileResult({ onContinue }: { onContinue: () => void }) {
  const signals = ["Mayor dificultad para bajar de peso", "Dolores que afectan tu rutina", "Menor movilidad", "Menos energía durante el día"];
  return <div className="profile-wrap">
    <p className="profile-alert">⚠️ PERFIL IDENTIFICADO</p>
    <h1>Según tus respuestas encontramos un patrón muy común en mujeres después de los 50 años.</h1>
    <p className="profile-intro">Detectamos señales de:</p>
    <div className="signal-list">{signals.map((signal, index) => <p key={signal} style={{ animationDelay: `${index * 180}ms` }}><CheckCircle2 />{signal}</p>)}</div>
    <div className="important-note"><strong>Lo importante</strong><p>Esto no significa que tengas que resignarte.</p><p>Muchas mujeres con un perfil similar al tuyo consiguen mejorar estos puntos cuando utilizan ejercicios adaptados a su edad y condición física.</p></div>
    <Button onClick={onContinue} className="continue-button uppercase">Quiero continuar</Button>
  </div>;
}

function Validation({ onContinue }: { onContinue: () => void }) {
  const factors = ["Rigidez corporal", "Dolores frecuentes", "Falta de movilidad", "Aumento de peso relacionado con la edad"];
  const outcomes = ["Sentirte más ligera", "Moverte con mayor facilidad", "Recuperar fuerza y estabilidad", "Tener más confianza en tu cuerpo"];
  return <div className="validation-wrap">
    <div className="soft-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <p className="success-alert">🎉 ¡FELICIDADES!</p>
    <img className="validation-photo" src={pilatesResult} alt="Mujer practicando Pilates en Casa" loading="lazy" width={1008} height={688} />
    <h1>Tus respuestas indican que podrías beneficiarte mucho de un protocolo de Pilates en Casa adaptado para mujeres de tu perfil.</h1>
    <h2>¿Por qué?</h2><p>Porque ayuda a trabajar exactamente los factores que más suelen afectar a mujeres después de los 50:</p>
    <div className="compact-checks">{factors.map((item) => <p key={item}><CheckCircle2 />{item}</p>)}</div>
    <h2>En poco tiempo podrías comenzar a:</h2><div className="compact-checks">{outcomes.map((item) => <p key={item}><CheckCircle2 />{item}</p>)}</div>
    <p className="access-question">¿QUIERES VER TU PROTOCOLO?</p><Button onClick={onContinue} className="continue-button uppercase">Sí, quiero verlo</Button>
  </div>;
}

function Authority() {
  const benefits = ["Más movilidad", "Menos rigidez", "Más fuerza", "Más confianza"];
  return <div className="authority-wrap">
    <p className="authority-kicker">SALUD</p>
    <h1>Pilates en casa es la modalidad más recomendada por los médicos después de los 50 años.</h1>
    <img src={authorityPhone} alt="Profesional de salud especializada en mujeres mayores de 50 años" loading="lazy" width={1000} height={620} />
    <div className="authority-benefits">{benefits.map((benefit) => <p key={benefit}><CheckCircle2 />{benefit}</p>)}</div>
    <div className="authority-progress"><span>Analizando tus respuestas</span><strong>56%</strong></div>
  </div>;
}

function FinalAnalysis() {
  const messages = ["Perfil validado", "Solución encontrada", "Protocolo preparado", "Acceso liberado"];
  return <div className="final-analysis"><h1>Preparando tu<br />protocolo personalizado...</h1><div className="analysis-track"><div className="analysis-fill" style={{ width: "100%" }} /></div><strong className="final-percent">100%</strong>
    <div className="loader-messages">{messages.map((message, index) => <p key={message} style={{ animationDelay: `${index * 700}ms` }}><CheckCircle2 />{message}</p>)}</div>
    <article className="testimonial"><div className="avatar">MA</div><div><strong>María Abreu, 59 años</strong><p>“Pensé que era tarde para mí. Después de pocas semanas me sentía más ligera y podía moverme con mucha más confianza.”</p></div></article>
  </div>;
}

function VturbPlayer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || funnelConfig.vsl.mode !== "script") return;

    mount.replaceChildren();
    const player = document.createElement("vturb-smartplayer");
    player.id = funnelConfig.vsl.containerId;
    player.style.display = "block";
    player.style.margin = "0 auto";
    player.style.width = "100%";
    player.style.maxWidth = "400px";

    const placeholder = document.createElement("div");
    placeholder.className = "vturb-player-placeholder";
    player.appendChild(placeholder);
    mount.appendChild(player);

    const scriptId = `vturb-${funnelConfig.vsl.containerId}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = funnelConfig.vsl.scriptUrl;
      script.async = true;
      script.onload = () => trackCustom("VSLLoaded");
      document.head.appendChild(script);
    }
  }, []);

  return <div ref={mountRef} className="vturb-player" aria-label="Video de presentación" />;
}

function Offer() {
  const handleCheckout = () => {
    trackEvent("InitiateCheckout");
    if (funnelConfig.checkoutUrl) window.location.assign(funnelConfig.checkoutUrl);
  };

  return <div className="offer-wrap">
    <h1>MIRA ESTE VIDEO RÁPIDO PARA DESCUBRIR EL MÉTODO QUE YA ESTÁ AYUDANDO A MILES DE MUJERES DESPUÉS DE LOS 50.</h1>
    <VturbPlayer />
    {funnelConfig.useOwnCta && <Button className="offer-button" onClick={handleCheckout}><Sparkles />Quiero mi protocolo y mi acceso</Button>}
    <div className="trust-row"><span><LockKeyhole />Compra segura</span><span><ShieldCheck />Garantía de satisfacción</span><span><Zap />Acceso inmediato</span></div>
  </div>;
}