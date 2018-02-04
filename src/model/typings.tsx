
declare module 'jdenticon/dist/jdenticon.min.js' {
  export function toSvg(text: string, base: number): string
}

declare module 'glicko2' {
  export class Glicko2 {
    constructor(options: any)
    makePlayer(rating?: number, rd?: number, vol?: number): void
    getPlayers(): any[]
    updateRatings(scores: any[]): void
  }
}

declare module 'blueimp-md5' {
  function md5(text: string): string
  namespace md5 {}
  export = md5
}

declare module 'randomcolor' {
  function randomcolor(config: { luminosity: string, count: number, seed: number }): string[]
  namespace randomcolor {}
  export = randomcolor
}
