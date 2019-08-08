const TIMESCALES = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
const TIMESCALE_DIV = [60, 60, 24, 7, 4, 12];

export const TIMESCALE = {
    SECOND: 'second',
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    PLURAL_SUFFIX: 's'
};

/**
 * Calculates the string representation of the time elapsed since the provided timestamp, with plural notation
 * 
 * @param till The unix timestamp (ms) to use as the baseline
 * @param breakAt? The TIMESCALE to break at (optional)
 */
export const stringTimeSinceTS = (till, from = Date.now(), breakAt = TIMESCALE.YEAR) => {
    // Time elapsed in seconds since UTC epoch
    const timeDiff = from - till;
    return toTimescale(timeDiff, breakAt, true, true);
}

export const toTimescale = (source, target, autoTarget = false, asString = false) => {
    // Convert to seconds by default
    let result = parseInt(source / 1000);

    // Maintain the current timescale index we're at
    let timescaleIdx = 0;

    // While there's a timescale remaining, keep moving forward
    while (timescaleIdx < (TIMESCALES.length - 1)) {
        // Do we need to break?
        if (TIMESCALES[timescaleIdx] === target) break;

        // Do we have enough "time" to move forward? (Pun intended)
        let dividendF = result / TIMESCALE_DIV[timescaleIdx];
        let dividend = parseInt(result / TIMESCALE_DIV[timescaleIdx]);
        // In case we're out of "time", break out
        if (autoTarget && dividend <= 0) break;

        // Pick the next timescale index
        timescaleIdx++;
        // Move the remaining time into the next timescale
        result = autoTarget ? dividend : dividendF;
    }

    // timeElapsed timescale(plural)
    return asString ? `${result} ${TIMESCALES[timescaleIdx]}${result !== 1 ? TIMESCALE.PLURAL_SUFFIX : ''}` : result;
}