import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
    const gltf = useGLTF("/models/rk61.glb");

    return <primitive object={gltf.scene} scale={2} />;
}

export default function KeyboardModel() {
    return (
        <div style={{ height: "500px" }}>
            <Canvas>
                <ambientLight intensity={1} />
                <directionalLight position={[2, 2, 2]} />

                <Model />

                <OrbitControls />
            </Canvas>
        </div>
    );
}