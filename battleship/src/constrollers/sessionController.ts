import { Session } from "../ws_server/components/session";

export const playerExistInSession = (sessions: Set<Session>, index: string) =>{
    let result = false
    sessions.forEach(element => {
        if (Object.values(element).find(val => val === index)) {
            result = true
            return result
        }
    });
    return result
}
