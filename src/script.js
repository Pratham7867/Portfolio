import * as THREE from 'three'
import GUI from 'lil-gui'
import Vertext from './Shader/Vertext.glsl'
import Fragment from './Shader/Fragment.glsl'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const textLabels = [] // Stores text meshes for camera-facing updates

// Load saved color

function getScaleFactor() {
    if (window.innerWidth < 500) return 0.6;   // Mobile
    if (window.innerWidth < 1024) return 0.8;  // Tablet
    return 1;                                  // Desktop
}


/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded',
}
var color = parameters.materialColor;

export default color;


/**
 * Load Texture
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Material
 */
const material = new THREE.ShaderMaterial({
    vertexShader: Vertext,
    fragmentShader: Fragment,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uColor: new THREE.Uniform(new THREE.Color(parameters.materialColor)),
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})


gui.addColor(parameters, 'materialColor').onChange(() => {
    material.uniforms.uColor.value.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.materialColor)
    document.documentElement.style.setProperty('color', parameters.materialColor)

    // Save to localStorage
    localStorage.setItem("portfolioColor", parameters.materialColor)
})

// Resize GUI for smaller screens
function resizeGUI() {
    if (window.innerWidth <= 768) {
        gui.domElement.style.transform = "scale(0.4)";
        gui.domElement.style.transformOrigin = "top right";
    } else {
        gui.domElement.style.transform = "scale(1)";
        gui.domElement.style.transformOrigin = "top right";
    }
}

resizeGUI();
window.addEventListener("resize", resizeGUI);




var textcolor = document.querySelector('html')
textcolor.style.color = `${color}`

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Objects
 */
const objectDistance = 4

const scaleFactor = getScaleFactor();

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.3, 16, 60), material);
torus.scale.set(scaleFactor, scaleFactor, scaleFactor);

const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
cone.scale.set(scaleFactor, scaleFactor, scaleFactor);

const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
torusKnot.scale.set(scaleFactor, scaleFactor, scaleFactor);

const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), material);
icosahedron.scale.set(scaleFactor, scaleFactor, scaleFactor);


cone.position.y = -objectDistance * 0.9
torusKnot.position.y = -objectDistance * 1.8
icosahedron.position.y = -objectDistance * 3.8

torus.position.x = 2
cone.position.x = -2
torusKnot.position.x = 2
icosahedron.position.x = 2

scene.add(torus, cone, torusKnot, icosahedron)

const objects = { torus, cone, torusKnot, icosahedron }

/**
 * Skill Sphere Group
 */
const skillSphereGroup = new THREE.Group()
scene.add(skillSphereGroup)
// Handle Responsive Sizing
function getResponsiveSize() {
    if (window.innerWidth < 500) return 0.8;   // small for mobile
    if (window.innerWidth < 1024) return 1.2;  // medium for tablet
    return 1.5;                                // default for desktop
}

let size = getResponsiveSize();

// ✅ Create Sphere with responsive size
const Sphere = new THREE.Mesh(
    new THREE.SphereGeometry(size, 40, 40),
    material
);
Sphere.position.y = -objectDistance * 2.7;
skillSphereGroup.add(Sphere);

/**
 * Load Font & Add Skills
 */
const skills = [
    "HTML", "CSS", "JavaScript", "React.js", "Node.js",
    "Three.js", "MongoDB", "Tailwind", "Git",
    "Redux", "Express", "GSAP", "FramerMotion "
]
const fontLoader = new FontLoader()
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    function getResponsiveSize() {
        if (window.innerWidth < 500) return 0.8;   // small for mobile
        if (window.innerWidth < 1024) return 1.2;  // medium for tablet
        return 1.5;                                // default for desktop
    }

    const radius = getResponsiveSize() // Radius for skill placement

        skills.forEach((skill, i) => {
            const phi = Math.acos(-1 + (2 * i) / skills.length)
            const theta = Math.sqrt(skills.length * Math.PI) * phi

            const x = radius * Math.sin(phi) * Math.cos(theta)
            const y = radius * Math.sin(phi) * Math.sin(theta)
            const z = radius * Math.cos(phi)

            const textGeo = new TextGeometry(skill, {
                font: font,
                size: 0.1,
                height: 0.02,
            })

            const textMat = new THREE.MeshStandardMaterial({ color: 'White' })
            const textMesh = new THREE.Mesh(textGeo, textMat)

            textMesh.position.set(x, y + Sphere.position.y, z)
            textMesh.lookAt(camera.position)
            skillSphereGroup.add(textMesh)
            textMesh.scale.z = 0.0005
            textLabels.push(textMesh)

        })
})

