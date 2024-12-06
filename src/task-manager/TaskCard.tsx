import { UniqueIdentifier } from "@dnd-kit/core";

export const TaskCard=(props:{id:string | UniqueIdentifier,name:string}) =>{
    const { id,name } = props;
  
    const style = {
      width: "100%",
      height:150,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid black",
      margin: "10px 0",
      background: "white",
      color:'black'
    };
  
    return (<div style={style}>{name}</div>);
  }