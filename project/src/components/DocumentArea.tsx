import React, { useState, useRef, useEffect } from 'react';
import cursorPicture from '../public/images/laserpointericon.png'; // Adjust the import path as necessary
import { useDocContext } from '../context/DocContext.tsx';

type SectionType = 'heading' | 'paragraph' | 'bullet';

interface Section {
    type: SectionType;
    content: string;
    id?: string;
}

interface Page {
    sections: Section[];
}

const initialPages: Page[] = [
    {
        sections: [
            { type: 'heading', content: 'CSS480 Group Project Spring 2025' },
            { type: 'paragraph', content: 'What is mouse Gesture?' },
            { type: 'paragraph', content: 'When a user holds right click on their mouse, their cursor will turn into a pen design. The user can then draw various shapes or patterns to cause some behavior in the document. When a shape is recognized by the program, the path drawn by the user changes color to indicate a pattern match.' },
            { type: 'paragraph', content: 'When a user holds right click on their mouse, their cursor will turn into a pen design. The user can then draw various shapes or patterns to cause some behavior in the document. When a shape is recognized by the program, the path drawn by the user changes color to indicate a pattern match.' },
            { type: 'heading', content: 'Mouse Lock Gesture' },
            { type: 'paragraph', content: 'If the user draws an lock shape over a paragraph of text, that section will be locked to all other users without additional input, meaning that they cannot edit the body of the text. If any user draws a U shape over the locked section, it unlocks the section, re-allowing text input.' },
        ]
    },
    {
        sections: [
            { type: 'heading', content: 'Mouse Shake Gesture' },
            { type: 'paragraph', content: 'If the user shakes their mouse while holding right click, it will indicate to all other users that the shaking user wants everyone to look at their location. Their tab on the right side of the document will then become larger and light up to indicate this. Other users can click on that tab to be taken to the shaking user’s location on the document. ' },
            { type: 'bullet', content: 'This allow user to find where other users working in document' },
            { type: 'bullet', content: 'It also track work progress, by mouse movement of users' },
            { type: 'bullet', content: 'It also allow to track mouse position of users' },
            { type: 'bullet', content: 'This allow user to find where other users working in document' },
            { type: 'paragraph', content: 'We are using a mouse-input model, where users perform certain mouse motions (a circle, a star, a squiggle, etc.) to enact certain actions (launching a link, enlarging a section of the webpage, bookmarking a piece of content, etc.)' },
            { type: 'paragraph', content: 'If the user shakes their mouse while holding right click, it will indicate to all other users that the shaking user wants everyone to look at their location. Their tab on the right side of the document will then become larger and light up to indicate this. Other users can click on that tab to be taken to the shaking user’s location on the document.' },
        ]
    },
    {
        sections: [
            { type: 'heading', content: 'Budget and Resources' },
            { type: 'paragraph', content: 'The total budget for this project is estimated at $500,000, broken down as follows:' },
            { type: 'bullet', content: 'Software licenses and implementation: $250,000' },
            { type: 'bullet', content: 'Training and documentation: $100,000' },
            { type: 'bullet', content: 'Project management and oversight: $100,000' },
            { type: 'bullet', content: 'Contingency: $50,000' },
            { type: 'heading', content: 'Expected Benefits' },
            { type: 'paragraph', content: 'The implementation of this new system is expected to yield significant benefits across multiple areas of our organization. Key performance indicators will be tracked to measure the success of the implementation.' },
        ]
    }
];

