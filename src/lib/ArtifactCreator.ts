import { v4 as uuidv4 } from 'uuid';

export interface Artifact {
  id: string;
  type: string;
  title: string;
  content: string;
  model: string;
  createdAt: string;
  updatedAt?: string;
  collapsed: boolean;
}

export class ArtifactCreator {
  private artifacts: Artifact[] = [];

  async getAllArtifacts(): Promise<Artifact[]> {
    return this.artifacts;
  }

  async createCustomArtifact(title: string, content: string): Promise<Artifact> {
    const newArtifact: Artifact = {
      id: uuidv4(),
      type: 'custom',
      title,
      content,
      model: 'user',
      createdAt: new Date().toISOString(),
      collapsed: false,
    };
    this.artifacts.push(newArtifact);
    return newArtifact;
  }

  async createArtifactFromAIResponse(content: string): Promise<Artifact> {
    const newArtifact: Artifact = {
      id: uuidv4(),
      type: 'ai_response',
      title: `AI Response ${this.artifacts.length + 1}`,
      content,
      model: 'ai',
      createdAt: new Date().toISOString(),
      collapsed: false,
    };
    this.artifacts.push(newArtifact);
    return newArtifact;
  }

  async updateArtifact(artifactId: string, title: string, newContent: string): Promise<Artifact | null> {
    const artifactIndex = this.artifacts.findIndex(a => a.id === artifactId);
    if (artifactIndex !== -1) {
      this.artifacts[artifactIndex] = {
        ...this.artifacts[artifactIndex],
        title,
        content: newContent,
        updatedAt: new Date().toISOString(),
      };
      return this.artifacts[artifactIndex];
    }
    return null;
  }

  async deleteArtifact(artifactId: string): Promise<boolean> {
    const initialLength = this.artifacts.length;
    this.artifacts = this.artifacts.filter(a => a.id !== artifactId);
    return this.artifacts.length < initialLength;
  }
}