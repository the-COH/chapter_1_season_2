# List Your Project

## 1. Fork this repository

## 2. Add your project

Modify `src/data/projects.json`, and add your project. Make sure it adhere to the following interface:

```typescript
interface Project {
    id: string
    name: string
    description: string
    category: string
    logo?: string|null
    website?: string|null
    socials?: {
        twitter?: string
        discord?: string
    }
    duneQueryEmbeds?: string[]
}
```

## 3. Add your logo

Add your logo as `.jpg` or `.png` to the `public/assets/projects/` folder. Preferably 256x256px.

## 4. Open a PR

Open a PR to this repository, and we will add it as soon as the PR has been validated.
