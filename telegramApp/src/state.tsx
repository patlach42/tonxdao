import { makeAutoObservable } from "mobx";
import { UserPublic } from "./client";

class State {
  particlesCount = 0;
  profile: UserPublic | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  addParticle() {
    this.particlesCount += 1;
  }

  setProfile(profile: UserPublic) {
    this.profile = profile;
    this.particlesCount = profile.coins || 0;
  }
}

export const state = new State();
