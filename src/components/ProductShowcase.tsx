/**
 * ProductShowcase - Scène de présentation du produit avec textes séquentiels
 *
 * Cette scène met en valeur le flacon de parfum avec l'image fournie,
 * accompagnée de 5 textes descriptifs qui s'affichent de manière séquentielle.
 *
 * Animations visuelles:
 * - Image: Apparition avec scale + glow pulsant + flottement subtil
 * - Textes: Apparition séquentielle (fade in + slide up), un seul visible à la fois
 *
 * Timing des textes (34 secondes total):
 * - Chaque texte affiché pendant 6.8 secondes
 * - Animation entrée: 0.5s (fade in + translateY)
 * - Visible: 5.8s
 * - Animation sortie: 0.5s (fade out)
 *
 * Image utilisée: public/parfum.jpeg (960x1280)
 *
 * @example
 * // Utilisation dans ParfumSaraVideo.tsx
 * <ProductShowcase
 *   showcaseTexts={[
 *     { title: "Extrait de parfum", subtitle: "Concentration 30%" },
 *     { title: "Pure qualité", subtitle: "Notes équilibrées" },
 *   ]}
 * />
 */
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Type pour un texte du showcase (titre + sous-titre)
 * @property title - Texte principal affiché en grand (ex: "Extrait de parfum")
 * @property subtitle - Texte secondaire explicatif (ex: "Concentration 30%")
 */
export type ShowcaseTextItem = {
  title: string;
  subtitle: string;
};

/**
 * Props du composant ProductShowcase
 * @property showcaseTexts - Tableau des 5 textes à afficher séquentiellement
 */
type ProductShowcaseProps = {
  showcaseTexts: ShowcaseTextItem[];
};

/**
 * Props du composant interne TextSlide
 * Gère l'animation d'un seul texte (titre + sous-titre)
 *
 * @property title - Texte principal à afficher
 * @property subtitle - Sous-texte à afficher
 * @property index - Position du texte dans la séquence (0-4)
 * @property frame - Frame actuelle de la vidéo
 * @property fps - Nombre de frames par seconde
 */
type TextSlideProps = {
  title: string;
  subtitle: string;
  index: number;
  frame: number;
  fps: number;
};

/**
 * TextSlide - Composant pour afficher un texte avec animation d'entrée/sortie
 *
 * Gère l'animation d'apparition et de disparition d'un texte:
 * - Entrée: fade in + slide up (0.5s)
 * - Visible: 5.8s
 * - Sortie: fade out (0.5s)
 *
 * @example
 * // Le texte à l'index 0 apparaît de frame 0 à 204 (6.8 secondes à 30fps)
 * // Le texte à l'index 1 apparaît de frame 204 à 408 (6.8 secondes suivantes)
 */
