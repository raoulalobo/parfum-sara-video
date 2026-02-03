/**
 * FeaturesScene - Scène des caractéristiques du produit
 *
 * Cette scène affiche les caractéristiques/avantages du parfum
 * avec des animations séquentielles:
 * - Chaque feature apparaît avec un délai progressif
 * - Animation de fade + slide depuis la gauche
 * - Icône décorative à côté de chaque feature
 * - Effet de highlight sur le texte au moment de l'apparition
 *
 * Timing: Chaque feature apparaît avec 2 secondes d'intervalle
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type FeaturesSceneProps = {
  features: string[]; // Liste des caractéristiques à afficher
  brandName: string; // Nom de la marque pour le titre
};

export const FeaturesScene: React.FC<FeaturesSceneProps> = ({
  features,
  brandName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Animation du titre ===
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 1.5 * fps,
  });

  const titleOpacity = titleSpring;
  const titleTranslateY = interpolate(titleSpring, [0, 1], [-30, 0]);

  // === Animation de la ligne sous le titre ===
  const lineSpring = spring({
    frame: frame - 0.5 * fps,
    fps,
    config: { damping: 100 },
    durationInFrames: 1 * fps,
  });

  const lineWidth = interpolate(Math.max(0, lineSpring), [0, 1], [0, 120]);

  // === Styles ===
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "0 50px",
  };

  const titleContainerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: 80,
    opacity: titleOpacity,
    transform: `translateY(${titleTranslateY}px)`,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Georgia', serif",
    fontSize: 48,
    fontWeight: 300,
    letterSpacing: "0.15em",
    color: "#D4A574",
    textTransform: "uppercase",
    marginBottom: 20,
  };

  const lineStyle: React.CSSProperties = {
    width: lineWidth,
    height: 1,
    backgroundColor: "#D4A574",
    margin: "0 auto",
    boxShadow: "0 0 10px rgba(212, 165, 116, 0.5)",
  };

  const featuresListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 40,
    width: "100%",
    maxWidth: 600,
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {/* Titre de la section */}
      <div style={titleContainerStyle}>
        <div style={titleStyle}>Pourquoi {brandName}?</div>
        <div style={lineStyle} />
      </div>

      {/* Liste des caractéristiques */}
      <div style={featuresListStyle}>
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            text={feature}
            index={index}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/**
 * FeatureItem - Composant individuel pour chaque caractéristique
 *
 * Chaque item a sa propre animation avec un délai basé sur son index.
 * L'animation comprend: fade in, slide depuis la gauche, et un effet de glow.
 */
type FeatureItemProps = {
  text: string;
  index: number;
  frame: number;
  fps: number;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ text, index, frame, fps }) => {
  // Délai progressif: chaque item apparaît 2s après le précédent
  // Premier item après 1.5s, deuxième après 3.5s, etc.
  const delay = (1.5 + index * 2) * fps;

  // Spring animation pour l'apparition
  const itemSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 }, // Léger rebond
    durationInFrames: 1.5 * fps,
  });

  const progress = Math.max(0, itemSpring);

  // Opacité et translation
  const opacity = progress;
  const translateX = interpolate(progress, [0, 1], [-50, 0]);

  // Effet de glow qui s'estompe après l'apparition
  const glowOpacity = interpolate(
    frame - delay,
    [0, 0.5 * fps, 1.5 * fps],
    [0, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === Styles de l'item ===
  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 25,
    opacity,
    transform: `translateX(${translateX}px)`,
  };

  // Icône décorative (losange doré)
  const iconStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    backgroundColor: "#D4A574",
    transform: "rotate(45deg)",
    flexShrink: 0,
    boxShadow: `0 0 ${20 * glowOpacity}px rgba(212, 165, 116, ${glowOpacity})`,
  };

  // Texte de la caractéristique
  const textStyle: React.CSSProperties = {
    fontFamily: "'Georgia', serif",
    fontSize: 28,
    fontWeight: 300,
    letterSpacing: "0.05em",
    color: "#F5E6D3",
    lineHeight: 1.5,
    textShadow: `0 0 ${30 * glowOpacity}px rgba(212, 165, 116, ${glowOpacity * 0.5})`,
  };

  return (
    <div style={itemStyle}>
      <div style={iconStyle} />
      <span style={textStyle}>{text}</span>
    </div>
  );
};
