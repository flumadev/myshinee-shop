export const cpfMask = (valorInput: any) => {
    return valorInput
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
}

export const celularMask = (phoneNumber: any) => {
    return phoneNumber
        .replace(/\D/g, '')
        .replace(/(\d)/, '($1')
        .replace(/(\(\d{2})(\d)/, '$1) $2')
        .replace(/(\d{5})(\d{4,5})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}


export const cepMask = (valorInput: any) => {
    return valorInput
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
}