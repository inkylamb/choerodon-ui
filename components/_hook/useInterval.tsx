import { useEffect, useRef } from "react";
 

 const useInterval = (callback,delay) => {
    const saveCallback = useRef();

    useEffect(() => {
        saveCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            if(saveCallback && saveCallback.current){
                // @ts-ignore
                saveCallback.current();
            }
        }
        const id = setInterval(tick, delay || 1000);
        return () => clearInterval(id);
    },[delay]);
}

export default useInterval