const TextSlide: React.FC<TextSlideProps> = ({
  title,
  subtitle,
  index,
  frame,
  fps,
}) => {
  // Durée de chaque texte: 6.8 secondes (34s total / 5 textes)
  const slideDuration = 6.8 * fps;
  // Durée des animations d'entrée/sortie: 0.5 seconde chacune
  const animationDuration = 0.5 * fps;

  // Frame de début et fin pour ce texte spécifique
  // Exemple: index 0 -> start=0, end=90 (à 30fps)
  const slideStart = index * slideDuration;
  const slideEnd = slideStart + slideDuration;

  // Vérifier si ce texte doit être visible à la frame actuelle
  const isActive = frame >= slideStart && frame < slideEnd;

  if (!isActive) {
    return null; // Ne pas rendre si le texte n'est pas dans sa période d'affichage
  }

  // Frame relative au début de ce slide (0 à slideDuration)
  const localFrame = frame - slideStart;

  // === Animation d'entrée (fade in + slide up) ===
  // Utilise spring pour un mouvement naturel et fluide
  const entranceProgress = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 100, // Amortissement pour éviter les oscillations
      mass: 0.5, // Masse légère pour une animation rapide
    },
    durationInFrames: animationDuration,
  });

  // === Animation de sortie (fade out) ===
  // Commence après (slideDuration - animationDuration) frames
  // Interpolation linéaire de 1 à 0 pour le fade out
  const exitOpacity = interpolate(
    localFrame,
    [slideDuration - animationDuration, slideDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Opacité finale = entrée * sortie
  // L'entrée monte de 0 à 1, la sortie descend de 1 à 0
  const opacity = entranceProgress * exitOpacity;

  // Translation Y: de +30px (bas) à 0 (position finale)
  const translateY = interpolate(entranceProgress, [0, 1], [30, 0]);

  // === Styles du conteneur de texte ===
  const containerStyle: React.CSSProperties = {
    opacity,
    transform: `translateY(${translateY}px)`,
    textAlign: "center",
    marginTop: 40,
  };

  // Style du titre principal (doré, majuscules, grande taille)
  const titleStyle: React.CSSProperties = {
    fontFamily: "'Georgia', serif",
    fontSize: 36,
    fontWeight: 400,
    letterSpacing: "0.15em",
    color: "#D4A574", // Doré élégant
    textTransform: "uppercase",
    marginBottom: 12,
    textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
  };

  // Style de la ligne décorative sous le titre
  const lineStyle: React.CSSProperties = {
    width: 80,
    height: 1,
    backgroundColor: "#D4A574",
    margin: "0 auto 15px auto",
    opacity: 0.6,
  };

  // Style du sous-texte (beige, italique, taille moyenne)
  const subtitleStyle: React.CSSProperties = {
    fontFamily: "'Georgia', serif",
    fontSize: 22,
    fontWeight: 300,
    fontStyle: "italic",
    letterSpacing: "0.05em",
    color: "#F5E6D3", // Beige clair
    maxWidth: 500,
    margin: "0 auto",
    lineHeight: 1.4,
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={lineStyle} />
      <div style={subtitleStyle}>{subtitle}</div>
    </div>
  );
};

/**
 * ProductShowcase - Composant principal de la scène
 *
 * Affiche l'image du parfum avec un effet de glow pulsant et flottement,
 * accompagnée de 5 textes qui s'affichent séquentiellement en dessous.
 *
 * Structure du layout:
 * ┌─────────────────────┐
 * │   IMAGE PARFUM      │  (280px de large, glow + flottement)
 * │   TEXTE PRINCIPAL   │  (Doré, 36px, uppercase)
 * │   ─────────────     │  (Ligne décorative)
 * │   sous-texte ici    │  (Beige, 22px, italic)
 * └─────────────────────┘
 */
export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  showcaseTexts,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // === Animation d'entrée de l'image ===
  // Spring pour l'apparition initiale avec un effet élégant
  const imageEntrance = spring({
    frame,
    fps,
    config: { damping: 100 },
    durationInFrames: 2 * fps,
  });

  // Scale de l'image: de 0.7 à 1 (zoom in progressif)
  const imageScale = interpolate(imageEntrance, [0, 1], [0.7, 1]);
  // Opacité de l'image: de 0 à 1 (fade in)
  const imageOpacity = imageEntrance;

  // === Animation de "flottement" subtil ===
  // L'image monte et descend légèrement pour un effet élégant et vivant
  // Cycle complet: haut -> bas -> haut sur toute la durée de la scène
  const floatOffset = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [0, -15, 0], // Amplitude réduite pour un effet subtil
    { extrapolateRight: "clamp" }
  );

  // === Animation de glow pulsant ===
  // L'aura dorée autour de l'image pulse doucement (cycle de 2 secondes)
  const glowIntensity = interpolate(
    frame,
    [0, fps * 2, fps * 4, fps * 6, fps * 8, fps * 10, fps * 12, fps * 14],
    [0.2, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5],
    { extrapolateRight: "clamp" }
  );

  // === Animation de rotation subtile ===
  // Légère rotation de -2° à +2° pour donner du dynamisme
  const rotation = interpolate(
    frame,
    [0, durationInFrames],
    [-2, 2],
    { extrapolateRight: "clamp" }
  );

  // === Styles ===

  // Container principal centré verticalement
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingTop: 40,
  };

  // Container de l'image avec transformations
  const imageContainerStyle: React.CSSProperties = {
    position: "relative",
    opacity: imageOpacity,
    transform: `scale(${imageScale}) translateY(${floatOffset}px) rotate(${rotation}deg)`,
  };

  // Effet de glow/aura autour de l'image (halo doré animé)
  const glowStyle: React.CSSProperties = {
    position: "absolute",
    top: "-60px",
    left: "-60px",
    right: "-60px",
    bottom: "-60px",
    background: `radial-gradient(
      ellipse at center,
      rgba(212, 165, 116, ${glowIntensity}) 0%,
      rgba(212, 165, 116, ${glowIntensity * 0.3}) 40%,
      transparent 70%
    )`,
    borderRadius: "50%",
    filter: "blur(25px)",
    zIndex: -1,
  };

  // Style de l'image du parfum (réduite pour laisser place aux textes)
  const imageStyle: React.CSSProperties = {
    width: 280, // Taille réduite (était 400px)
    height: "auto",
    objectFit: "contain",
    borderRadius: 16,
    boxShadow: `
      0 15px 50px rgba(0, 0, 0, 0.4),
      0 0 60px rgba(212, 165, 116, ${glowIntensity * 0.5})
    `,
  };

  // Container pour les textes séquentiels (sous l'image)
  const textContainerStyle: React.CSSProperties = {
    position: "relative",
    minHeight: 150, // Espace réservé pour les textes
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {/* Container de l'image avec effets visuels */}
      <div style={imageContainerStyle}>
        {/* Glow/Aura dorée pulsante */}
        <div style={glowStyle} />

        {/* Image réelle du parfum */}
        <Img
          src={staticFile("parfum.jpeg")}
          style={imageStyle}
        />
      </div>

      {/* Container des textes séquentiels */}
      <div style={textContainerStyle}>
        {/* Rendu de chaque texte avec son animation propre */}
        {/* Seul le texte actif sera visible grâce à la logique dans TextSlide */}
        {showcaseTexts.map((text, index) => (
          <TextSlide
            key={index}
            title={text.title}
            subtitle={text.subtitle}
            index={index}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
