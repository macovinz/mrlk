// SmoothScroll.tsx (or wherever you initialize)
import Lenis from "lenis";

useEffect(() => {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => 1 - Math.pow(1 - t, 2),
    // note: no smoothTouch here
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return () => lenis.destroy();
}, []);
function useEffect(_arg0: () => () => void, _arg1: never[]) {
    throw new Error("Function not implemented.");
}

