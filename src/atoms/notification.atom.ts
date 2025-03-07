import {atom} from "jotai";
import {Notification} from "@/models";

const baseNotificationsAtom = atom<Notification[]>([])

export const notificationsAtom = atom(
    get => get(baseNotificationsAtom),
    (get, set, notification: Notification) => {
        set(baseNotificationsAtom, [...get(baseNotificationsAtom), notification])
    }
)
