import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="card">
        <Card title="Simple Card">
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
            sed consequuntur error repudiandae numquam deserunt quisquam
            repellat libero asperiores earum nam nobis, culpa ratione quam
            perferendis esse, cupiditate neque quas!
          </p>
        </Card>
      </div>
      <ProgressBar value={50}></ProgressBar>
      <Button
        icon="pi pi-plus"
        className="mr-2"
        label="Increment"
        onClick={() => setCount((count) => count + 1)}
      ></Button>
      <InputText value={count.toString()} />
    </>
  );
}

export default App;
