export function getScreenRanges(aspectRatio: number, width: number): ScreenRange {
    const screenHeight: number = width / aspectRatio

    const widthStart: number = 0 - width / 2
    const widthEnd: number = widthStart + width

    const heihgtStart: number = 0 - screenHeight / 2
    const heihgtEnd: number = heihgtStart + screenHeight

    return {
        height: { from: heihgtStart, to: heihgtEnd },
        width: { from: widthStart, to: widthEnd },
    }
}

export function mapRangetoRange(from: number, point: number, range: range, invert = false): number {
    let pointMagnitude: number = point / from
    if (invert) pointMagnitude = 1 - pointMagnitude
    const targetMagnitude = range.to - range.from
    const pointInRange = targetMagnitude * pointMagnitude + range.from

    return pointInRange
}
