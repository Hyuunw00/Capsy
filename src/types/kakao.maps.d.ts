declare namespace kakao.maps {
  export class Map {
    constructor(container: HTMLElement, options: MapOptions)
  }

  export interface MapOptions {
    center: LatLng
    level?: number
  }

  export class LatLng {
    constructor(lat: number, lng: number)
    getLat(): number
    getLng(): number
  }
}