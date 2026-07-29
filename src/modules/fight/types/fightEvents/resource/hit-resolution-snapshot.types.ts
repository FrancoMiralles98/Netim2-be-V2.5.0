export type HitResolutionSnapshot =
    | {
          result: 'missed';
      }
    | {
          result: 'dodged';
      }
    | {
          result: 'blocked';
      }
    | {
          result: 'hit';
          critical: boolean;
          penetrating: boolean;
          doble_trigged: boolean
      };