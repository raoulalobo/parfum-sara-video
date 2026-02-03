/**
 * Point d'entrée principal de l'application Remotion
 *
 * Ce fichier enregistre le composant Root qui contient toutes les compositions.
 * Remotion utilise ce fichier pour découvrir les vidéos disponibles.
 */
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Enregistrement du composant racine auprès de Remotion
// Cela permet à Remotion de découvrir toutes les compositions définies
registerRoot(RemotionRoot);
