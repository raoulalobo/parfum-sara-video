/**
 * IntroScene - Scène d'introduction avec le nom de marque
 *
 * Cette scène présente le logo/nom de la marque avec une animation élégante.
 * L'effet comprend:
 * - Fade in du nom de marque avec scale depuis 0.8
 * - Apparition progressive du tagline en dessous
 * - Ligne décorative qui s'étend horizontalement
 *
 * Timing:
 * - 0-2s: Nom de marque apparaît
 * - 1-3s: Tagline apparaît
 * - 2-4s: Ligne décorative s'anime
 * - 4-8s: Tout reste visible avant transition
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type IntroSceneProps = {
  brandName: string; // Nom de la marque à afficher
  tagline: string; // Slogan de la marque
};

export const IntroScene: React.FC<IntroSceneProps> = ({ brandName, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Animation du nom de marque ===
  // Spring animation pour un mouvement naturel avec léger rebond
  const brandSpring = spring({
    frame,
    fps,
    config: { damping: 200 }, // Smooth, pas de rebond
    durationInFrames: 2 * fps,
  });

  // Opacité et scale du nom de marque
  const brandOpacity = brandSpring;
  const brandScale = interpolate(brandSpring, [0, 1], [0.8, 1]);

  // === Animation du tagline ===
  // Délai de 1 seconde avant l'apparition du tagline
  const taglineSpring = spring({
    frame: frame - 1 * fps, // Démarre 1 seconde après le début
    fps,
    config: { damping: 200 },
    durationInFrames: 1.5 * fps,
  });

  const taglineOpacity = Math.max(0, taglineSpring);
  // Translation du tagline depuis le bas
  const taglineTranslateY = interpolate(
    Math.max(0, taglineSpring),
    [0, 1],
    [30, 0]
  );

  // === Animation de la ligne décorative ===
  // Démarre 2 secondes après le début
  const lineProgress = spring({
    frame: frame - 2 * fps,
    fps,
    config: { damping: 100, stiffness: 80 },
    durationInFrames: 2 * fps,
  });

  // La ligne s'étend du centre vers les bords
  const lineWidth = interpolate(Math.max(0, lineProgress), [0, 1], [0, 200]);
  const lineOpacity = Math.max(0, lineProgress);

  // === Styles ===
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "0 40px",
  };

  // Style du nom de marque - Typographie élégante et grande (100px pour éviter débordement sur 720px)
  const brandStyle: React.CSSProperties = {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontSize: 100,
    fontWeight: 300,
    letterSpacing: "0.3em",
    color: "#D4A574", // Or rosé
    textTransform: "uppercase",
    opacity: brandOpacity,
    transform: `scale(${brandScale})`,
    textShadow: "0 4px 20px rgba(212, 165, 116, 0.3)",
    marginBottom: 30,
  };

  // Style de la ligne décorative
  const lineStyle: React.CSSProperties = {
    width: lineWidth,
    height: 1,
    backgroundColor: "#D4A574",
    opacity: lineOpacity,
    marginBottom: 30,
    boxShadow: "0 0 10px rgba(212, 165, 116, 0.5)",
  };

  // Style du tagline - Plus petit et subtil
  const taglineStyle: React.CSSProperties = {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontSize: 32,
    fontWeight: 300,
    fontStyle: "italic",
    letterSpacing: "0.1em",
    color: "#F5E6D3", // Beige clair
    opacity: taglineOpacity,
    transform: `translateY(${taglineTranslateY}px)`,
    textAlign: "center",
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {/* Nom de la marque */}
      <div style={brandStyle}>{brandName}</div>

      {/* Ligne décorative */}
      <div style={lineStyle} />

      {/* Tagline */}
      <div style={taglineStyle}>{tagline}</div>
    </AbsoluteFill>
  );
};
