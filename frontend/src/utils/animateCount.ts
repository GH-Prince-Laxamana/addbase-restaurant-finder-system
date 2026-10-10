export interface CountScheduler { now: () => number; request: (callback: (time: number) => void) => number; cancel: (id: number) => void; }
export function animateCount(from: number, to: number, update: (value: number) => void, scheduler: CountScheduler, duration = 850) {
    const started = scheduler.now();
    let frame = 0;
    function tick(time: number) {
        const progress = Math.min(1, Math.max(0, (time - started) / duration));
        const eased = 1 - Math.pow(1 - progress, 3);
        update(progress === 1 ? to : from + (to - from) * eased);
        if (progress < 1) frame = scheduler.request(tick);
    }
    frame = scheduler.request(tick);
    return () => scheduler.cancel(frame);
}
