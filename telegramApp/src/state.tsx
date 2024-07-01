import { makeAutoObservable } from "mobx";
import { UserPublic } from "./client";
import { Centrifuge } from "centrifuge";

class State {
  particlesCount = 0;
  profile: UserPublic | null = null;
  energy = 0;
  maxEnergy = 6000;
  energyPerSecond = 1;
  coinsPerSecond = 20;
  levels = [0];
  startedAt?: Date;
  startDelay = 0;

  get currentLevel() {
    for (let i = 0; i < this.levels.length; i++) {
      if (this.particlesCount < this.levels[i]) {
        return i + 1;
      }
    }
    return this.levels.length;
  }

  start() {
    this.startedAt = new Date();
    // alert((this?.startedAt?.getTime() || 0) - new Date().getTime());
  }

  stop() {
    this.startedAt = undefined;
  }

  get isStarted() {
    if (!this?.startedAt) {
      return false;
    }
    return (
      (this?.startedAt?.getTime() || 0) + this.startDelay < new Date().getTime()
    );
  }

  get loadingDelay() {
    return (
      this.startDelay -
      Math.trunc(new Date().getTime() - (this?.startedAt?.getTime() || 0))
    );
  }

  get nextLevel() {
    return this.currentLevel + 1;
  }

  centrifugo?: Centrifuge;

  constructor() {
    makeAutoObservable(this);
  }

  setProfile(profile: UserPublic) {
    this.profile = profile;
    this.particlesCount = profile.coins || 0;
    this.energy = profile.energy || 0;
    this.levels = profile.level_caps;
  }

  tap(): boolean {
    if (this.energy > 0) {
      this.particlesCount += 1;
      this?.centrifugo?.publish?.("game", {});
      this.energy = Math.max(0, this.energy - 1);
      if (this.profile) {
        this.profile.last_energy_change = new Date().getTime() / 1000;
        this.profile.energy = this.energy;
      }
      return true;
    }
    return false;
  }

  calculateEnergy() {
    const lastEnergy = this.energy;
    const calculatedEnergy =
      (new Date().getTime() -
        new Date((this.profile?.last_energy_change || 0) * 1000).getTime()) /
      (1000 / this.energyPerSecond);
    let _energy = Math.floor(Number(this.energy + calculatedEnergy));
    _energy = _energy <= this.maxEnergy ? _energy : this.maxEnergy;
    this.energy = _energy;
    if (lastEnergy !== this.energy) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.profile.energy = this.energy;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.profile.last_energy_change =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.profile.last_energy_change + calculatedEnergy;
    }
  }

  get nextLevelScore() {
    return this.levels[this.currentLevel - 1];
  }
}

export const state = new State();
