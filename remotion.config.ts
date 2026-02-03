/**
 * Configuration Remotion pour le projet Parfum Sara
 *
 * Ce fichier configure les paramètres de rendu et du studio Remotion.
 * Il définit notamment le codec vidéo et les options de qualité.
 */
import { Config } from "@remotion/cli/config";

// Configuration du codec vidéo pour l'export
// h264 est le codec le plus compatible pour les réseaux sociaux
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
