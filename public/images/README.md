# Images et photos

Ce dossier contient les images et photos utilisées dans l'application.

## Structure recommandée

```
images/
├── progression/     # Images pour la progression (diagrammes, illustrations techniques)
├── avatars/         # Photos de profil utilisateur
├── badges/          # Images de badges et récompenses
├── icons/           # Icônes personnalisées
└── illustrations/   # Illustrations générales
```

## Formats supportés

- **Images statiques** : PNG, JPG, JPEG, WebP
- **Images vectorielles** : SVG (recommandé pour les icônes)
- **Images optimisées** : WebP (meilleure compression)

## Utilisation dans le code

Les images dans ce dossier sont accessibles via l'URL `/images/...`

Exemple :
```tsx
<img src="/images/progression/shrimp.jpg" alt="Shrimp technique" />
```

## Optimisation

Pour de meilleures performances :
- Utiliser Next.js Image component pour l'optimisation automatique
- Compresser les images avant de les ajouter
- Utiliser WebP pour de meilleures performances
- Taille recommandée : < 500 KB par image
