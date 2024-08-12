import { useEffect, useState } from "react";

function useAddRoom() {
    const [data, setData] = useState(new Map());
    useEffect(() => {
        console.log("^^^^ In use effect ^^^^")
        fetch(`${process.env.REACT_APP_BACKEND_URL}/getRoomList`)
            .then((res) => res.json())
            .then((res) => setData(res))
    }, [])
    console.log("$$$$$ In use hook $$$$$$", data);
    return data
}

export default useAddRoom;