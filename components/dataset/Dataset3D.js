import React from 'react';
import PropTypes from 'prop-types';
import {connectToStores} from 'fluxible-addons-react';
import Dataset3DStore from '../../stores/Dataset3DStore';
import * as THREE from 'three';
import React3 from 'react-three-renderer';
import ReactDOM from 'react-dom';
import getClassFrequency from '../../actions/getClassFrequency';
import TrackballControls from './trackball.js';
import OrbitControls from './orbitcontrols.js';

class Dataset3D extends React.Component {
    constructor(props){
        super(props);
        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
        this.cameraPosition = new THREE.Vector3(0, 50, 0);
        this.classname1;
        this.cameraSet = false;
        this.maxfrequency = 0;
        this.maxBuildingHeight = 0;
        this.maxrows = 0;
        this.allbuildings = [];

        //this._raycaster = new THREE.Raycaster();
        //this.lightPosition = new THREE.Vector3(20, 20, 20);
        this.lightPosition = new THREE.Vector3(0, 500, 2000);
        this.lightTarget = new THREE.Vector3(0, 0, 0);

        this.state = {
            cubeRotation: new THREE.Euler(),
            minTimePerFrame: 0,
            rotate: true,
            wind: true,
            sphere: false,
            cameraPosition: new THREE.Vector3(0, 0, 50)
        };

        this._onAnimate = () => {
            if (this.controls)
            {
                this.controls.update();
            }
            // we will get this callback every frame

            // pretend cubeRotation is immutable.
            // this helps with updates and pure rendering.
            // React will be sure that the rotation has now updated.

            this.setState({
                cubeRotation: new THREE.Euler(
                    this.state.cubeRotation.xpos + 0.01,
                    this.state.cubeRotation.y + 0.01,
                    0
                ),
            });

        };
    }

    componentDidMount() {
        this.context.executeAction(getClassFrequency, {
            id: this.props.datasetURI
        });
    }

