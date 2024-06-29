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

  centrifugo?: Centrifuge;

  constructor() {
    makeAutoObservable(this);
  }

  setProfile(profile: UserPublic) {
    this.profile = profile;
    this.particlesCount = profile.coins || 0;
    this.energy = profile.energy || 0;
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
}

export const state = new State();
