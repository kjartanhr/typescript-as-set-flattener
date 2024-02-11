export function asnSorter(
    a: string,
    b: string
) {
    return Number(a.replace(/AS/g, '')) - Number(b.replace(/AS/g, ''));
}