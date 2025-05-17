import React, { useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Toolbar from './Toolbar';
import DocumentArea from './DocumentArea';
import StatusBar from './StatusBar';
import cursorPicture from '../public/images/laserpointericon.png'; // Adjust the import path as necessary

const DocumentEditor: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pathSegments = useRef<{ x1: number; y1: number; x2: number; y2: number; time: number }[]>([]);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const shapeRecognized = useRef(false);
    let pastMousePositions = useRef<{ x: number; y: number }[]>([]);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const drawTimeout = 1000;


    // Resize the canvas to fit the window
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    // Drawing loop
    useEffect(() => {
        // Get the canvas and context, return if not found
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Enable drawing on the canvas
        const drawLoop = () => {
            if (!shapeRecognized.current) {
                drawUnrecognized(canvas, ctx, drawLoop);
            } else {
                drawRecognized(canvas, ctx, drawLoop);
            }
        };

        drawLoop(); // Start the animation loop
    }, []);

    // Helper function to draw the path segments
    function drawUnrecognized(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, drawLoop: () => void) {
        const now = Date.now();
        pathSegments.current = pathSegments.current.filter(segment => now - segment.time < drawTimeout);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (const segment of pathSegments.current) {
            ctx.moveTo(segment.x1, segment.y1);
            ctx.lineTo(segment.x2, segment.y2);
        }
        ctx.stroke();

        requestAnimationFrame(drawLoop);
    }
    function drawRecognized(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, drawLoop: () => void) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (const segment of pathSegments.current) {
            ctx.moveTo(segment.x1, segment.y1);
            ctx.lineTo(segment.x2, segment.y2);
        }
        ctx.stroke();

        setTimeout(() => {
            pathSegments.current = [];
            shapeRecognized.current = false;
            requestAnimationFrame(drawLoop);
        }, drawTimeout);
    }

    // Show/hide the cursor based on drawing state
    useEffect(() => {
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.visibility = isDrawing ? 'visible' : 'hidden';
        }
    }, [isDrawing]);

    const getCanvasCoords = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 2) return;
        setIsDrawing(true);
        document.body.style.cursor = 'none';
        lastPos.current = getCanvasCoords(e);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (e.button !== 2) return;
        setIsDrawing(false);
        document.body.style.cursor = '';
        lastPos.current = null;

        shapeRecognized.current = (detectShape(pastMousePositions.current));
        pastMousePositions.current = [];
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // Update the position of the laser pointer cursor
        const cursor = document.getElementById('cursor');
        if (cursor) {
            const { x, y } = getCanvasCoords(e);
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        }

        // Store the mouse position
        pastMousePositions.current.push({ x: e.clientX, y: e.clientY });

        // If not drawing, return
        if (!isDrawing) return;

        // Otherwise, we're drawing, so update the path to draw
        const now = Date.now();
        const { x, y } = getCanvasCoords(e);
        if (lastPos.current) {
            pathSegments.current.push({
                x1: lastPos.current.x,
                y1: lastPos.current.y,
                x2: x,
                y2: y,
                time: now,
            });
        }
        lastPos.current = { x, y };
    };

    // Prevent the default context menu from appearing
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div
            className="flex flex-col min-h-screen relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
        >
            <div
                id="cursor"
                style={{
                    position: 'absolute',
                    width: '64px',
                    height: '64px',
                    backgroundImage: `url(${cursorPicture})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none',
                    zIndex: 100,
                    visibility: isDrawing ? 'visible' : 'hidden',
                }}
            ></div>

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
            />
            <Navbar />
            <div className="flex-1 flex flex-col">
                <Toolbar />
                <div className="flex-1 overflow-auto flex justify-center bg-[#f8f9fa] py-4">
                    <DocumentArea />
                </div>
                <StatusBar />
            </div>
        </div>
    );
};

// This is the function that detects the shape
// It will have all of the different gestures that we want to recognize
function detectShape(points: { x: number; y: number }[]): boolean {
    if (detectCircle(points)) {
        circleAction(points);
        return true;
    }
    else if (detectShake(points)) {
        shakeAction(points);
        return true;
    }
    // TODO: add more shapes here
    else {
        return false;
    }
    
}

// Detect horizontal shake
function detectShake(points: { x: number; y: number }[]): boolean {
    if (points.length < 10) return false;

    const first = points[0];
    const last = points[points.length - 1];
    const ydist = Math.abs(first.y - last.y);
    if (ydist > 75) return false; // not a shake

    // matches if the speed is high and there were definitive changes in direction
    const speed = points.reduce((acc, p, i) => {
        if (i === 0) return acc;
        const dist = Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y);
        return acc + dist;
    }, 0);

    const avgSpeed = speed / points.length;
    const directionChanges = points.reduce((acc, p, i) => {
        if (i === 0) return acc;
        const dist = Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y);
        return acc + (dist > 7 ? 1 : 0);
    }, 0);

    return avgSpeed > 2 && directionChanges > 3; // adjust these values as needed
}

// TODO: add an action for the shake
function shakeAction(points: { x: number; y: number }[]) {
    // TODO: add an action for the shake
    console.log('Shake detected!');
}

// Detect Circle
function detectCircle(points: { x: number; y: number }[]): boolean {
    if (points.length < 30) return false;

    const first = points[0];
    const last = points[points.length - 1];
    const dist = Math.hypot(first.x - last.x, first.y - last.y);
    if (dist > 75) return false; // not closed enough

    // Calculate center (average position)
    const center = points.reduce(
        (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
        { x: 0, y: 0 }
    );
    center.x /= points.length;
    center.y /= points.length;

    // Compute average radius and deviation
    const radii = points.map(p =>
        Math.hypot(p.x - center.x, p.y - center.y)
    );
    const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
    const variance =
        radii.reduce((sum, r) => sum + Math.abs(r - avgRadius), 0) /
        radii.length;

    return variance < 40; // smaller = more circular
}

// TODO: add an action for the circle
function circleAction(points: { x: number; y: number }[]) {
    console.log('Circle detected!');
}


export default DocumentEditor;
