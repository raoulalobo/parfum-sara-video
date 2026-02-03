/**
 * BackgroundGradient - Fond dégradé animé
 *
 * Ce composant crée un arrière-plan élégant avec un dégradé qui évolue
 * subtilement au cours de la vidéo. Les couleurs passent du rose doré
 * au beige crème, évoquant le luxe et la féminité.
 *
 * Animation: Rotation lente du dégradé pour un effet dynamique mais subtil
 * Couleurs: Rose doré (#D4A574), Beige (#F5E6D3), Blanc cassé (#FFF8F0)
 */
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const BackgroundGradient: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Animation de l'angle du dégradé: rotation complète sur la durée de la vidéo
  // L'interpolation fait passer l'angle de 135° à 225° (90° de rotation)
  // Effet subtil pour ne pas distraire du contenu principal
  const gradientAngle = interpolate(
    frame,
    [0, durationInFrames],
    [135, 225],
    { extrapolateRight: "clamp" }
  );

  // Style du dégradé radial avec couleurs chaudes et luxueuses
  // Palette inspirée des packagings de parfums haut de gamme
  const backgroundStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: `
      linear-gradient(
        ${gradientAngle}deg,
        #1a0a0a 0%,
        #2d1810 25%,
        #3d2015 50%,
        #2d1810 75%,
        #1a0a0a 100%
      )
    `,
  };

  // Superposition d'un effet de vignette pour ajouter de la profondeur
  // L'effet s'intensifie vers les bords pour concentrer l'attention au centre
  const vignetteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(
        ellipse at center,
        transparent 0%,
        transparent 40%,
        rgba(0, 0, 0, 0.3) 100%
      )
    `,
    pointerEvents: "none",
  };

  // Effet de particules dorées subtiles (shimmer)
  // Simulé avec un dégradé radial qui pulse légèrement
  const shimmerOpacity = interpolate(
    frame,
    [0, durationInFrames / 4, durationInFrames / 2, (3 * durationInFrames) / 4, durationInFrames],
    [0.05, 0.1, 0.05, 0.1, 0.05],
    { extrapolateRight: "clamp" }
  );

  const shimmerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(
        circle at 30% 30%,
        rgba(212, 165, 116, ${shimmerOpacity}) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 60%,
        rgba(245, 230, 211, ${shimmerOpacity}) 0%,
        transparent 40%
      )
    `,
    pointerEvents: "none",
  };

  return (
    <AbsoluteFill>
      <div style={backgroundStyle} />
      <div style={shimmerStyle} />
      <div style={vignetteStyle} />
    </AbsoluteFill>
  );
};
