import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CubeApiError,
  getDevices,
  setDevicePower,
  type CubeErrorKind,
} from '@/services/cube/cubeApi';
import type { CubeDevice } from '@/services/cube/cube.types';

export type CubeStatus = 'connecting' | 'connected' | 'unreachable';

/** A hub failure, for the screen to word: the kind, and the hub's own code when it sent one. */
export interface CubeFailure {
  kind: CubeErrorKind | 'unknown';
  code?: number;
}

export function cubeFailureOf(error: unknown): CubeFailure {
  return error instanceof CubeApiError
    ? { kind: error.kind, code: error.code }
    : { kind: 'unknown' };
}

/** The devices on the unit's eWeLink CUBE hub, with power switching. */
export function useCubeDevices() {
  const [devices, setDevices] = useState<CubeDevice[]>([]);
  const [status, setStatus] = useState<CubeStatus>('connecting');
  const [error, setError] = useState<CubeFailure | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /** Re-reads the hub's devices; resolves to the list, or null if the hub is unreachable. */
  const refresh = useCallback(
    () =>
      getDevices().then(
        (list) => {
          if (mounted.current) {
            setDevices(list);
            setStatus('connected');
            setError(null);
          }
          return list;
        },
        (caught: unknown) => {
          if (mounted.current) {
            setStatus('unreachable');
            setError(cubeFailureOf(caught));
          }
          return null;
        },
      ),
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** Flips the switch at once, and puts it back if the hub refuses. */
  const setPower = useCallback(async (serialNumber: string, on: boolean) => {
    const apply = (value: 'on' | 'off') =>
      setDevices((current) =>
        current.map((device) =>
          device.serial_number === serialNumber
            ? { ...device, state: { ...device.state, power: { powerState: value } } }
            : device,
        ),
      );

    apply(on ? 'on' : 'off');
    try {
      await setDevicePower(serialNumber, on);
    } catch (caught) {
      if (mounted.current) {
        apply(on ? 'off' : 'on');
        setError(cubeFailureOf(caught));
      }
    }
  }, []);

  return { devices, status, error, refresh, setPower };
}
