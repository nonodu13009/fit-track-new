# Variables d'environnement à configurer dans Vercel

## Firebase Admin SDK

À partir du fichier `fit-tracker-728e9-firebase-adminsdk-fbsvc-0b944afc06.json`, extraire les valeurs suivantes :

### 1. FIREBASE_PRIVATE_KEY

**Valeur :**
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZ2TMlctzYe8u6
0gxFSmw07ystH9BwS4GJJZOKG/8gLNJ/glF3tgRArpYeEI0q9raejMeGzihNSZvk
Z6qkzw7hi+7Lm1phcow4Hk2mKwgMz/AUf9b3oTeSTj2EYmEfviSPUYReJbkdm3Cf
bcBk8e+GoiL5+Q3YjmTXOiKhe3o5rOJBKWrkSVQNU0Y3lyppjeTtsq9VS2aZY6+f
kHtWTVRB+2LEXm+X/FrJjquFRlRFEWp9/bnJzrqZdsiKxYOPOxfYs4+Mh5jXv4sp
hsRLUc7TvLHLxV0W84CRqF62AK+PEErGytiLSZu+wSnaQI80whQnzZsk+E+ZDiCF
1CRFIt/xAgMBAAECggEARrWRPF6EAGBuSD1Vbkgxxxy6TvM8nLZlXTatJO7haHgj
+u85sjmKN9RzNV758zARJnVbbg4MVsnFp+VeJhBvLBZXdA8AzxB3It/zJDRjcIUt
z/mOtOHHP93Vadrk24DELSCwbj6gT1PcwmLFR/6fWHvYDnsgW2IcqR9djjyd94nk
S+voCCS8bzQ0yUlyyoXEPawqrTkVoQm+zPPJPM3V+8AFvlaGTQAaoRaUw/dhrV4d
HkOCj4DV5cXNJc2k70jAUE6fIJBR4CYNYRMlEjAC9OIX5KLxqRcQ89lzXEV1hj6e
H9BVL6YshCD4sFNoXiandABvhZR8GJW+sKaGXS+e4QKBgQD+YZEELMvnnFLwc0ru
NvMLcW3o45RDlh6Mo/1jPS4FmX6B79yJbK63p+CfImtV2uWd4VaetD1IH/qe+kyr
vMk7k0izj2KTySQcDiOBLg1A8NJm84glsvA9KdxV37cfMbhD8albePymbf8aFQPD
hBVoiFnoW2KCJTHEBAKQL0xn0wKBgQDbPB1of02dfsLcxusjmWv6RkChja/JEJBU
rV3f9i9aGJP3eZIdMnJrX3madcWmEl6B2TQLjCPqWx0BeEXhMqcz3syWS1P5NZmi
btp5o5vpYv+0YRxPaUyaBPzz4EpQAdS/s+8TXBq/eBG4hy+Y7vozue3tcaLgQwa7
W+tL1UKiqwKBgDcm7isKj1by9KR/SrKlJULI3/yLQvz4Uj1J3MkkXZMHOX9wgs8k
yii1dCTscHsXz4rQbVhRWawGiu7m87KUZsjM4QlVQBkslfCjPB1o36TB0cxSZqVN
ny3pnVgckTu6rd/j7Ly3O6HApDxMXlU5Rl9anIV8YWR5AdC68c9XQ+27TAoGBALgk
wzLNktzR50zXzBOHv1llfs3zm44P2ps1T19ZgiZz9HzuYRsjD1Y+yH5Do/M9BKKe
VQfJ+zTSuQdOBawFBsobvs4SkYMGUXhNEjcPhFrBK7RPyR6ufIf13p3da63OC+vF
b+9b8p+Wc5QCAKm9OO0Po9hIFZ22zsW6jGWSyDinAoGBAPXf+n8N6Sq7+yUImQH5
Gu0GTXzdxc9FbPrCNF0cZqdgXBcB9VxjrfSOGqrS5Uj+SbawLDRNZZ3/Xrnmqo8Z
ZV1hDuog8nvBAODkavd4OmJobaUMGILsO90i5XfUZ20d9NuVTFCEQIb0UxH2Mafc
2EiHsC6nL32TGqIodpZ5s2ET
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANT :**
- Copier TOUTE la clé, y compris les lignes `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`
- Garder les `\n` dans la valeur (Vercel les gère automatiquement)
- Ne pas modifier ou formater la clé

### 2. FIREBASE_CLIENT_EMAIL

**Valeur :**
```
firebase-adminsdk-fbsvc@fit-tracker-728e9.iam.gserviceaccount.com
```

## Instructions Vercel

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner le projet `fit-track-new`
3. **Settings** > **Environment Variables**
4. Ajouter les 2 variables :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `FIREBASE_PRIVATE_KEY` | (clé complète ci-dessus) | Production, Preview, Development |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@fit-tracker-728e9.iam.gserviceaccount.com` | Production, Preview, Development |

5. **Save** et redéployer l'application

## Sécurité

⚠️ **NE JAMAIS :**
- Commiter ce fichier JSON dans Git
- Partager ces credentials
- Les exposer côté client

✅ **Le fichier est maintenant dans `.gitignore`**
