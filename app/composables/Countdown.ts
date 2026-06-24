import type { UseTimestampOptions } from "@vueuse/core";

const getMsUntil = (time: Date): number => {
    const now = new Date();
    return time.getTime() - now.getTime();
};

export const useCountdown = (
    time: MaybeRef<Date | null>,
    options?: UseTimestampOptions<false>,
) => {
    const timestamp = useTimestamp(options);

    const msUntil = computed(() => {
        const targetTime = toValue(time);
        if (!targetTime) {
            return 0;
        }

        return Math.max(
            0,
            getMsUntil(targetTime) - (timestamp.value - Date.now()),
        );
    });

    const milliseconds = computed(() => Math.max(0, msUntil.value % 1000));
    const seconds = computed(() =>
        Math.max(0, Math.floor(msUntil.value / 1000) % 60),
    );
    const minutes = computed(() =>
        Math.max(0, Math.floor(msUntil.value / (1000 * 60)) % 60),
    );
    const hours = computed(() =>
        Math.max(0, Math.floor(msUntil.value / (1000 * 60 * 60)) % 24),
    );
    const days = computed(() =>
        Math.max(0, Math.floor(msUntil.value / (1000 * 60 * 60 * 24))),
    );

    return {
        msUntil,
        milliseconds,
        seconds,
        minutes,
        hours,
        days,
    };
};
