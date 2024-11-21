/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'xml2js' {
    export function parseString(
      xml: string,
      callback: (err: any, result: any) => void
    ): void;
  }
  