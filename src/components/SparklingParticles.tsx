/**
 * SparklingParticles - Effet de particules scintillantes dorées
 *
 * Crée un effet visuel de luxe avec des particules dorées qui:
 * - Flottent doucement vers le haut
 * - Scintillent (variation d'opacité et de taille)
 * - Apparaissent à des positions aléatoires
 *
 * Utilisation: Superposer sur le BackgroundGradient pour un effet premium
 *
 * @example
 * // Dans ParfumSaraVideo.tsx
 * <BackgroundGradient />
 * <SparklingParticles particleCount={50} />
 *
 * Configuration:
 * - particleCount: Nombre de particules (défaut: 40)
 * - Les particules sont générées avec des positions/tailles/vitesses aléatoires
 * - Chaque particule a son propre cycle d'animation
 */
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo } from "react";

/**
 * Type représentant une particule individuelle
 *
 * @property id - Identifiant unique de la particule
 * @property x - Position horizontale initiale (0-100%)
 * @property y - Position verticale initiale (0-100%)
 * @property size - Taille de la particule en pixels (2-8px)
 * @property speed - Vitesse de montée (0.5-2, multiplicateur)
 * @property delay - Délai avant le début de l'animation (en frames)
 * @property twinkleSpeed - Vitesse de scintillement (fréquence)
 * @property twinklePhase - Phase initiale du scintillement (décalage)
 */
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  twinkleSpeed: number;
  twinklePhase: number;
};

type SparklingParticlesProps = {
  particleCount?: number; // Nombre de particules à générer (défaut: 40)
};

/**
 * Génère un nombre pseudo-aléatoire basé sur une seed
 * Permet d'avoir des positions "aléatoires" mais reproductibles entre les renders
 *
 * @param seed - Graine pour la génération
 * @returns Nombre entre 0 et 1
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

/**
 * Génère le tableau de particules avec leurs propriétés aléatoires
 * Utilise useMemo pour éviter de recalculer à chaque frame
 *
 * @param count - Nombre de particules à générer
 * @returns Tableau de particules avec propriétés randomisées
 */
const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      // Position X: répartie sur toute la largeur (0-100%)
      x: seededRandom(i * 1.1) * 100,
      // Position Y: commence en bas ou au milieu (40-120%, certaines hors écran)
      y: 40 + seededRandom(i * 2.2) * 80,
      // Taille: petites particules (2-6px) pour un effet subtil
      size: 2 + seededRandom(i * 3.3) * 4,
      // Vitesse de montée: variation pour un effet naturel
      speed: 0.5 + seededRandom(i * 4.4) * 1.5,
      // Délai d'apparition: échelonné sur 3 secondes (90 frames à 30fps)
      delay: seededRandom(i * 5.5) * 90,
      // Vitesse de scintillement: variation pour éviter la synchronisation
      twinkleSpeed: 0.5 + seededRandom(i * 6.6) * 1.5,
      // Phase de scintillement: décalage initial pour désynchroniser
      twinklePhase: seededRandom(i * 7.7) * Math.PI * 2,
    });
  }

  return particles;
};

/**
 * Composant individuel pour une particule
 * Gère l'animation de position et de scintillement
 */
const ParticleElement: React.FC<{
  particle: Particle;
  frame: number;
  fps: number;
  durationInFrames: number;
}> = ({ particle, frame, fps, durationInFrames }) => {
  // Frame ajustée avec le délai de la particule
  const adjustedFrame = Math.max(0, frame - particle.delay);

  // === Animation de montée ===
  // La particule monte progressivement sur toute la durée de la vidéo
  // Utilise un mouvement cyclique pour que les particules "recyclent" en bas
  const cycleLength = durationInFrames * 0.7; // Cycle de 70% de la durée totale
  const cycleFrame = (adjustedFrame * particle.speed) % cycleLength;

  // Position Y: de la position initiale vers le haut (-20% pour sortir de l'écran)
  const yOffset = interpolate(
    cycleFrame,
    [0, cycleLength],
    [0, -120], // Monte de 120% (traverse tout l'écran)
    { extrapolateRight: "clamp" }
  );

  const currentY = particle.y + yOffset;

  // Si la particule est sortie par le haut, on la "recycle" en bas
  const displayY = currentY < -10 ? currentY + 130 : currentY;

  // === Animation de mouvement horizontal subtil (ondulation) ===
  // Crée un léger mouvement de gauche à droite pour un effet organique
  const xWobble = Math.sin((adjustedFrame / fps) * particle.twinkleSpeed + particle.twinklePhase) * 3;

  // === Animation de scintillement (opacité) ===
  // Utilise une fonction sinus pour varier l'opacité entre 0.2 et 1
  const twinkleValue = Math.sin(
    (adjustedFrame / fps) * particle.twinkleSpeed * 3 + particle.twinklePhase
  );
  // Normalise de [-1, 1] à [0.2, 1] pour que les particules restent visibles
  const opacity = interpolate(twinkleValue, [-1, 1], [0.2, 1]);

  // === Animation de taille (pulse subtil) ===
  // La taille varie légèrement avec le scintillement
  const sizeMultiplier = interpolate(twinkleValue, [-1, 1], [0.8, 1.2]);
  const currentSize = particle.size * sizeMultiplier;

  // === Fade in initial ===
  // Les particules apparaissent progressivement au début
  const fadeIn = interpolate(adjustedFrame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Style de la particule
  const particleStyle: React.CSSProperties = {
    position: "absolute",
    left: `${particle.x + xWobble}%`,
    top: `${displayY}%`,
    width: currentSize,
    height: currentSize,
    borderRadius: "50%",
    // Dégradé radial pour un effet de lueur douce
    background: `radial-gradient(
      circle at 30% 30%,
      rgba(255, 223, 186, ${opacity * fadeIn}) 0%,
      rgba(212, 165, 116, ${opacity * fadeIn * 0.8}) 50%,
      rgba(212, 165, 116, 0) 100%
    )`,
    // Ombre pour l'effet de glow
    boxShadow: `
      0 0 ${currentSize * 2}px rgba(212, 165, 116, ${opacity * fadeIn * 0.5}),
      0 0 ${currentSize * 4}px rgba(212, 165, 116, ${opacity * fadeIn * 0.3})
    `,
    pointerEvents: "none",
  };

  return <div style={particleStyle} />;
};

/**
 * SparklingParticles - Composant principal
 *
 * Génère et anime un ensemble de particules scintillantes dorées
 * Pour un effet de luxe/premium sur la vidéo
 */
export const SparklingParticles: React.FC<SparklingParticlesProps> = ({
  particleCount = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Génère les particules une seule fois (mémoïsé)
  const particles = useMemo(() => generateParticles(particleCount), [particleCount]);

  // Style du container (couvre tout l'écran, n'intercepte pas les clics)
  const containerStyle: React.CSSProperties = {
    overflow: "hidden",
    pointerEvents: "none",
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          particle={particle}
          frame={frame}
          fps={fps}
          durationInFrames={durationInFrames}
        />
      ))}
    </AbsoluteFill>
  );
};
