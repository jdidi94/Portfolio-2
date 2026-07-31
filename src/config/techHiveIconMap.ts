import type { Technology } from "@shared-types/content";

import reactUrl from "@assets/icons/tech/React.svg?url";
import typeScriptUrl from "@assets/icons/tech/TypeScript.svg?url";
import javaScriptUrl from "@assets/icons/tech/JavaScript.svg?url";
import threeJsUrl from "@assets/icons/tech/Three.js.svg?url";
import nodeJsUrl from "@assets/icons/tech/Node.js.svg?url";
import expressUrl from "@assets/icons/tech/Express.svg?url";
import nextJsUrl from "@assets/icons/tech/Next.js.svg?url";
import mongoDbUrl from "@assets/icons/tech/MongoDB.svg?url";
import mySqlUrl from "@assets/icons/tech/MySQL.svg?url";
import postgreSqlUrl from "@assets/icons/tech/PostgresSQL.svg?url";
import dockerUrl from "@assets/icons/tech/Docker.svg?url";
import kubernetesUrl from "@assets/icons/tech/Kubernetes.svg?url";
import socketIoUrl from "@assets/icons/tech/Socket.io.svg?url";
import angularUrl from "@assets/icons/tech/Angular.svg?url";
import nestJsUrl from "@assets/icons/tech/Nest.js.svg?url";
import css3Url from "@assets/icons/tech/CSS3.svg?url";
import figmaUrl from "@assets/icons/tech/Figma.svg?url";
import gitUrl from "@assets/icons/tech/Git.svg?url";
import digitalOceanUrl from "@assets/icons/tech/Digital Ocean.svg?url";
import sequelizeUrl from "@assets/icons/tech/Sequelize.svg?url";

/**
 * Maps `Technology.id` -> SVG asset URL for tech card cover / overview face.
 * Missing ids fall back to CardFace title-only overview (no cover).
 */
export const TECH_HIVE_ICON_URLS: Partial<
  Record<Technology["id"], string>
> = {
  react: reactUrl,
  typescript: typeScriptUrl,
  javascript: javaScriptUrl,
  threejs: threeJsUrl,
  nextjs: nextJsUrl,
  angular: angularUrl,
  css3: css3Url,

  nodejs: nodeJsUrl,
  express: expressUrl,
  nestjs: nestJsUrl,
  socketio: socketIoUrl,

  mongodb: mongoDbUrl,
  mysql: mySqlUrl,
  postgresql: postgreSqlUrl,
  sequelize: sequelizeUrl,

  docker: dockerUrl,
  kubernetes: kubernetesUrl,
  git: gitUrl,
  digitalocean: digitalOceanUrl,

  figma: figmaUrl,
};

export function resolveTechHiveIconUrl(techId: string): string | null {
  return TECH_HIVE_ICON_URLS[techId as Technology["id"]] ?? null;
}
