import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import MultiColumnDragAndDrop from "./Container";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MultiColumnDragAndDrop/>
    </>
  );
}

export default App;
