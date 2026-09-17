import { useEffect } from "react";

const AWAY_TITLE = "🎾 ¡Te esperamos en la cancha!";

// Cuando el visitante se va a otra pestaña, el título lo saluda; al volver,
// se restaura el título real de la página.
function TabAwayTitle() {
  useEffect(() => {
    let titleBeforeLeaving = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        titleBeforeLeaving = document.title;
        document.title = AWAY_TITLE;
      } else if (document.title === AWAY_TITLE) {
        document.title = titleBeforeLeaving;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return null;
}

export default TabAwayTitle;