const DocumentArea: React.FC = () => {
    const { setIsEditing } = useDocContext(); // Now this hook is safely called at the top level
    //#region Drawing Code
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvas2 = useRef<HTMLCanvasElement>(null);
    const rectCanvas = useRef<HTMLCanvasElement>(null);


    const pathSegments = useRef<{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        time: number
    }[]>([]);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const shapeRecognized = useRef(false);
    let pastMousePositions = useRef<{ x: number; y: number }[]>([]);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const drawTimeout = 1500;

    const [highlightRect, setHighlightRect] = React.useState<{
        x: number;
        y: number;
        width: number;
        height: number
    } | null>(null);

    const [commentBox, setCommentBox] = React.useState<{
        x: number;
        y: number;
        width: number;
        height: number;
        value: string;
        visible: boolean;
    } | null>(null);

    // Resize the canvas to fit the window
    useEffect(() => {
        const canvas = canvasRef.current;
        const canvas2canvas = canvas2.current;
        const rectCanvasCheck = rectCanvas.current;
        if (!canvas2canvas) return;
        if (!canvas) return;
        if (!rectCanvasCheck) return;
        const ctx2 = canvas2canvas.getContext('2d');
        const ctx = canvas.getContext('2d');
        const rctx = rectCanvasCheck.getContext('2d');
        if (!ctx) return;
        if (!ctx2) return;
        if (!rctx) return;

        const resizeCanvas2 = () => {
            canvas2canvas.width = window.innerWidth;
            canvas2canvas.height = document.documentElement.scrollHeight;
        };
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        };
        const resizeRectCanvas = () => {
            rectCanvasCheck.width = window.innerWidth;
            rectCanvasCheck.height = document.documentElement.scrollHeight;
        };

        resizeCanvas();
        resizeCanvas2();
        resizeRectCanvas()
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('resize', resizeCanvas2);
        window.addEventListener('resize', resizeRectCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    // Drawing loop
    useEffect(() => {
        // Get the canvas and context, return if not found
        const canvas = canvasRef.current;
        const rectCanvasDraw = rectCanvas.current;
        const canvas2canvas = canvas2.current;
        const ctx = canvas?.getContext('2d');
        const ctx2 = canvas2canvas?.getContext('2d');
        const rctx = rectCanvasDraw?.getContext('2d');

        if (!canvas || !ctx || !ctx2 || !rctx) return;

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

        if (highlightRect) {
            console.log('Drawing highlight rectangle:', highlightRect);
            ctx.fillStyle = 'rgba(50, 50, 50, 0.3)';
            ctx.fillRect(highlightRect.x, highlightRect.y, highlightRect.width, highlightRect.height);
        }

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
        }, (drawTimeout / 2)); // Half because this really doesn't need to
        // stay long
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
        if (!canvas) return {x: 0, y: 0};
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
            const {x, y} = getCanvasCoords(e);
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        }

        // Store the mouse position
        pastMousePositions.current.push({x: e.clientX, y: e.clientY});

        // If not drawing, return
        if (!isDrawing) return;

        // Otherwise, we're drawing, so update the path to draw
        const now = Date.now();
        const {x, y} = getCanvasCoords(e);
        if (lastPos.current) {
            pathSegments.current.push({
                x1: lastPos.current.x,
                y1: lastPos.current.y,
                x2: x,
                y2: y,
                time: now,
            });
        }
        lastPos.current = {x, y};
    };

    // Prevent the default context menu from appearing
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    // This is the function that detects the shape
    // It will have all of the different gestures that we want to recognize
    const circleStrictness = 100; // Lower is more strict, higher is more lenient

    function detectShape(points: { x: number; y: number }[]): boolean {

        if (detectRectangle(points)) {
            console.log('SHAPE: Rectangle detected!');
            rectangleAction(points);
            console.log('SHAPE: Lock engaged.');
            return true;
        } else if (detectCircle(points)) {
            console.log('SHAPE: Circle detected!');
            circleAction(points);
            console.log(`SHAPE: Drew highlight at x=${points[0].x}, y=${points[0].y}`);
            return true;
        } else if (detectShake(points)) {
            console.log('SHAPE: Shake detected!');
            shakeAction(points);
            console.log('SHAPE: Made a comment box.')
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
        if (points.length === 0) return;

        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        setCommentBox({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            value: '',
            visible: true,
        });
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
            (acc, p) => ({x: acc.x + p.x, y: acc.y + p.y}),
            {x: 0, y: 0}
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

        return variance < circleStrictness; // smaller = more circular
    }

    // TODO: add an action for the circle
    function circleAction(points: { x: number; y: number }[]) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || points.length === 0) return;

        // Use the starting point of the gesture
        const x = points[0].x;
        const y = points[0].y;


        // Draw a yellow highlight rectangle at the starting position
        // ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(x, y, 200, 100);
        //   ctx.restore();
    }
    function distance(a?: { x: number; y: number }, b?: { x: number; y: number }): number {
        if (!a || !b) {
            console.error("distance function received undefined values", a, b);
            return 0;
        }
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
    // Detect rectangle gesture
    function detectRectangle(points: { x: number; y: number }[]): boolean {
        // === CONSTANTS ===
        const MIN_POINTS = 8;                      // Allow short strokes
        const CLOSURE_THRESHOLD_RATIO = 0.7;         // Ends can be further apart
        const SIMPLIFICATION_EPSILON = 30;           // Aggressively simplify the path
        const DUPLICATE_POINT_DISTANCE_THRESHOLD = 20; // Drop close endpoints more often
        const SIDE_LENGTH_TOLERANCE_RATIO = 0.1;       // Opposite sides must be almost equal
        const RIGHT_ANGLE_DEGREES = 90;              // Ideal angle remains 90°
        const ANGLE_TOLERANCE = 30;                  // Accept angles between 60° and 120°

        // Require enough points in the drawn gesture
        if (!points || points.length < 4) {
            console.log("Rectangle detection failed: not enough points.");
            return false;
        }

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
        const closureThreshold = diag * CLOSURE_THRESHOLD_RATIO;
        const first = points[0];
        const last = points[points.length - 1];
        if (Math.hypot(first.x - last.x, first.y - last.y) > closureThreshold) {
            console.log('Rectangle detection failed: stroke is not closed.');
            return false;
        }

        // --- Step 2: Simplify the stroke to identify corners ---
        const simplified = strokeSimplifier(points, SIMPLIFICATION_EPSILON);
        // Remove duplicate endpoint if it nearly replicates the first
        if (
            simplified.length > 1 &&
            Math.hypot(
                simplified[0].x - simplified[simplified.length - 1].x,
                simplified[0].y - simplified[simplified.length - 1].y
            ) < DUPLICATE_POINT_DISTANCE_THRESHOLD
        ) {
            simplified.pop();
        }

        // --- Step 3: Verify 2 side lengths are roughly equal ---
        const distance = (
            a: { x: number; y: number },
            b: { x: number; y: number }
        ) => Math.hypot(a.x - b.x, a.y - b.y);
        const d0 = distance(simplified[0], simplified[1]);
        const d1 = distance(simplified[1], simplified[2]);
        let d2 = distance(simplified[2], simplified[3]);
        let d3 = distance(simplified[3], simplified[0]);

        // If a parallel side cannot be calculated, assume its value equals the other.
        if (!d2 || isNaN(d2) || d2 === 0) {
            d2 = d0;
        }
        if (!d3 || isNaN(d3) || d3 === 0) {
            d3 = d1;
        }

        // Check that the two pairs of opposite sides are roughly equal.
        if (Math.abs(d0 - d2) > d0 * (1 - SIDE_LENGTH_TOLERANCE_RATIO) ||
            Math.abs(d1 - d3) > d1 * (1 - SIDE_LENGTH_TOLERANCE_RATIO)) {
            console.log('Rectangle detection failed: side lengths are not roughly equal.');
            return false;
        }

        // --- Step 4: Check that there are at least 4 corners roughly equivalent to 90°
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

        const isRightAngle = (angle: number) =>
            Math.abs(angle - RIGHT_ANGLE_DEGREES) < ANGLE_TOLERANCE;

        let rightAngleCount = 0;
        const len = simplified.length;
        for (let i = 0; i < len; i++) {
            const a = simplified[(i - 1 + len) % len];
            const b = simplified[i];
            const c = simplified[(i + 1) % len];
            const angle = getAngle(a, b, c);
            if (isRightAngle(angle)) {
                rightAngleCount++;
            }
        }
        if (rightAngleCount < 4) {
            console.log(`Rectangle detection failed: only ${rightAngleCount} right angles found.`);
            return false;
        }

        // All checks passed: the drawn shape is roughly a rectangle.
        rectangleAction(points);
        return true;
    }

    function rectangleAction(points: { x: number; y: number }[]) {
        if (points.length === 0) return;
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        const newRect = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };

        // Update the locked rectangles state.
        setLockedRectangles(prev => [...prev, newRect]);

        // Lock the document.
        setIsEditing(false);

        console.log("Lock applied with rectangle:", newRect);
    }


    const [lockedRectangles, setLockedRectangles] = useState<
        Array<{ x: number; y: number; width: number; height: number }>
    >([]);
    useEffect(() => {
        console.log ("ababab");
        const rc = rectCanvas.current;
        if (!rc) return;
        const ctx = rc.getContext("2d");
        if (!ctx) return;

        // Clear the overlay canvas.
        //ctx.clearRect(0, 0, rc.width, rc.height);
        // Draw each locked rectangle.
        lockedRectangles.forEach(rect => {
            ctx.save();
            ctx.fillStyle = "rgba(100,100,100,0.3)";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.strokeStyle = "grey";
            ctx.lineWidth = 3;
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            //ctx.restore(); //test again
        });
    }, [lockedRectangles]);




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

        //#endregion

        // Add unique IDs to each section for editing
        const [pages, setPages] = useState<Page[]>(
            initialPages.map(page => ({
                sections: page.sections.map((section, idx) => ({
                    ...section,
                    id: `${section.type}-${Math.random().toString(36).substr(2, 9)}-${idx}`
                }))
            }))
        );
        const [activeSection, setActiveSection] = useState<string | null>(null);
        const [editingContent, setEditingContent] = useState('');
        const textareaRef = useRef<HTMLTextAreaElement | null>(null);

        // Auto-resize textarea when content changes
        useEffect(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
            }
        }, [editingContent, activeSection]);

        const handleSectionClick = (sectionId: string, content: string) => {
            const section = pages.flatMap(page => page.sections).find(sec => sec.id === sectionId);
            if (!section || section.locked) {
                console.log("This section is locked and cannot be edited.");
                return; // Prevent editing locked sections
            }

            setActiveSection(sectionId);
            setEditingContent(content);
        };


        const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setEditingContent(e.target.value);
        };

        const handleBlur = (pageIdx: number, sectionIdx: number) => {
            if (activeSection) {
                setPages(prevPages =>
                    prevPages.map((page, pIdx) =>
                        pIdx === pageIdx
                            ? {
                                ...page,
                                sections: page.sections.map((section, sIdx) =>
                                    sIdx === sectionIdx
                                        ? {...section, content: editingContent}
                                        : section
                                )
                            }
                            : page
                    )
                );
                setActiveSection(null);
            }
        };

        return (
            <div
                className="flex flex-col items-center gap-4 py-4 w-full"
                onContextMenu={handleContextMenu}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {/* Floating laser pointer image */}
                <div
                    id="cursor"
                    style={{
                        position: 'absolute',
                        width: '48px',
                        height: '48px',
                        backgroundImage: `url(${cursorPicture})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none',
                        zIndex: 100,
                        visibility: isDrawing ? 'visible' : 'hidden',
                    }}
                ></div>

                {/* Canvas for drawing gestures */}
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
                />
                {/* Canvas for drawing shapes */}
                <canvas
                    ref={canvas2}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
                />
                {/* Canvas for drawing lock rectangles exclusively */}
                <canvas
                    ref={rectCanvas}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
                />

                {/* Document pages */}
                {pages.map((page, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="bg-white shadow-md w-full max-w-[8.5in] mx-auto"
                        style={{minHeight: '11in'}}
                    >
                        <div className="px-[1in] py-[1in]">
                            {page.sections.map((section, sectionIdx) => (
                                <div key={section.id} className="mb-2">
                                    {activeSection === section.id ? (
                                        <textarea
                                            ref={textareaRef}
                                            value={editingContent}
                                            onChange={handleContentChange}
                                            onBlur={() => handleBlur(pageIndex, sectionIdx)}
                                            className={`w-full overflow-hidden focus:outline-none ${section.type === 'heading'
                                                ? 'text-2xl font-bold mb-2'
                                                : section.type === 'bullet'
                                                    ? 'pl-6 mb-1'
                                                    : 'mb-2'
                                            }`}
                                            autoFocus
                                            rows={1}
                                            style={{
                                                resize: 'none',
                                                minHeight: section.type === 'heading' ? '2em' : '1.5em',

                                            }}
                                        />
                                    ) : (
                                        <div
                                            onClick={() => handleSectionClick(section.id!, section.content)}
                                            className={`cursor-text flex items-start ${section.type === 'heading'
                                                ? 'text-2xl font-bold mb-2'
                                                : section.type === 'bullet'
                                                    ? 'pl-6 mb-1'
                                                    : 'mb-2'
                                            }`}
                                            style={{cursor: (isDrawing) ? 'none' : 'text'}}
                                        >
                                            {section.type === 'bullet' && (
                                                <span
                                                    className="mr-2 mt-1 text-lg">•</span>
                                            )}
                                            <span>{section.content}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

export default DocumentArea;