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
    'Only pending fees can be deleted': 'Solo pueden borrarse cuotas en estado PENDIENTE',
    'This fee has a payment. It cannot be deleted. Please inform your administrator': 'La cuota que intenta eliminar tiene un pago asociado, por favor, contacte con el administrador',

    // Events
    'Event not found': 'Evento no encontrado',
    'Event is cancelled': 'Evento cancelado',
    'Min players cannot be greater than max players': 'El número mínimo de jugadores no puede ser mayor al máximo',
    'Only the creator can edit this event': 'Solo el creador del evento puede editarlo',
    'Only the creator can delete this event': 'Solo el creador del evento puede borrarlo',
    'Already joined this event': 'Ya te has unido a este evento',
    'Event is full': 'Evento completo',
    'Not joined this event': 'No participas en el evento',
    'Creator cannot leave the event': 'El creador no puede abandonar el evento',

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