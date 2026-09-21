import type { JSX } from "react";
import { socialLinks } from "@data/social";
import { SocialLinkIcons } from "@components/ui/SocialLinkIcons";
import { useContactFaceLinksParams } from "@store/contactFaceLinksStore";

/**
 * Clickable contact icons rendered on the 3D contact card face (via Html).
 * Placement comes from contactFaceLinksStore / CONTACT_FACE_LINKS_DEFAULTS.
 */
export function ContactCardFaceLinks(): JSX.Element {
  const { widthRem, iconGapPx } = useContactFaceLinksParams();

  return (
    <div
      role="group"
      aria-label="Contact links"
      className="flex flex-col items-center gap-2 rounded-[1.25rem] px-2 py-1"
      style={{ width: `${widthRem}rem` }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <SocialLinkIcons
        links={socialLinks}
        tone="cyan"
        size="sm"
        layout="row"
        className="justify-center"
        style={{ gap: `${iconGapPx}px` }}
      />
    </div>
  );
}
