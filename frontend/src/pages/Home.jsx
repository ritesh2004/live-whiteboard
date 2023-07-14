import React, { useEffect, useRef, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';

function Home() {
    const [color, setColor] = useState("#080808");
    const [size, setSize] = useState("3");
    const [drawing, setDraw] = useState(false);
    const [cursor, setCursor] = useState('default');
    const [isSend,setIsSend] = useState(false);

    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const socketRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext('2d');

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        socketRef.current = new WebSocket("ws://127.0.0.1:8000/")

        socketRef.current.onopen = (e) =>{
            console.log("open",e)
        }
        socketRef.current.onmessage = (e) =>{
            console.log("message",e)
            if(e.data !== 'undefined' && !isSend){
                setIsSend(false)
                setDraw(true)
                draw(JSON.parse(e.data))
            }
        }
        socketRef.current.onerror = (e) =>{
            console.log("error",e)
        }

    }, [ctx])

    const startDraw = ({ nativeEvent }) => {
        // console.log("data",nativeEvent)
        setDraw(true)
        setIsSend(true)
        draw(nativeEvent)
    }

    const finishDraw = () => {
        setDraw(false)
        ctx.current.beginPath()
    }

    const draw = (nativeEvent) => {
        // console.log(nativeEvent)
        if (!drawing) {
            return;
        }
        // console.log(nativeEvent)
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext('2d');
        ctx.current.lineWidth = size;
        ctx.current.lineCap = 'round';
        ctx.current.strokeStyle = color;

        ctx.current.lineTo(nativeEvent.clientX, nativeEvent.clientY)
        ctx.current.stroke()
        ctx.current.beginPath()
        ctx.current.moveTo(nativeEvent.clientX, nativeEvent.clientY)

        // console.log(nativeEvent)
        // console.log(typeof(nativeEvent))

        if (isSend) {
            let x = nativeEvent.clientX
            let y = nativeEvent.clientY
            
            socketRef.current.send(JSON.stringify({
                clientX:x,
                clientY:y
            }))
        }
    }

    const getPen = () => {
        setSize("5")
        setColor("#454545")
        setCursor('default')
    }

    const clearDraw = () => {
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext("2d");
        ctx.current.fillStyle = "white";
        ctx.current.fillRect(0, 0, canvas.width, canvas.height)
    }

    const eraseDraw = () => {
        setColor('white')
        setCursor('grab')
        setSize(20)
        if (!drawing) {
            return;
        }
    }

    return (
        <>
            <div className="home">
                <div className="tools">
                    <div className="tool" onClick={getPen}>
                        <CreateIcon />
                    </div>
                    <div className="tool">
                        <input type="color" name="color" value={color} onChange={(e) => setColor(e.target.value)} id="color" />
                    </div>
                    <div className="tool">
                        <select name="size" id="size" value={size} onChange={(e) => { setSize(e.target.value) }}>
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="8">8</option>
                            <option value="12">12</option>
                            <option value="16">16</option>
                            <option value="20">20</option>
                            <option value="24">24</option>
                            <option value="28">28</option>
                            <option value="32">32</option>
                        </select>
                    </div>
                    <div className="tool" onClick={clearDraw}>
                        <ClearIcon />
                    </div>
                    <div className="tool" onClick={eraseDraw}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eraser-fill" viewBox="0 0 16 16">
                            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
                        </svg>
                    </div>
                </div>
                <canvas
                    ref={canvasRef}
                    style={{ cursor: cursor }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={finishDraw} />
            </div>
        </>
    )
}

export default Home;