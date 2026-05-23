export const config = {
    apiUrl: import.meta.env.VITE_API_URL as string,
    imagesUrl: import.meta.env.VITE_API_URL + '/uploads/' as string,
    env: import.meta.env.VITE_ENV,
    roleAdmin: import.meta.env.VITE_ROLE_ADMIN,
}