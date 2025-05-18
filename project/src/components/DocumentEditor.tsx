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

    const recognizedShape = useRef<"circle" | "square" | "shake" | null>(null);


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
        ctx.strokeStyle =
            recognizedShape.current === 'square' ? 'purple' : 'green';
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
    // else if (detectShake(points)) {
    //     shakeAction(points);
    //     return true;
    // }
    else if (detectSquare(points)) {
        squareAction(points);
        recognizedShape = 'square';
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

// Helper for computing perpendicular distance
function perpendicularDistance(
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
): number {
    const numerator = Math.abs(
        (lineEnd.y - lineStart.y) * point.x -
        (lineEnd.x - lineStart.x) * point.y +
        lineEnd.x * lineStart.y -
        lineEnd.y * lineStart.x
    );
    const denominator = Math.hypot(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);
    return denominator === 0 ? 0 : numerator / denominator;
}
// Helper for simplifying what a stroke is
function strokeSimplifier(
    points: { x: number; y: number }[],
    epsilon: number
): { x: number; y: number }[] {
    if (points.length < 3) return points;

    let dmax = 0;
    let index = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
        const d = perpendicularDistance(points[i], points[0], points[end]);
        if (d > dmax) {
            index = i;
            dmax = d;
        }
    }

    if (dmax > epsilon) {
        const recResults1 = strokeSimplifier(points.slice(0, index + 1), epsilon);
        const recResults2 = strokeSimplifier(points.slice(index), epsilon);
        // Combine results and remove duplicate point at the junction
        return recResults1.slice(0, recResults1.length - 1).concat(recResults2);
    } else {
        return [points[0], points[end]];
    }
}

// Detect square gesture
function detectSquare(points: { x: number; y: number }[]): boolean {
    // Require enough points in the drawn gesture
    if (points.length < 20) return false;

    // --- Step 1: Check that the stroke is closed ---
    let minX = points[0].x,
        maxX = points[0].x,
        minY = points[0].y,
        maxY = points[0].y;
    for (const p of points) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    }
    const diag = Math.hypot(maxX - minX, maxY - minY);
    const closureThreshold = diag * 0.2; // allow closure if first and last points are within 20% of the shape's diagonal
    const first = points[0];
    const last = points[points.length - 1];
    if (Math.hypot(first.x - last.x, first.y - last.y) > closureThreshold) return false;

    // --- Step 2: Simplify the stroke to identify corners ---
    const simplified = strokeSimplifier(points, 10); // epsilon may be tuned based on the
    // gesture’s scale
    // Remove duplicate endpoint if it nearly replicates the first
    if (
        simplified.length > 1 &&
        Math.hypot(
            simplified[0].x - simplified[simplified.length - 1].x,
            simplified[0].y - simplified[simplified.length - 1].y
        ) < 10
    ) {
        simplified.pop();
    }

    // A square should simplify to exactly 4 corner points.
    if (simplified.length !== 4) return false;

    // --- Step 3: Verify side lengths are roughly equal ---
    const distance = (
        a: { x: number; y: number },
        b: { x: number; y: number }
    ) => Math.hypot(a.x - b.x, a.y - b.y);
    const d0 = distance(simplified[0], simplified[1]);
    const d1 = distance(simplified[1], simplified[2]);
    const d2 = distance(simplified[2], simplified[3]);
    const d3 = distance(simplified[3], simplified[0]);
    const avgSide = (d0 + d1 + d2 + d3) / 4;
    const sideTolerance = avgSide * 0.3; // allow a 30% deviation

    if (
        Math.abs(d0 - avgSide) > sideTolerance ||
        Math.abs(d1 - avgSide) > sideTolerance ||
        Math.abs(d2 - avgSide) > sideTolerance ||
        Math.abs(d3 - avgSide) > sideTolerance
    ) {
        return false;
    }

    // --- Step 4: Check that each corner’s angle is roughly 90° ---
    const getAngle = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        c: { x: number; y: number }
    ) => {
        // Angle at point b formed by vectors (a -> b) and (c -> b)
        const ab = { x: a.x - b.x, y: a.y - b.y };
        const cb = { x: c.x - b.x, y: c.y - b.y };
        const dot = ab.x * cb.x + ab.y * cb.y;
        const magA = Math.hypot(ab.x, ab.y);
        const magC = Math.hypot(cb.x, cb.y);
        if (magA === 0 || magC === 0) return 0;
        const cosine = dot / (magA * magC);
        return Math.acos(Math.max(-1, Math.min(1, cosine))) * (180 / Math.PI);
    };

    const angle0 = getAngle(simplified[3], simplified[0], simplified[1]);
    const angle1 = getAngle(simplified[0], simplified[1], simplified[2]);
    const angle2 = getAngle(simplified[1], simplified[2], simplified[3]);
    const angle3 = getAngle(simplified[2], simplified[3], simplified[0]);

    // For a square the internal angle should be around 90°
    const isRightAngle = (angle: number) => Math.abs(angle - 90) < 30; // tolerance ±30°
    if (
        !isRightAngle(angle0) ||
        !isRightAngle(angle1) ||
        !isRightAngle(angle2) ||
        !isRightAngle(angle3)
    ) {
        return false;
    }

    // All checks passed: the drawn shape is roughly a square.
    return true;
}

// Action when a square gesture (lock) is detected
function squareAction(points: { x: number; y: number }[]) {
    console.log('Square detected! Lock engaged.');
    // The rest to be added when text can be written
}

export default DocumentEditor;
