export const queue = 'rpc_queue'
export const fibonacci = (n: number): number => {
    if (n == 0 || n == 1)
        return n
    else
        return fibonacci(n - 1) + fibonacci(n - 2)
}