/**
 * Particles
 */
const particleCount = 1000
const positions = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const savedColor = localStorage.getItem("portfolioColor")
if (savedColor) {
    parameters.materialColor = savedColor
    material.uniforms.uColor.value.set(savedColor)
    particlesMaterial.color.set(savedColor)
    document.documentElement.style.setProperty('color', savedColor)
}

/**
 * Camera
 */
const aspect = (sizes.width / sizes.height)
const frustumSize = (sizes.width / sizes.height) * 2

const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect / 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    100
)
camera.position.z = 10

const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})


/**
 * Handle Resize
 */
window.addEventListener("resize", () => {
    size = getResponsiveSize();
    const newScale = getScaleFactor();

    // Update sphere geometry
    Sphere.geometry.dispose();
    Sphere.geometry = new THREE.SphereGeometry(size, 40, 40);

    // Update all shape scales
    torus.scale.set(newScale, newScale, newScale);
    cone.scale.set(newScale, newScale, newScale);
    torusKnot.scale.set(newScale, newScale, newScale);
    icosahedron.scale.set(newScale, newScale, newScale);

    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function updateCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 6; // adjust zoom here (higher = zoomed out)

    camera.left   = -frustumSize * aspect / 2;
    camera.right  =  frustumSize * aspect / 2;
    camera.top    =  frustumSize / 3;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();
}


function handleResize() {
    size = getResponsiveSize();
    const newScale = getScaleFactor();

    // ✅ Update sphere
    Sphere.geometry.dispose();
    Sphere.geometry = new THREE.SphereGeometry(size, 40, 40);

    // ✅ Update scale of all shapes
    torus.scale.set(newScale, newScale, newScale);
    cone.scale.set(newScale, newScale, newScale);
    torusKnot.scale.set(newScale, newScale, newScale);
    icosahedron.scale.set(newScale, newScale, newScale);

    // ✅ Responsive positioning
    if (window.innerWidth < 768) {
        // 📱 Mobile layout
        torus.position.set(0.5, 0, 0);
        cone.position.set(-0.7, -objectDistance * 0.7, 0);
        torusKnot.position.set(0.7, -objectDistance * 1.6, 0);
        icosahedron.position.set(0.7, -objectDistance * 2.9, 0);
        Sphere.position.y = -objectDistance *2.3;
        // Sphere.scale.set (0.1, 1, 40);
        
    } else {
        // 💻 Desktop layout
        torus.position.set(2, 0, 0);
        cone.position.set(-2, -objectDistance * 0.9, 0);
        torusKnot.position.set(2, -objectDistance * 1.7, 0);
        icosahedron.position.set(2, -objectDistance * 3.8, 0);
        Sphere.position.y = -objectDistance * 2.7;
    }

    // ✅ Update camera
    updateCamera()

}

window.addEventListener("resize", handleResize);

if (window.innerWidth < 768) {
    handleResize()
   // mobile layout
} else {
    
   // desktop layout
}


renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * Scroll Handling
 */
let scrollY = window.scrollY
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
})

/**
 * Cursor Handling
 */
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animation Loop
 */
const clock = new THREE.Clock()





let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    camera.position.y = -scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x
    const parallaxY = -cursor.y
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    for (const mesh of Object.values(objects)) {
        mesh.rotation.x = elapsedTime * 0.2
        mesh.rotation.y = elapsedTime * 0.2
    }

    // Rotate the skill sphere and text
    skillSphereGroup.rotation.y = elapsedTime * 0.2;
    // skillSphereGroup.rotation.x = elapsedTime * 0.1;
    textLabels.forEach(label => {
        label.lookAt(camera.position)
    })


    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

