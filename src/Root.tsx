/**
 * Composant Root - Définition des compositions Remotion
 *
 * Ce fichier définit toutes les compositions (vidéos) disponibles dans le projet.
 * Chaque Composition représente une vidéo rendue avec ses dimensions, FPS et durée.
 *
 * Composition principale: ParfumSara
 * - Format: Portrait (720x1280) - idéal pour Instagram/TikTok/Stories
 * - Durée: ~50 secondes à 30 FPS
 * - Contenu: Présentation produit parfum avec animations élégantes
 *
 * @example
 * // La composition est utilisée par Remotion pour:
 * // - Prévisualiser dans le studio (npm run start)
 * // - Rendre la vidéo finale (npm run build)
 */
import { Composition } from "remotion";
import { ParfumSaraVideo } from "./ParfumSaraVideo";

// === Constantes de configuration vidéo ===
// Format portrait optimisé pour les réseaux sociaux (Stories, Reels, TikTok)
const VIDEO_WIDTH = 720;
const VIDEO_HEIGHT = 1280;
const VIDEO_FPS = 30;
// Durée totale de 50 secondes (converti en frames)
const VIDEO_DURATION_IN_FRAMES = 50 * VIDEO_FPS;

/**
 * RemotionRoot - Point d'entrée des compositions Remotion
 *
 * Enregistre toutes les compositions disponibles dans le projet.
 * Chaque Composition définit:
 * - id: Identifiant unique pour le rendu
 * - component: Composant React à rendre
 * - durationInFrames: Durée totale en frames
 * - fps: Nombre de frames par seconde
 * - width/height: Dimensions en pixels
 * - defaultProps: Props par défaut passées au composant
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Composition principale - Présentation Parfum Sara */}
      <Composition
        id="ParfumSara"
        component={ParfumSaraVideo}
        durationInFrames={VIDEO_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{
          // === Propriétés personnalisables pour la vidéo ===

          // Nom de la marque affiché dans l'intro et l'outro
          brandName: "CHOGAN",

          // Slogan/tagline affiché sous le nom de marque dans l'intro
          tagline: "L'essence de l'élégance",

          // === Textes du ProductShowcase (5 textes séquentiels) ===
          // Chaque texte s'affiche pendant 3 secondes avec animations
          // Structure: { title: "Texte principal", subtitle: "Sous-texte explicatif" }
          showcaseTexts: [
            {
              title: "Extrait de parfum",
              subtitle: "Concentration 30%",
            },
            {
              title: "Pure qualité Olfactive",
              subtitle: "Notes équilibrées pour une signature unique",
            },
            {
              title: "Tenue longue Durée",
              subtitle: "Composants choisis pour rester présents 24h",
            },
            {
              title: "Naturel et synthétique",
              subtitle: "Alchimie des meilleurs extraits",
            },
            {
              title: "Transparence totale",
              subtitle: "Tu sais exactement de quoi est fait ton parfum",
            },
          ],

          // Texte d'appel à l'action dans l'outro (court pour tenir sur une ligne)
          callToAction: "Découvrir",
        }}
      />
    </>
  );
};
