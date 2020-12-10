import env from "project_source_rn/src/utils/environment";

/**
 * The function that creates the accessToken for the app after the user login.
 * @param {String} userId 
 */
export const authLogin = async (userId) => {
    return fetch(`${env.API_URL}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
        })
    }).then(response => response.json())
}