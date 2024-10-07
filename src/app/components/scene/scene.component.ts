import { Component, OnInit } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ModalService } from 'src/app/services/modal/modal.service';
import { BuildingService } from 'src/app/services/building/building.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
  standalone: true
})
export class SceneComponent implements OnInit {

  // @ViewChild('rendererCanvas', { static: true }) rendererCanvas!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private controls!: OrbitControls;
  private rayCaster = new THREE.Raycaster();
  private clock = new THREE.Clock();
  private mouse = new THREE.Vector2();
  private colorsRandom: string[] = ['green', 'brown', 'blue'];

  private field: THREE.Mesh[] = [];
  private castles: any[] = [];
  private villages: any[] = [];

  constructor(
    private modalSrv: ModalService,
    private buildingSrv: BuildingService
  ) { }

  ngOnInit() {
    this.initThree();
  }

  ngOnDestroy() {
    this.renderer.domElement.remove();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.y = 5;
    this.camera.position.x = 5;
    const canvas = document.querySelector("canvas");
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.rendererCanvas.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.domElement.addEventListener('click', (event) => {
      // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      const canvasPosition = this.getCanvasRelativePosition(event);

      // Convert the position to normalized device coordinates (NDC)
      this.mouse.x = (canvasPosition.x / this.renderer.domElement.clientWidth) * 2 - 1;
      this.mouse.y = - (canvasPosition.y / this.renderer.domElement.clientHeight) * 2 + 1;

      // Call the function to check for intersections
      this.checkIntersections();
    });
    this.createField(8, 8);

    const light = new THREE.DirectionalLight();
    light.position.y = 3;
    this.scene.add(light);
    this.camera.position.z = 5;

    console.log('Scene', this.scene);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement!);
    // this.controls.target.set(0, .75, 0);
    this.controls.enableZoom = true;
    this.controls.enableRotate = true;
    this.controls.update();


    const animate = () => {
      requestAnimationFrame(animate);
      // this.cube.rotation.x += 0.01;
      // this.cube.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  private update() {
    // const deltaTime = this.clock.getDelta();
    // this.mixer?.update(deltaTime);
  }

