import React, { useRef, useEffect } from 'react';
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function ResultRender({data_array}) {


   const canvasRef = useRef(null);


    useEffect(() => {
        if (canvasRef.current === null) {
            return;
            }


        const camera = new THREE.PerspectiveCamera(
            15,
            1,
            0.1,
            1000
        )
        camera.position.z = 1.5;
        camera.position.x = 0.04;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("gray");

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current
        });

        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.6);
        pointLight.position.set(0, 50, 50);
        camera.add(pointLight);

        scene.add(camera);


        const onProgress = function (xhr) {
            if (xhr.lengthComputable) {
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              console.log(Math.round(percentComplete, 2) + "% downloaded");
            }
          };

        const onError = function () {};

        const manager = new THREE.LoadingManager();
        let path = "";
        let model_obj = data_array["obj"];
        let model_mtl = data_array["mtl"];
        let model_texture = data_array["texture"];

        const loader = new THREE.TextureLoader();
        const texture = loader.setPath(path).load(model_texture);
        texture.encoding = THREE.sRGBEncoding;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;


        new MTLLoader(manager)
        .setPath(path)
        .load(model_mtl, function (materials) {
        materials.preload();
        new OBJLoader(manager)
            .setMaterials(materials)
            .setPath(path)
            .load(
            model_obj,
            function (object) {
                object.traverse(function (child) {
                // aka setTexture
                if (child instanceof THREE.Mesh) {
                    child.material.side = THREE.DoubleSide;
                    child.material.map = texture;
                }
                });
                scene.add(object);
            },
            onProgress,
            onError
            );
        });


        const controls = new OrbitControls(camera, canvasRef.current, scene);
        controls.enableDamping = true
        controls.addEventListener('change', function () {
            renderer.render(scene, camera);
        });
        controls.update();


        const render = (time) => {
            time = time * 0.001;
            renderer.render(scene, camera);
            window.requestAnimationFrame(render);
          };
          window.requestAnimationFrame(render);

        const handleResize = () => {
            const canvas = renderer.domElement;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth , window.innerHeight, false);
          };
          handleResize();
          window.addEventListener("resize", handleResize,false);

        renderer.render(scene, camera);
        return () => window.removeEventListener('resize', handleResize);
    });

    return (
        <canvas ref={canvasRef} id="canvas-result" className='w-50 h-100'/>
    )
}

export default ResultRender
