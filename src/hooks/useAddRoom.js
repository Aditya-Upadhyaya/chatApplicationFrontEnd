import { useEffect, useState } from "react";

function useAddRoom() {
    const [data, setData] = useState(new Map());
    useEffect(() => {
        console.log("^^^^ In use effect ^^^^")
        fetch('http://localhost:8085/getRoomList')
            .then((res) => res.json())
            .then((res) => setData(res))
    }, [])
    console.log("$$$$$ In use hook $$$$$$", data);
    return data
}

export default useAddRoom;