    setCamera(){

        console.log('setting camera');
        //}
        //componentDidMount() {
        //call actions to retrieve different characteristics of a dataset
        //Class Names -> their total number of instances
        //Class Names -> max number of properties


        const controls = new OrbitControls(
            this.refs.mainCamera, ReactDOM.findDOMNode(this.refs.react3)
        );

        /*
        const controls = new TrackballControls(
            this.refs.mainCamera, ReactDOM.findDOMNode(this.refs.react3)
        );
        */
        controls.rotateSpeed = 3.0;
        controls.zposoomSpeed = 3.0;
        controls.panSpeed = 3.0;
        controls.keyPanSpeed = 75;

        controls.noZoom = false;
        controls.noRotate = false;
        controls.noPan = false;
        //controls.noTilt = true;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.2;

        // Set to true to automatically rotate around the target
    	controls.autoRotate = true;
    	controls.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60


        controls.addEventListener('change', () => {
            this.setState({
                cameraPosition: this.refs.mainCamera.position,
            });
        });

        this.controls = controls;

    }
    componentWillUnmount() {
        if (this.controls)
        {
            this.controls.dispose();
            delete this.controls;
        }
    }
    componentDidUpdate(){
        if (this.props.Dataset3DStore.dataset.classes.length && !this.cameraSet)
        {
            this.setCamera();
            this.calculateBuildingDimensions();
            this.cameraSet = true;
        }
    }
    calculateBuildingDimensions(){

        this.maxrows = Math.ceil(Math.sqrt(this.props.Dataset3DStore.dataset.classes.length));
        let rowX = -this.maxrows;
        let rowZ = -this.maxrows;
        let doRow = 'X';
        this.props.Dataset3DStore.dataset.classes.push({ color: { }});
        this.props.Dataset3DStore.dataset.classes.push({ xpos: { }});
        this.props.Dataset3DStore.dataset.classes.push({ zpos: { }});
        this.props.Dataset3DStore.dataset.classes.push({ x: { }});
        this.props.Dataset3DStore.dataset.classes.push({ z: { }});

        Math.random()
        let i=6; //ignore first 6 few datasets, start at entry 7 (array position 6):
        /*
        [{"class":"http://www.wikidata.org/ontology#Statement","frequency":84444106,"color":127865.52621428466,"x":-32,"z":-32},
        {"class":"http://www.wikidata.org/ontology#Article","frequency":"47702419","color":12908924.007675832,"x":-30,"z":-32},
        {"class":"http://www.wikidata.org/ontology#Item","frequency":"19698345","color":11146294.636816196,"x":-28,"z":-32},
        {"class":"http://xmlns.com/foaf/0.1/Document","frequency":"12856178","color":38131.27586310562,"x":-26,"z":-32},
        {"class":"http://www.w3.org/2002/07/owl#Thing","frequency":"5606066","color":12359348.488620216,"x":-24,"z":-32},
        {"class":"http://www.wikidata.org/entity/Q5","frequency":"4309656","color":2791371.9494251353,"x":-22,"z":-32},
        */
        for(i; i<this.props.Dataset3DStore.dataset.classes.length; i++)
        {
            this.props.Dataset3DStore.dataset.classes[i].frequency = parseInt(this.props.Dataset3DStore.dataset.classes[i].frequency);
            //console.log(this.props.Dataset3DStore.dataset.classes[i].frequency);
            if(this.maxfrequency < this.props.Dataset3DStore.dataset.classes[i].frequency)
            {this.maxfrequency = this.props.Dataset3DStore.dataset.classes[i].frequency;}
            //Generate colours and
            this.props.Dataset3DStore.dataset.classes[i].color =  Math.random() * 0xffffff;
            this.props.Dataset3DStore.dataset.classes[i].x = Math.random();
            this.props.Dataset3DStore.dataset.classes[i].z = this.props.Dataset3DStore.dataset.classes[i].x;
            //assign position based on maxrows
            if(rowX > this.maxrows){
                rowX = -this.maxrows;
                rowZ +=2;
                this.props.Dataset3DStore.dataset.classes[i].xpos = rowX;
                this.props.Dataset3DStore.dataset.classes[i].zpos = rowZ;
                rowX +=2;
            }
            else {
                this.props.Dataset3DStore.dataset.classes[i].xpos = rowX;
                this.props.Dataset3DStore.dataset.classes[i].zpos = rowZ;
                rowX +=2;
            }
            //console.log(rowX + ' and ' + rowZ);
            //console.log(i);
        }
        //need to determine maxbuildingheight before creating building objects
        this.maxBuildingHeight = 10/this.maxfrequency;
        //console.log(this.maxfrequency);
        //console.log(this.maxBuildingHeight);
        //console.log(this.props.Dataset3DStore.dataset.classes[0].frequency);
        //console.log(this.props.Dataset3DStore.dataset.classes[0].frequency*this.maxBuildingHeight);
        //console.log(this.props.Dataset3DStore.dataset.classes[0].frequency*this.maxBuildingHeight);
        /*

        this.allbuildings.push(
            <mesh key=''
                pos0tion={new THREE.Vector3(this.props.Dataset3DStore.dataset.classes[0].xpos, ((this.props.Dataset3DStore.dataset.classes[0].frequency*this.maxBuildingHeight)/2), this.props.Dataset3DStore.dataset.classes[0].zpos)}
                castShadow
                receiveShadow
            >
                <boxGeometry
                    width={1}
                    height={this.props.Dataset3DStore.dataset.classes[0].frequency*this.maxBuildingHeight}
                    depth={1}
                />
                <meshLambertMaterial
                    color={this.props.Dataset3DStore.dataset.classes[0].color}
                />
            </mesh>);
            */

        i=6; //ignore first 6 few datasets, start at entry 7 (array position 6):
        /*
        [{"class":"http://www.wikidata.org/ontology#Statement","frequency":84444106,"color":127865.52621428466,"x":-32,"z":-32},
        {"class":"http://www.wikidata.org/ontology#Article","frequency":"47702419","color":12908924.007675832,"x":-30,"z":-32},
        {"class":"http://www.wikidata.org/ontology#Item","frequency":"19698345","color":11146294.636816196,"x":-28,"z":-32},
        {"class":"http://xmlns.com/foaf/0.1/Document","frequency":"12856178","color":38131.27586310562,"x":-26,"z":-32},
        {"class":"http://www.w3.org/2002/07/owl#Thing","frequency":"5606066","color":12359348.488620216,"x":-24,"z":-32},
        {"class":"http://www.wikidata.org/entity/Q5","frequency":"4309656","color":2791371.9494251353,"x":-22,"z":-32},
        */
        for(i; i<this.props.Dataset3DStore.dataset.classes.length; i++)
        //for(i; i<20; i++)
        {

            this.allbuildings.push(
                <mesh key={i}
                    position={new THREE.Vector3(this.props.Dataset3DStore.dataset.classes[i].xpos, ((this.props.Dataset3DStore.dataset.classes[i].frequency*this.maxBuildingHeight)/2), this.props.Dataset3DStore.dataset.classes[i].zpos)}
                    castShadow
                    receiveShadow
                >
                    <boxGeometry
                        width={this.props.Dataset3DStore.dataset.classes[i].x}
                        height={this.props.Dataset3DStore.dataset.classes[i].frequency*this.maxBuildingHeight}
                        depth={this.props.Dataset3DStore.dataset.classes[i].z}
                    />
                    <meshLambertMaterial
                        color={this.props.Dataset3DStore.dataset.classes[i].color}
                    />
                </mesh>);
            //console.log(this.allbuildings);
        }

        //console.log(this.allbuildings);

    }
    render() {
        //const width = window.innerWidth; // canvas width
        //const height = window.innerHeight; // canvas height
        const width = 640; // canvas width
        const height = 480; // canvas height

        //let classname0, classname1, freq0, freq1;
        //, color0, color1;

        //console.log(allbuildings);

        if (this.props.Dataset3DStore.dataset.classes.length)
        {
            //classname0 = this.props.Dataset3DStore.dataset.classes[0].class;
            //freq0 = this.props.Dataset3DStore.dataset.classes[0].frequency;
            //color0 = (Math.random() * 0xffffff);
            //classname1 = this.props.Dataset3DStore.dataset.classes[1].class;
            //freq1 = this.props.Dataset3DStore.dataset.classes[1].frequency;
            //color1 = (Math.random() * 0xffffff);

            //console.log(this.props.Dataset3DStore.dataset.classes);
            let self = this;
            return (
                <div className="ui fluid container ldr-padding-more" ref="dataset#D">
                    <div className="ui grid">
                        <div className="ui column">
                            <b>Linked Data City </b><br />
                            <b>Mouse controls:</b> Use your scroll-wheel to zoom-in and out. Click + mouve your mouse to pan up, down, left, and right <br />
                            <b>Key controls:</b> Press the 'p', 'q', or 'e'-key to stop auto-rotation. Press the arrow keys (up, down, left, right, or A,S,D,W) to move your view around, relative to what you are looking at. <br />
                            <b>Tip:</b> view the city from above and use the arrow-keys to move above to a building on which you can zoom in and inspect it.<br />
                            <React3
                                ref="react3"
                                mainCamera="mainCamera" // this points to the perspectiveCamera which has the name set to "camera" below
                                width={width}
                                height={height}
                                antialias
                                gammaInput
                                gammaOutput
                                shadowMapEnabled
                                shadowMapDebug
                                shadowMapType={THREE.PCFShadowMap}
                                sortObjects={false}
                                pixelRatio={window.devicePixelRatio}
                                clearColor={0xf0f0f0}
                                onAnimate={this._onAnimate}>
                                <scene>
                                    <perspectiveCamera
                                        name="mainCamera"
                                        ref="mainCamera"
                                        fov={75}
                                        aspect={width / height}
                                        position={this.cameraPosition}
                                        near={0.1}
                                        far={1000}
                                        lookAt={this.state.rotate ? this.scenePosition : null}
                                    />
                                    <ambientLight
                                        color={0x505050}
                                    />
                                    <spotLight
                                        color={0xffffff}
                                        intensity={1.5}
                                        position={this.lightPosition}
                                        lookAt={this.lightTarget}

                                        castShadow
                                        shadowCameraNear={200}
                                        shadowCameraFar={10000}
                                        shadowCameraFov={50}

                                        shadowBias={-0.00022}

                                        shadowMapWidth={2048}
                                        shadowMapHeight={2048}
                                    />
                                    <mesh
                                        position={new THREE.Vector3(0, -0.1, 0)}
                                    >
                                        <boxGeometry
                                            width={this.maxrows*2.5}
                                            height={0.09}
                                            depth={this.maxrows*2.5}
                                        />
                                        <meshBasicMaterial
                                            color={0x505050}
                                        />
                                    </mesh>
                                    {/*
                                    <mesh
                                        position={new THREE.Vector3(0, ((this.props.Dataset3DStore.dataset.classes[0].frequency*this.maxBuildingHeight)/2), 0)}
                                        castShadow
                                        receiveShadow
                                    >
                                        <boxGeometry
                                            width={1}
                                            height={this.props.Dataset3DStore.dataset.classes[0].frequency*this.maxBuildingHeight}
                                            depth={1}
                                        />
                                        <meshLambertMaterial
                                            color={this.props.Dataset3DStore.dataset.classes[0].color}
                                        />
                                    </mesh>
                                    <mesh
                                        position={new THREE.Vector3(2, ((this.props.Dataset3DStore.dataset.classes[1].frequency*this.maxBuildingHeight)/2), 0)}
                                        castShadow
                                        receiveShadow
                                    >
                                        <boxGeometry
                                            width={1}
                                            height={this.props.Dataset3DStore.dataset.classes[1].frequency*this.maxBuildingHeight}
                                            depth={1}
                                        />
                                        <meshLambertMaterial
                                            color={this.props.Dataset3DStore.dataset.classes[1].color}
                                        />
                                    </mesh>
                                    <mesh
                                        castShadow
                                        receiveShadow
                                        position={new THREE.Vector3(4, ((this.props.Dataset3DStore.dataset.classes[2].frequency*this.maxBuildingHeight)/2), 0)}
                                    >
                                        <boxGeometry
                                            width={1}
                                            height={this.props.Dataset3DStore.dataset.classes[2].frequency*this.maxBuildingHeight}
                                            depth={1}
                                        />
                                        <meshLambertMaterial
                                            color={this.props.Dataset3DStore.dataset.classes[2].color}
                                        />
                                    </mesh>
                                    */}
                                    {this.allbuildings}
                                </scene>
                            </React3>
                            <br/>
                            Resources in linked data repository loaded:
                            <br/>
                            {JSON.stringify(this.props.Dataset3DStore.dataset.classes)}
                        </div>
                    </div>
                </div>
            );

        }
        else
        {
            return(<div>Loading</div>);
        }


    }
}
Dataset3D.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
Dataset3D = connectToStores(Dataset3D, [Dataset3DStore], function (context, props) {
    return {
        Dataset3DStore: context.getStore(Dataset3DStore).getState()
    };
});
export default Dataset3D;