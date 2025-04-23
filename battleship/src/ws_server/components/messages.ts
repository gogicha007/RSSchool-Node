export const getMessage = (type: string, data: {}) => {
    return JSON.stringify({
        type: type,
        data: JSON.stringify(data),
        id: 0
    })
}