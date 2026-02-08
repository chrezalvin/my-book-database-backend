export function getPagination(page: number, pageSize: number) {
    const limit = +pageSize;
    const from = page * limit;
    const to = from + pageSize;

    return { from, to };
}