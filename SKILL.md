# 🎨 TasteSkill & CUBE3 Frontend Guidelines

Ce fichier contient les directives impératives de style et d'architecture pour la génération de code frontend par IA (Antigravity, Cursor, Copilot, etc.). 
**IL DOIT ÊTRE LU ET APPLIQUÉ AVANT LA CRÉATION DE TOUT COMPOSANT.**

## 1. Philosophie "Anti-Slop" (TasteSkill)
L'objectif est d'éviter les interfaces génériques, fades et basiques. Chaque interface générée doit paraître **premium, moderne et pensée par un designer senior**.

### 📐 Design System & Layout
- **Espaces généreux** : Utiliser des marges (margin) et des remplissages (padding) très larges pour laisser respirer l'interface (ex: `p-8` à `p-12` pour les conteneurs principaux).
- **Glassmorphism & Profondeur** : Préférer des fonds semi-transparents avec du flou (`backdrop-blur-md`, `bg-white/10`) aux aplats de couleurs unies.
- **Bordures subtiles** : Utiliser des bordures très fines et légèrement transparentes (`border border-white/20` ou `border-gray-200/50`) plutôt que des ombres dures.
- **Micro-interactions** : Tous les éléments interactifs (boutons, cartes, liens) doivent avoir un état `:hover` et `:active` (ex: `hover:scale-[1.02] active:scale-95 transition-all duration-300`).
- **Typographie** : Hiérarchie stricte. Les titres doivent être percutants (font-weight fort, tracking resserré `tracking-tight`), et les textes secondaires doivent avoir un contraste amoindri (`text-gray-500` ou `text-white/60`).
- **Couleurs** : Éviter les couleurs primaires pures (ex: `#FF0000`). Utiliser des palettes douces, des couleurs pastels, ou des dégradés subtils.

## 2. Animations (GSAP)
- **Framer Motion est remplacé par GSAP** dans ce projet Angular.
- **Apparition au scroll** : Utiliser GSAP (avec `ScrollTrigger` si nécessaire) pour animer les composants lors de leur apparition.
- **Fluidité** : Privilégier les easings personnalisés (`ease: "power3.out"`) pour un rendu beaucoup plus naturel et physique.
- Ne pas abuser des animations. Elles doivent guider l'œil de l'utilisateur, pas le distraire.

## 3. Architecture Angular 18
- **Standalone Components** : Tous les nouveaux composants doivent être `standalone: true`.
- **Signals** : Utiliser les `Signals` (`signal()`, `computed()`, `effect()`) au lieu de RxJS/BehaviorSubjects pour la gestion de l'état local dans la mesure du possible.
- **Control Flow** : Utiliser la nouvelle syntaxe de template (`@if`, `@for`) au lieu de `*ngIf` et `*ngFor`.
- **CSS** : Préférer l'encapsulation native d'Angular, ou Tailwind CSS si configuré, en gardant le CSS propre et factorisé.

---
*Note à l'IA : Lors de la conception d'une page, inspire-toi toujours de l'état de l'art du design (ex: 21st.dev, Linear, Vercel) plutôt que des vieux frameworks CSS de 2015.*
