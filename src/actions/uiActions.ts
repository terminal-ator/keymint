export const TOGGLE_MASTER = `TOGGLE_MASTER`;
export const UPDATE_MASTER = `UPDATE_MASTER`;


interface ShowCreateMaster {
    type: typeof TOGGLE_MASTER;
    payload: boolean;
}

interface UpdateMaster {
    type: typeof UPDATE_MASTER;
    payload: number;
}

export type UiActions = ShowCreateMaster & UpdateMaster;

export const ToggleMaster = (show: boolean) => {
    return ({
        type: TOGGLE_MASTER,
        payload: show
    })
}

export const UpdateMaster = (cust_id: number) => {
    return (
        {
            type: UPDATE_MASTER,
            payload: cust_id
        }
    )
}
