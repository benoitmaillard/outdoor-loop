export type SegmentDetail<T> = [number, number, T][];

export interface PathDetails {
  road_class?: SegmentDetail<string>;
  surface?: SegmentDetail<string>;
  max_speed?: SegmentDetail<number>;
}