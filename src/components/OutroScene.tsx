/**
 * OutroScene - Scène finale avec call-to-action
 *
 * Cette scène conclut la vidéo avec:
 * - Le nom de la marque en grand format
 * - Un texte d'appel à l'action (CTA)
 * - Effet de pulse subtil pour attirer l'attention
 * - Animation de sortie en fade out
 *
 * Objectif: Laisser une impression mémorable et inciter à l'action
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type OutroSceneProps = {
  brandName: string; // Nom de la marque
  callToAction: string; // Texte d'appel à l'action
};

export const OutroScene: React.FC<OutroSceneProps> = ({
  brandName,
  callToAction,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // === Animation d'entrée du logo/brand ===
  const brandSpring = spring({
    frame,
    fps,
    config: { damping: 100 },
    durationInFrames: 2 * fps,
  });

  const brandOpacity = brandSpring;
  const brandScale = interpolate(brandSpring, [0, 1], [0.8, 1]);

  // === Animation du CTA ===
  const ctaSpring = spring({
    frame: frame - 1 * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: 1.5 * fps,
  });

  const ctaOpacity = Math.max(0, ctaSpring);
  const ctaTranslateY = interpolate(Math.max(0, ctaSpring), [0, 1], [30, 0]);

  // === Effet de pulse pour le CTA ===
  // Le bouton pulse légèrement pour attirer l'attention
  const pulsePhase = interpolate(
    frame,
    [0, fps, fps * 2, fps * 3, fps * 4],
    [1, 1.03, 1, 1.03, 1],
    { extrapolateRight: "extend" }
  );

  // === Glow animé autour du texte ===
  const glowIntensity = interpolate(
    frame,
    [0, fps * 2, fps * 4, fps * 6],
    [0.3, 0.6, 0.3, 0.6],
    { extrapolateRight: "extend" }
  );

  // === Animation de sortie (fade out sur les dernières 2 secondes) ===
  const fadeOutStart = durationInFrames - 2 * fps;
  const fadeOutProgress = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === Styles ===
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "0 40px",
    opacity: fadeOutProgress,
  };

  // Style du nom de marque - très grand et élégant
  // fontSize réduit de 140 à 100 pour éviter que les noms longs (ex: "CHOGAN" avec letterSpacing)
  // ne débordent du cadre vidéo de 720px de largeur
  const brandStyle: React.CSSProperties = {
    fontFamily: "'Georgia', serif",
    fontSize: 100,
    fontWeight: 300,
    letterSpacing: "0.25em",
    color: "#D4A574",
    textTransform: "uppercase",
    opacity: brandOpacity,
    transform: `scale(${brandScale})`,
    textShadow: `
      0 4px 30px rgba(212, 165, 116, ${glowIntensity}),
      0 0 80px rgba(212, 165, 116, ${glowIntensity * 0.3})
    `,
    marginBottom: 60,
    textAlign: "center",
  };

  // Ligne décorative sous le nom
  const lineStyle: React.CSSProperties = {
    width: 200,
    height: 1,
    backgroundColor: "#D4A574",
    marginBottom: 50,
    opacity: brandOpacity,
    boxShadow: "0 0 15px rgba(212, 165, 116, 0.5)",
  };

  // Container du CTA avec effet de pulse
  const ctaContainerStyle: React.CSSProperties = {
    opacity: ctaOpacity,
    transform: `translateY(${ctaTranslateY}px) scale(${pulsePhase})`,
  };

  // Style du bouton/CTA
  const ctaStyle: React.CSSProperties = {
    fontFamily: "'Georgia', serif",
    fontSize: 32,
    fontWeight: 400,
    letterSpacing: "0.2em",
    color: "#1a0a0a",
    textTransform: "uppercase",
    backgroundColor: "#D4A574",
    padding: "20px 50px",
    borderRadius: 50,
    boxShadow: `
      0 8px 30px rgba(0, 0, 0, 0.3),
      0 0 40px rgba(212, 165, 116, ${glowIntensity * 0.5})
    `,
  };

  // Texte supplémentaire sous le CTA
  const subtextStyle: React.CSSProperties = {
    fontFamily: "'Georgia', serif",
    fontSize: 18,
    fontWeight: 300,
    fontStyle: "italic",
    letterSpacing: "0.1em",
    color: "#F5E6D3",
    marginTop: 40,
    opacity: ctaOpacity * 0.7,
    textAlign: "center",
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {/* Nom de la marque */}
      <div style={brandStyle}>{brandName}</div>

      {/* Ligne décorative */}
      <div style={lineStyle} />

      {/* Call-to-action */}
      <div style={ctaContainerStyle}>
        <div style={ctaStyle}>{callToAction}</div>
      </div>

      {/* Texte additionnel */}
      <div style={subtextStyle}>
        L'élégance à portée de main
      </div>
    </AbsoluteFill>
  );
};
