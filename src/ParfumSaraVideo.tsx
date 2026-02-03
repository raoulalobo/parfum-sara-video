/**
 * ParfumSaraVideo - Composition principale de la vidéo parfum
 *
 * Cette vidéo présente le parfum Sara avec plusieurs scènes enchaînées :
 * 1. Intro avec logo/nom de marque (fade in élégant) - 8s
 * 2. Présentation du produit avec 5 textes séquentiels - 15s
 * 3. Call-to-action final avec effet de pulse - reste de la durée
 *
 * Durée totale: ~50 secondes
 * Transitions: fade pour un rendu professionnel
 * Audio: Musique de fond avec fade in/out
 *
 * @example
 * // Rendu dans Root.tsx
 * <ParfumSaraVideo
 *   brandName="SARA"
 *   tagline="L'essence de l'élégance"
 *   showcaseTexts={[...]}
 *   callToAction="Découvrir"
 * />
 */
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// Import des composants de scènes
import { IntroScene } from "./components/IntroScene";
import { ProductShowcase, ShowcaseTextItem } from "./components/ProductShowcase";
import { OutroScene } from "./components/OutroScene";
import { BackgroundGradient } from "./components/BackgroundGradient";

/**
 * Type des props de la composition
 *
 * @property brandName - Nom de la marque (ex: "SARA") - utilisé dans intro/outro
 * @property tagline - Slogan (ex: "L'essence de l'élégance") - utilisé dans intro
 * @property showcaseTexts - 5 textes avec sous-textes pour le ProductShowcase
 * @property callToAction - Texte d'appel à l'action pour l'outro (court, une ligne)
 */
export type ParfumSaraVideoProps = {
  brandName: string;
  tagline: string;
  showcaseTexts: ShowcaseTextItem[];
  callToAction: string;
};

export const ParfumSaraVideo: React.FC<ParfumSaraVideoProps> = ({
  brandName,
  tagline,
  showcaseTexts,
  callToAction,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // === Durées des scènes en frames ===
  // Calculées à partir des secondes pour faciliter la maintenance

  // Scene 1: Intro - 8 secondes d'apparition du logo avec effet élégant
  const introSceneDuration = 8 * fps;

  // Scene 2: Showcase produit - 34 secondes (5 textes × 6.8 secondes chacun)
  const showcaseDuration = 34 * fps;

  // Scene 3: Outro - 8 secondes pour le call-to-action final
  const outroDuration = 8 * fps;

  // Durée des transitions entre scènes (1 seconde)
  const transitionDuration = 1 * fps;

  // === Configuration audio ===
  // Durées pour le fade in/out de la musique
  const audioFadeInDuration = 2 * fps; // 2 secondes de fade in au début
  const audioFadeOutStart = durationInFrames - 3 * fps; // Fade out commence 3s avant la fin

  return (
    <AbsoluteFill>
      {/* === MUSIQUE DE FOND ===
          Audio avec fade in progressif au début et fade out à la fin
          - Fade in: 0 -> 0.7 sur 2 secondes
          - Volume stable: 0.7 pendant la majorité de la vidéo
          - Fade out: 0.7 -> 0 sur les 3 dernières secondes */}
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) => {
          // Fade in sur les 2 premières secondes
          if (f < audioFadeInDuration) {
            return interpolate(f, [0, audioFadeInDuration], [0, 0.7], {
              extrapolateRight: "clamp",
            });
          }
          // Fade out sur les 3 dernières secondes
          if (f >= audioFadeOutStart) {
            return interpolate(f, [audioFadeOutStart, durationInFrames], [0.7, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          }
          // Volume stable à 0.7 entre les deux
          return 0.7;
        }}
      />

      {/* Fond dégradé animé - visible pendant toute la vidéo */}
      <BackgroundGradient />

      {/* === Séquence de scènes avec transitions fluides ===
          TransitionSeries gère automatiquement le timing et les transitions */}
      <TransitionSeries>
        {/* Scene 1: Introduction avec nom de marque et tagline
            Durée: 8 secondes */}
        <TransitionSeries.Sequence durationInFrames={introSceneDuration}>
          <IntroScene brandName={brandName} tagline={tagline} />
        </TransitionSeries.Sequence>

        {/* Transition fade vers la scène produit */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 2: Présentation visuelle du produit avec 5 textes séquentiels
            Durée: 15 secondes (5 textes × 3 secondes) */}
        <TransitionSeries.Sequence durationInFrames={showcaseDuration}>
          <ProductShowcase showcaseTexts={showcaseTexts} />
        </TransitionSeries.Sequence>

        {/* Transition fade vers l'outro */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 3: Call-to-action final
            Durée: reste de la vidéo */}
        <TransitionSeries.Sequence durationInFrames={outroDuration}>
          <OutroScene
            brandName={brandName}
            callToAction={callToAction}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
