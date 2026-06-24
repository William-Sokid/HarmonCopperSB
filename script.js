/* ============================================================
   1) DECLARE TES SONS ICI
   ------------------------------------------------------------
   Chaque catégorie est un objet avec :
     - nom  : ce qui s'affiche comme titre de section
     - sons : une liste de { nom, fichier }
       -> "nom"    = texte affiché sur le bouton
       -> "fichier"= chemin vers le mp3, RELATIF au dossier sounds/

   Pour ajouter un son : copie une ligne et change "nom" et "fichier".
   Le fichier mp3 doit exister dans le bon sous-dossier de sounds/.
   ============================================================ */

const SOUNDS = [
  {
    nom: "Ambiances",
    sons: [
      { nom: "Bad ass crew",      fichier: "ambiances/badass.mp3" },
      { nom: "Town",    fichier: "ambiances/ville1.mp3" },
      { nom: "Horror",      fichier: "ambiances/horror.mp3" },
      { nom: "Nostalgique",     fichier: "ambiances/Nostalgique.mp3" }
    ]
  },
  {
    nom: "Combat",
    sons: [
      { nom: "Accord mineure",       fichier: "combat/Am.mp3" },
      { nom: "Accord majeure",    fichier: "combat/AMa.mp3" },
      { nom: "Mélodie du courage",  fichier: "combat/MDC.mp3" },
      { nom: "Fail",   fichier: "combat/fail.mp3" },
      { nom: "Victory",   fichier: "combat/Victory.mp3" }
    ]
  },
  {
    nom: "Musiques",
    sons: [
      { nom: "Epic",  fichier: "musiques/Epicshit.mp3" },
      { nom: "Mélancolique",    fichier: "musiques/Itiswhatisit.mp3" },
      { nom: "Mystère",         fichier: "musiques/mystery.mp3" },
      { nom: "Road to death",         fichier: "musiques/Roadtodeath.mp3" },
      { nom: "Starway to sadness",         fichier: "musiques/Starwaytosadness.mp3" },
      { nom: "Serious business",         fichier: "musiques/Seriousbusiness.mp3" }

    ]
  },
  {
    nom: "SFX",
    sons: [
      { nom: "Gun", fichier: "sfx/Gun.mp3" },
      { nom: "Pièces d'or",      fichier: "sfx/pieces.mp3" },
      { nom: "Coup de tonnerre", fichier: "sfx/tonnerre.mp3" }
    ]
  }
];

/* ============================================================
   2) PARTIE TECHNIQUE - tu n'as normalement pas besoin de toucher
      à ce qui suit. Elle construit les boutons automatiquement
      à partir de la liste SOUNDS ci-dessus et gère le clic.
   ============================================================ */

const DOSSIER_SONS = "sounds/";

// On garde en mémoire, pour chaque bouton, son objet <audio> et son état
const lecteurs = new Map(); // bouton -> { audio, jouant }

function construireInterface() {
  const conteneur = document.getElementById("categories");

  SOUNDS.forEach(categorie => {
    const section = document.createElement("section");
    section.className = "categorie";

    const titre = document.createElement("h2");
    titre.textContent = categorie.nom;
    section.appendChild(titre);

    const grille = document.createElement("div");
    grille.className = "grille-boutons";

    categorie.sons.forEach(son => {
      const bouton = document.createElement("button");
      bouton.className = "bouton-son";
      bouton.textContent = son.nom;

      const audio = new Audio(DOSSIER_SONS + son.fichier);
      audio.preload = "none";

      lecteurs.set(bouton, { audio, jouant: false });

      bouton.addEventListener("click", () => basculerSon(bouton));

      // Quand le son se termine seul (pas en boucle), on remet le bouton à l'état normal
      audio.addEventListener("ended", () => {
        bouton.classList.remove("actif");
        lecteurs.get(bouton).jouant = false;
      });

      audio.addEventListener("error", () => {
        bouton.textContent = son.nom + " ⚠️";
        bouton.title = "Fichier introuvable : " + DOSSIER_SONS + son.fichier;
      });

      grille.appendChild(bouton);
    });

    section.appendChild(grille);
    conteneur.appendChild(section);
  });
}

function basculerSon(bouton) {
  const etat = lecteurs.get(bouton);

  if (etat.jouant) {
    // Le son est en cours -> on l'arrête (clic = stop)
    etat.audio.pause();
    etat.audio.currentTime = 0;
    bouton.classList.remove("actif");
    etat.jouant = false;
  } else {
    // Le son n'est pas en cours -> on le lance (clic = play)
    etat.audio.currentTime = 0;
    etat.audio.play().catch(err => {
      console.error("Impossible de jouer le son :", err);
    });
    bouton.classList.add("actif");
    etat.jouant = true;
  }
}

function arreterTout() {
  lecteurs.forEach((etat, bouton) => {
    etat.audio.pause();
    etat.audio.currentTime = 0;
    etat.jouant = false;
    bouton.classList.remove("actif");
  });
}

document.getElementById("stop-all").addEventListener("click", arreterTout);

construireInterface();
