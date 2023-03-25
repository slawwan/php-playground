import { useEffect } from "react";

export function useMount(callback: () => void | Promise<void>): void {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
