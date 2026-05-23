const ERROR_MAP: Record<string, string> = {
    // Auth
    'Wrong credentials': 'Credenciales incorrectas',

    // Users
    'User not found': 'Usuario no encontrado',
    'A user already exists with this email': 'Ya hay un usuario dado de alta con este correo',

    // Roles
    'Some roles do not exist': 'Algunos roles no existen',

    // Games
    'Game not found': 'Juego no encontrado',

    // Loans
    'Loan not found': 'Pŕestamo no encontrado',
    'This game is already on loan for the requested dates': 'Este juego ya está en préstamo en las fechas solicitadas',
    'End date must be after start date': 'La fecha de finalización debe ser posterior a la de comienzo',

    // Fees
    'Membership fee not found': 'Cuota no encontrada',
    'Some fees not found': 'Alguno cuota no se ha encontrado',
    'Payment not found': 'Pago no encontrado',
    'Some fees are not in a payable state': 'Algunas cuotas se encuentran en un estado que no permite pagarlas',

    // Common
    'Internal server error': 'Error interno del servidor',
    'Bad Request': 'Petición incorrecta',
    'Unauthorized': 'No autorizado',
    'Forbidden': 'Acceso denegado',
    'Not Found': 'No encontrado',
}

export function translateError(message: string | string[] | undefined): string {
    if (!message) return 'Ha ocurrido un error inesperado'
    if (Array.isArray(message)) return message.map((m) => ERROR_MAP[m] ?? m).join(', ')
    return ERROR_MAP[message] ?? message
}