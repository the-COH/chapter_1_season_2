import projects from "./projects.json";

export interface IProject {
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

export const Projects: { [projectId: string]: IProject } = projects;
