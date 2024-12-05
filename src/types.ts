export type TaskList = {
    [key:string]:{
        content:{
            title:string,
            id:string,
        }[],
        totalElements:number
    }
}

export type Column = {
    id:string;
    name:string
}[]