  private createField(width: number, height: number) {
    for (let i = -width / 2; i < width / 2; i++) {
      for (let j = -height / 2; j < height / 2; j++) {

        const geometry = new THREE.BoxGeometry(1, .0, 1);
        const randomNumber = Math.floor(Math.random() * this.colorsRandom.length);;

        // const color = this.colorsRandom[randomNumber];
        const color = 'green';
        const material = new THREE.MeshBasicMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, material);
        cube.userData = {
          color: color,
          name: 'field',
          type: `Area is ${color == 'green' ? 'grass' : color == 'blue' ? 'water' : 'dirt'}`,
          positionX: i,
          positionY: j,
          owner: 'neutral'
        }
        cube.position.x = j;
        cube.position.y = 0;
        cube.position.z = i;
        this.field.push(cube);
        this.scene.add(this.field[this.field.length - 1]);

        if (i == width / 2 && j == height / 2) {
          // this.controls.target.set(cube.position.x, cube.position.y, cube.position.z);          
        }
      }
    }
    this.initCastles(width, height);
    this.initVillages();
    console.log('Scene', this.scene);

  }

  private initCastles(width: number, height: number) {
    this.createCastle(-width / 2, -height / 2, 'Castle', 'Lord 1');
    this.createCastle(width / 2 - 1, height / 2 - 1, 'Castle', 'Lord 2');
  }

  private createCastle(x: number, z: number, name: string, owner: string) {
    const geometry = new THREE.BoxGeometry(1, 1.3, 1);
    const material = new THREE.MeshBasicMaterial({ color: 'grey' });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.z = z;
    cube.position.y = 1.3 / 2;

    cube.userData = {
      type: 'base',
      buildingType: 'castle',
      owner: owner,
      name: name
    };
    this.castles.push(cube);
    this.scene.add(cube);
  }

  private initVillages() {
    this.createVillage(0, 3, 'Stone Mine', 'neutral', 'stone');
    this.createVillage(3, 0, 'Gold Mine', 'neutral', 'gold');
    this.createVillage(1, 1, 'Farm', 'neutral', 'food');

    this.createVillage(-1, -4, 'Stone Mine', 'neutral', 'stone');
    this.createVillage(-4, -1, 'Gold Mine', 'neutral', 'gold');
    this.createVillage(-2, -2, 'Farm', 'neutral', 'food');
  }

  private createVillage(x: number, z: number, name: string, owner: string, type: string) {
    const geometry = new THREE.BoxGeometry(1, .4, 1);
    const material = new THREE.MeshBasicMaterial({ color: 'grey' });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.x = x
    cube.position.z = z
    cube.position.y = .4 / 2;

    cube.userData = {
      type: 'settlement',
      buildingType: 'village',
      name: name,
      produces: type,
      perTurn: +2,
      ownedBy: owner
    };
    this.villages.push(cube);
    this.scene.add(cube);
  }

  private createVillageWithModel(x: number, z: number, name: string, owner: string, type: string) {
    const loader = new GLTFLoader();

    // loader.load('assets/3d/glb/village/village_low.glb', (gltf) => {
    // loader.load('assets/3d/glb/castle/castle.glb', (gltf) => {
    //   const villageModel = gltf.scene;

    //   // Assuming the model is centered at the origin, adjust its position
    //   villageModel.position.set(x, .2, z); // Adjust Y position as needed based on the model
    //   villageModel.scale.x = .02
    //   villageModel.scale.y = .02
    //   villageModel.scale.z = .02
    //   villageModel.name = 'Village'
    //   villageModel.userData = {
    //     type: 'settlement',
    //     buildingType: 'village',
    //     name: name,
    //     produces: type,
    //     perTurn: +2,
    //     ownedBy: owner
    //   };


    //   this.villages.push(villageModel); // Store the model if needed
    //   this.scene.add(villageModel);
    // }, undefined, (error) => {
    //   console.error('An error happened while loading the model', error);
    // });

    // const villageModel = new THREE.Group();
    // loader.load('assets/3d/glb/village/village_low.glb', (gltf) => {
    //   gltf.scene.traverse((child: any) => {
    //     if (child.isMesh) {
    //       villageModel.add(child);
    //     }
    //   });
    //   villageModel.position.set(x, .2, z); // Adjust Y position as needed based on the model
    //   villageModel.scale.x = .02
    //   villageModel.scale.y = .02
    //   villageModel.scale.z = .02
    //   villageModel.name = 'Village'
    //   villageModel.userData = {
    //     type: 'settlement',
    //     buildingType: 'village',
    //     name: name,
    //     produces: type,
    //     perTurn: +2,
    //     ownedBy: owner
    //   };
    //   this.scene.add(villageModel);
    // });
  }

  private checkIntersections() {

    this.rayCaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.rayCaster.intersectObjects(this.scene.children, true);
    // this.scene.add(new THREE.ArrowHelper(this.rayCaster.ray.direction, this.rayCaster.ray.origin, 1000, 0xff0000));
    if (intersects.length > 0) {
      this.controls.enableRotate = true;
      this.controls.enableDamping = true;
      this.controls.minZoom = 1
      this.controls.maxZoom = 10
      this.controls.update();
      const object = intersects[0].object;
      console.log('Intersected: ', intersects[0], object['userData']);
      if (object['userData']['type'] == 'settlement') {
        this.modalSrv.openVillageModal(object['userData']);
        this.modalSrv.isModalOpen = true;
      } else if (object['userData']['type'] == 'character') {

      }
      else if (object['userData']['type'] == 'base') {
        this.modalSrv.openBaseModal();
        this.modalSrv.isModalOpen = true;
      }

      const screenPosition = this.toScreenPosition(intersects[0].point, this.camera);
      console.log('Object ', object['userData']);
      // console.log('Object changed', this.selectedObject, 'New controls target', this.controls.target);
      // this.controls.update();
      // this.openInfoCard(screenPosition.x, screenPosition.y);
      // if (this.selectedObject && this.selectedObject == intersects[0].object) return;
      // this.selectedObject = intersects[0].object;
      // Example usage
      const newTargetPosition = new THREE.Vector3(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z); // Determine the new target position      
      // this.startTransition(newTargetPosition, new THREE.Vector3(0, 5, 10));
    }
  }

  private toScreenPosition(point: THREE.Vector3, camera: THREE.Camera): { x: number, y: number } {
    const vector = point.clone().project(camera);

    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;

    return { x: vector.x, y: vector.y };
  }

  private getCanvasRelativePosition(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}
