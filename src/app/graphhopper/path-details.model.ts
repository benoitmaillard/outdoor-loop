export type SegmentDetail<T> = [number, number, T][];

export interface PathDetails {
  [index: string]: SegmentDetail<string>;
}