import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export function CameraView() {
    useFrame(state => {
        state.camera.lookAt(5, 10, 0);
    });
    const size = useThree(state => state.size);
    const zoom = Math.min(size.height, size.width) / 900 * 35;
    return <OrthographicCamera makeDefault zoom={zoom} position={[0, 15, 30]} far={100} near={10} />;
}