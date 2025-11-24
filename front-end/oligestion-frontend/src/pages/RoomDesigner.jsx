import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[20, 20]} />
    <meshStandardMaterial color="#f4f2ed" />
  </mesh>
);

const Wall = ({ position, rotation }) => (
  <mesh position={position} rotation={rotation} receiveShadow>
    <planeGeometry args={[20, 8]} />
    <meshStandardMaterial color="#f7f5f2" />
  </mesh>
);

const Bed = ({ config }) => {
  const geometryArgs = useMemo(() => {
    if (config.shape === "rounded") {
      return <RoundedBox args={[config.width, config.height, config.depth]} radius={0.4} smoothness={4} />;
    }
    return <boxGeometry args={[config.width, config.height, config.depth]} />;
  }, [config]);

  return (
    <group position={[0, config.height / 2, 0]}>
      <mesh castShadow>
        {geometryArgs}
        <meshStandardMaterial color={config.color} />
      </mesh>
      <mesh position={[0, config.height / 2 + config.mattress / 2, 0]} castShadow>
        <boxGeometry args={[config.width - 0.4, config.mattress, config.depth - 0.4]} />
        <meshStandardMaterial color={config.mattressColor} />
      </mesh>
    </group>
  );
};

const Pillow = ({ config, position }) => {
  const args = config.shape === "square" ? [1, 0.3, 1] : [1.4, 0.3, 0.7];
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={config.color} />
    </mesh>
  );
};

const Headboard = ({ config, width, depth }) => {
  const base = [width, config.height, 0.3];
  const z = depth / 2 - 0.1;

  if (config.shape === "arched") {
    return (
      <mesh position={[0, config.height / 2 + config.yOffset, z]} castShadow>
        <RoundedBox args={base} radius={0.6} smoothness={4}>
          <meshStandardMaterial color={config.color} />
        </RoundedBox>
      </mesh>
    );
  }

  if (config.shape === "panels") {
    return (
      <group position={[0, config.height / 2 + config.yOffset, z]}>
        {[ -width / 3, 0, width / 3 ].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[width / 3 - 0.2, config.height, 0.25]} />
            <meshStandardMaterial color={config.color} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <mesh position={[0, config.height / 2 + config.yOffset, z]} castShadow>
      <boxGeometry args={base} />
      <meshStandardMaterial color={config.color} />
    </mesh>
  );
};

const Curtain = ({ side, color }) => {
  const offset = side === "left" ? -5 : 5;
  return (
    <mesh position={[offset, 4, -6]} rotation={[0, Math.PI / 2, 0]} castShadow>
      <boxGeometry args={[0.2, 8, 3]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const ControlGroup = ({ title, children }) => (
  <div className="control-section">
    <h3>{title}</h3>
    {children}
  </div>
);

const RoomDesigner = () => {
  const [bedConfig, setBedConfig] = useState({
    shape: "rectangle",
    color: "#a07455",
    width: 5,
    depth: 7,
    height: 0.6,
    mattress: 0.5,
    mattressColor: "#fdfdfd",
  });

  const [pillowConfig, setPillowConfig] = useState({
    shape: "rectangle",
    color: "#ffffff",
  });

  const [headboardConfig, setHeadboardConfig] = useState({
    shape: "flat",
    color: "#d3c4b6",
    height: 2.2,
    yOffset: 0.6,
  });

  const [curtainColor, setCurtainColor] = useState("#d2d8f5");

  return (
    <div className="room-page">
      <aside>
        <h1>Studio chambre</h1>
        <p>Gère les attributs de chaque élément pour préparer un devis client.</p>

        <ControlGroup title="Lit">
          <label>
            Couleur
            <input
              type="color"
              value={bedConfig.color}
              onChange={(e) => setBedConfig({ ...bedConfig, color: e.target.value })}
            />
          </label>
          <label>
            Forme
            <select
              value={bedConfig.shape}
              onChange={(e) => setBedConfig({ ...bedConfig, shape: e.target.value })}
            >
              <option value="rectangle">Rectangle</option>
              <option value="rounded">Angles arrondis</option>
            </select>
          </label>
          <label>
            Largeur ({bedConfig.width.toFixed(1)} m)
            <input
              type="range"
              min="3.5"
              max="6"
              step="0.1"
              value={bedConfig.width}
              onChange={(e) => setBedConfig({ ...bedConfig, width: Number(e.target.value) })}
            />
          </label>
          <label>
            Profondeur ({bedConfig.depth.toFixed(1)} m)
            <input
              type="range"
              min="5.5"
              max="8"
              step="0.1"
              value={bedConfig.depth}
              onChange={(e) => setBedConfig({ ...bedConfig, depth: Number(e.target.value) })}
            />
          </label>
        </ControlGroup>

        <ControlGroup title="Oreillers">
          <label>
            Couleur
            <input
              type="color"
              value={pillowConfig.color}
              onChange={(e) => setPillowConfig({ ...pillowConfig, color: e.target.value })}
            />
          </label>
          <label>
            Forme
            <select
              value={pillowConfig.shape}
              onChange={(e) => setPillowConfig({ ...pillowConfig, shape: e.target.value })}
            >
              <option value="rectangle">Rectangulaire</option>
              <option value="square">Carré</option>
            </select>
          </label>
        </ControlGroup>

        <ControlGroup title="Tête de lit">
          <label>
            Couleur
            <input
              type="color"
              value={headboardConfig.color}
              onChange={(e) => setHeadboardConfig({ ...headboardConfig, color: e.target.value })}
            />
          </label>
          <label>
            Forme
            <select
              value={headboardConfig.shape}
              onChange={(e) => setHeadboardConfig({ ...headboardConfig, shape: e.target.value })}
            >
              <option value="flat">Plate</option>
              <option value="arched">Arche</option>
              <option value="panels">Panneaux</option>
            </select>
          </label>
        </ControlGroup>

        <ControlGroup title="Rideaux">
          <label>
            Couleur
            <input type="color" value={curtainColor} onChange={(e) => setCurtainColor(e.target.value)} />
          </label>
        </ControlGroup>
      </aside>

      <section className="stage">
        <div className="canvas-frame">
          <Canvas shadows camera={{ position: [10, 6, 10], fov: 40 }}>
            <color attach="background" args={["#eceff4"]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
            <Floor />
            <Wall position={[0, 4, -10]} rotation={[0, 0, 0]} />
            <Wall position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]} />
            <Curtain side="left" color={curtainColor} />
            <Curtain side="right" color={curtainColor} />
            <Bed config={bedConfig} />
            {[ -1.3, 1.3 ].map((x) => (
              <Pillow
                key={x}
                config={pillowConfig}
                position={[x, bedConfig.height + bedConfig.mattress + 0.2, bedConfig.depth / 2 - 1.2]}
              />
            ))}
            <Headboard config={headboardConfig} width={bedConfig.width} depth={bedConfig.depth} />
            <OrbitControls enablePan enableZoom maxPolarAngle={Math.PI / 2.1} />
          </Canvas>
        </div>
      </section>
    </div>
  );
};

export default RoomDesigner;

