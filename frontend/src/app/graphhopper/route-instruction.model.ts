export interface RouteInstruction {
    distance: number;
    time: number;
    street_name: string;
    direction?: string;
    sign: number;
    interval: [number, number];
  }