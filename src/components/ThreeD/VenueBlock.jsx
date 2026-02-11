import { useRef } from 'react'
import { Box, MeshWobbleMaterial } from '@react-three/drei'

export default function VenueBlock({ position, color = "#A78BFA" }) {
    return (
        <Box position={position} args={[1, 1, 1]}>
            <MeshWobbleMaterial
                color={color}
                speed={1}
                factor={0.2}
                transparent
                opacity={0.8}
            />
        </Box>
    )
}
