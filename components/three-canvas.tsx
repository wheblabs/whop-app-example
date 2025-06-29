"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import styled from 'styled-components';

interface Event {
  name: string;
  time: string; // Using string for ztime compatibility
  consequences: Event[];
}

// Sample timeline data
const sampleTimeline: Event = {
  time: "2024-01-01",
  name: "SuperIntelligence Project Launch",
  consequences: [
    {
      time: "2024-02-15",
      name: "First Milestone",
      consequences: [
        {
          time: "2024-03-01",
          name: "Testing Phase",
          consequences: []
        },
        {
          time: "2024-03-15",
          name: "Optimization",
          consequences: []
        }
      ]
    },
    {
      time: "2024-04-01",
      name: "UI Development",
      consequences: [
        {
          time: "2024-04-20",
          name: "Design Review",
          consequences: []
        }
      ]
    },
    {
      time: "2024-05-01",
      name: "Integration",
      consequences: []
    }
  ]
};

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const timelineGroupRef = useRef<THREE.Group | null>(null);
  const [isVertical, setIsVertical] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [cameraZ, setCameraZ] = useState(10);
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const parseTimeString = (timeStr: string): Date => {
    return new Date(timeStr);
  };

  const getDaysDifference = (startTime: string, endTime: string): number => {
    const start = parseTimeString(startTime);
    const end = parseTimeString(endTime);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
  };



  const createTimelineNode = (event: Event, position: THREE.Vector3, level: number = 0, parentTime?: string): THREE.Group => {
    const group = new THREE.Group();
    
    // Create main event node (sphere)
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(position);
    group.add(node);

    // Create text label using canvas texture
    const createTextTexture = (text: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      // Set high-resolution canvas size for crisp text on all screens
      const pixelRatio = window.devicePixelRatio || 1;
      const baseWidth = 256;
      const baseHeight = 64;
      canvas.width = baseWidth * pixelRatio;
      canvas.height = baseHeight * pixelRatio;
      canvas.style.width = baseWidth + 'px';
      canvas.style.height = baseHeight + 'px';
      
      // Scale context to match pixel ratio
      context.scale(pixelRatio, pixelRatio);
      
      // Configure text style
      context.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
      context.fillRect(0, 0, baseWidth, baseHeight);
      context.fillStyle = 'white';
      context.font = '16px Arial, sans-serif';
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      
      // Draw text
      context.fillText(text, 8, baseHeight / 2);
      
      return new THREE.CanvasTexture(canvas);
    };
    
    const textTexture = createTextTexture(event.name);
    const textMaterial = new THREE.SpriteMaterial({ 
      map: textTexture, 
      transparent: true,
      alphaTest: 0.1
    });
    const textSprite = new THREE.Sprite(textMaterial);
    textSprite.position.set(position.x + 1.4, position.y - 0.03, position.z);
    textSprite.scale.set(2.5, 0.7, 1); // Scale sprite appropriately
    group.add(textSprite);

    // Add downstream events
    if (event.consequences.length > 0) {
      event.consequences.forEach((downstreamEvent, index) => {
        // Calculate time-based positioning
        const daysDiff = getDaysDifference(event.time, downstreamEvent.time);
        const timeScale = 0.05; // Scale factor: 1 day = 0.05 units
        const timeDistance = daysDiff * timeScale;
        
        // For multiple events at the same time level, spread them perpendicular to timeline
        const baseOffset = (index - (event.consequences.length - 1) / 2) * 0.8;
        
        const downstreamPosition = new THREE.Vector3(
          position.x + (isVertical ? baseOffset : timeDistance),
          position.y + (isVertical ? -timeDistance : baseOffset),
          position.z
        );

        // Create bezier connection line
        const startPoint = new THREE.Vector3(position.x, position.y, position.z);
        const endPoint = new THREE.Vector3(downstreamPosition.x, downstreamPosition.y, downstreamPosition.z);
        
        // Calculate control points for smooth bezier curve
        const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
        const distance = direction.length();
        const controlDistance = distance * 0.4; // How far along the main direction before bending
        
        // Control points that ensure straight entry/exit parallel to main timeline
        let controlPoint1, controlPoint2;
        
        if (isVertical) {
          // For vertical timeline: curves enter/exit vertically (straight up/down)
          controlPoint1 = new THREE.Vector3(
            startPoint.x,
            startPoint.y - controlDistance, // Move straight down from start
            startPoint.z
          );
          controlPoint2 = new THREE.Vector3(
            endPoint.x,
            endPoint.y + controlDistance, // Move straight up from end
            endPoint.z
          );
        } else {
          // For horizontal timeline: curves enter/exit horizontally (straight left/right)
          controlPoint1 = new THREE.Vector3(
            startPoint.x + (direction.x > 0 ? controlDistance : -controlDistance), // Move along X direction
            startPoint.y,
            startPoint.z
          );
          controlPoint2 = new THREE.Vector3(
            endPoint.x + (direction.x > 0 ? -controlDistance : controlDistance), // Move opposite X direction
            endPoint.y,
            endPoint.z
          );
        }
        
        // Create bezier curve
        const curve = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
        const curvePoints = curve.getPoints(50); // 50 points for smooth curve
        
        // Convert curve points to line geometry
        const lineGeometry = new LineGeometry();
        const lineVertices: number[] = [];
        curvePoints.forEach(point => {
          lineVertices.push(point.x, point.y, point.z);
        });
        lineGeometry.setPositions(lineVertices);
        
        const lineMaterial = new LineMaterial({ 
          color: 0xff0000,
          linewidth: 3,
          resolution: new THREE.Vector2(
            mountRef.current?.clientWidth || window.innerWidth, 
            mountRef.current?.clientHeight || window.innerHeight
          )
        });
        const line = new Line2(lineGeometry, lineMaterial);
        group.add(line);

        // Recursively create downstream nodes
        const downstreamGroup = createTimelineNode(downstreamEvent, downstreamPosition, level + 1, event.time);
        group.add(downstreamGroup);
      });
    }

    return group;
  };

  const createTimeline = () => {
    if (!sceneRef.current || !timelineGroupRef.current) return;

    // Clear existing timeline
    timelineGroupRef.current.clear();

    // Calculate timeline span based on actual time range
    const getTimelineSpan = (events: Event, currentTime?: string): number => {
      const baseTime = currentTime || events.time;
      let maxDays = 0;
      
      const traverse = (event: Event, parentTime: string) => {
        const days = getDaysDifference(parentTime, event.time);
        maxDays = Math.max(maxDays, days);
        
        event.consequences.forEach(downstream => {
          traverse(downstream, event.time);
        });
      };
      
      events.consequences.forEach(downstream => {
        traverse(downstream, baseTime);
      });
      
      return Math.max(maxDays * 0.05 * 2, 4); // Min length of 4 units
    };

    // Create main timeline line (length based on time span)
    const mainLineGeometry = new LineGeometry();
    const timelineSpan = getTimelineSpan(sampleTimeline);
    const scaledLineLength = timelineSpan;
    const mainLineVertices = isVertical 
      ? [0, scaledLineLength/2, 0, 0, -scaledLineLength/2, 0]
      : [-scaledLineLength/2, 0, 0, scaledLineLength/2, 0, 0];
    
    mainLineGeometry.setPositions(mainLineVertices);
    const mainLineMaterial = new LineMaterial({ 
      color: 0xff0000, 
      linewidth: 3,
      resolution: new THREE.Vector2(
        mountRef.current?.clientWidth || window.innerWidth, 
        mountRef.current?.clientHeight || window.innerHeight
      )
    });
    const mainLine = new Line2(mainLineGeometry, mainLineMaterial);
    timelineGroupRef.current.add(mainLine);

    // Create timeline nodes (root positioned at timeline start)
    const rootOffset = scaledLineLength * 0.3; // Position root at 30% down the timeline
    const rootPosition = new THREE.Vector3(0, isVertical ? rootOffset : 0, 0);
    const timelineNodes = createTimelineNode(sampleTimeline, rootPosition);
    timelineGroupRef.current.add(timelineNodes);

    // Apply pan offset
    timelineGroupRef.current.position.set(panOffset.x, panOffset.y, 0);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Get container dimensions
    const container = mountRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    
    // Set proper pixel ratio for high DPI screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;


    // Create timeline group
    const timelineGroup = new THREE.Group();
    scene.add(timelineGroup);
    timelineGroupRef.current = timelineGroup;

    // Position camera
    camera.position.z = 10;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Simple zoom-to-cursor implementation
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      if (!cameraRef.current) return;
      
      // Get mouse position in normalized coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Create raycaster to get world position at cursor BEFORE zoom
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
      
      // Get intersection with z=0 plane (where our timeline is)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      // Calculate zoom factor and new camera Z position
      const zoomSpeed = 0.025;
      const zoomFactor = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      const currentZ = cameraRef.current.position.z;
      const newZ = Math.max(1, Math.min(50, currentZ * zoomFactor));
      
      // Calculate how much the view will shift due to zoom change
      const zoomRatio = newZ / currentZ;
      
      // Get current camera position (without Z)
      const currentPos = new THREE.Vector2(cameraRef.current.position.x, cameraRef.current.position.y);
      const targetPos = new THREE.Vector2(intersection.x, intersection.y);
      
      // Calculate new camera position to keep cursor point fixed
      const newCameraPos = targetPos.clone().sub(targetPos.clone().sub(currentPos).multiplyScalar(zoomRatio));
      
      // Apply the new position and zoom
      cameraRef.current.position.set(newCameraPos.x, newCameraPos.y, newZ);
      setCameraZ(newZ);
    };

    // Pan handlers
    const handleMouseDown = (event: MouseEvent) => {
      isPanningRef.current = true;
      lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Handle panning
      if (!isPanningRef.current) return;

      const deltaX = event.clientX - lastMousePosRef.current.x;
      const deltaY = event.clientY - lastMousePosRef.current.y;
      
      // Convert screen space movement to world space
      const panSensitivity = 0.01;
      setPanOffset(prev => ({
        x: prev.x + deltaX * panSensitivity,
        y: prev.y - deltaY * panSensitivity // Invert Y for correct direction
      }));

      lastMousePosRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isPanningRef.current = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const handleDoubleClick = () => {
      setPanOffset({ x: 0, y: 0 });
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, 10);
        setCameraZ(10);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const containerWidth = mountRef.current.clientWidth;
      const containerHeight = mountRef.current.clientHeight;
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Update Line2 material resolutions
      if (timelineGroupRef.current) {
        timelineGroupRef.current.traverse((child) => {
          if (child instanceof Line2) {
            const material = child.material as LineMaterial;
            material.resolution.set(containerWidth, containerHeight);
          }
        });
      }
    };
    
    // Disable browser zoom and add custom zoom
    const disableBrowserZoom = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };
    
    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('wheel', disableBrowserZoom, { passive: false });
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('dblclick', handleDoubleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', disableBrowserZoom);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    createTimeline();
  }, [isVertical, panOffset]);

  const toggleOrientation = () => {
    setIsVertical(!isVertical);
  };

  return (
    <Container>
      <CanvasContainer ref={mountRef} />
      <RotateButton onClick={toggleOrientation}>
        {isVertical ? '↔️' : '↕️'}
      </RotateButton>
      <ZoomIndicator>
        Camera Z: {cameraZ.toFixed(1)}
        <br />
        <small>Scroll to zoom, double-click to reset</small>
      </ZoomIndicator>
      <PanIndicator>
        Pan: ({panOffset.x.toFixed(1)}, {panOffset.y.toFixed(1)})
        <br />
        <small>Double-click to reset</small>
      </PanIndicator>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000000;
`;

const RotateButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ZoomIndicator = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 12px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  pointer-events: none;
  user-select: none;
  text-align: center;
  
  small {
    font-size: 10px;
    opacity: 0.8;
  }
`;

const PanIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 8px 12px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  pointer-events: none;
  user-select: none;
  text-align: center;
  
  small {
    font-size: 10px;
    opacity: 0.8;
  }
`; 