var gl;
var canvas;

//number of edges drawn
var NumVerticesEdges = 48 * 4;
var NumVerticesPerCube = 36;
var NumVerticesPerCylinder = 0; ////implement this
//buffers for points
var points = [];

//crosshair bit
var cylinder = 0;

//offset for color array used to cycle through colors
var colorAdjust = 0;

//adjustments used in translations for camera location
var yAdjust = 0;
var zAdjust = 0;
var xAdjust = 0;

//camera position
var cameraX = 0;
var cameraY = 4;
var cameraZ = 0;

//variables used to adjust Azimuth
var cameraRadius = 15;
var zAzimuth = 0;
var xAzimuth = 0;
var yAzimuth = 0;
var thetaAzimuth = 0;
var radian;

//field of view
var fov = 45;

//Uniform location variables
var matWorldUniformLocation;
var matViewUniformLocation;
var matProjUniformLocation;

var fColorUniformLocation;

//matrices
var worldMatrix;
var viewMatrix;
var projMatrix;

//matrices for cylinder
var csViewMatrix;
var csProjMatrix;

//vertices buffer and attribute location
var vBuffer;
var vPosition;

//Webgl program
var program;


//8 positioning vectors for the 8 cubes
var moveVec = [
        vec4v( 0, 0, 15, 0 ),
        //vec4v( 10, 10, -10, 0),
        vec4v( 0, 0, -15, 0),
        //vec4v( 10, -10, -10, 0),
        vec4v( -15, 0, 0, 0),
        //vec4v( -10, 10, -10, 0),
        vec4v( 15, 0, 0, 0)
        //vec4v( -10, -10, -10, 0)
    ];
    
//unit cube coordinate and crosshair
var vertices = [
        vec4v( -3, -3,  -3, 1.0 ),
        vec4v( -3,  3,  -3, 1.0 ),
        vec4v(  3,  3,  -3, 1.0 ),
        vec4v(  3, -3,  -3, 1.0 ),
        vec4v( -3, -3, 3, 1.0 ),
        vec4v( -3,  3, 3, 1.0 ),
        vec4v(  3,  3, 3, 1.0 ),
        vec4v(  3, -3, 3, 1.0 ),
    ];
    
//colors
var vertexColors = [
        [ 1.0, 0.5, 0.0, 1.0 ],  // orange?
        [ 1.0, 0.0, 0.5, 1.0 ],  // purple? 
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];



//
//listen for keyboard inputs
//

document.addEventListener("keydown", function (event) {

    if ((event.which || event.keycode) == 187){ //+ button
        if (crossHair == 0) crossHair = 1;
        else crossHair = 0;
    }
    if ((event.which || event.keycode) == 67){ //c button
        switchColors();
    }
    if ((event.which || event.keycode) == 38){ //up arrow
        yAdjust = yAdjust - 0.25;
    }
    if ((event.which || event.keycode) == 40){ //down arrow
        yAdjust = yAdjust + 0.25;
    }
    if ((event.which || event.keycode) == 73){ //i button
        moveForward();
    }
    if ((event.which || event.keycode) == 77){ //m button
        moveBackward();
    }
    if ((event.which || event.keycode) == 74){ //j button
        moveLeft();
    }
    if ((event.which || event.keycode) == 75){ //k button
        moveRight();
    }
    if ((event.which || event.keycode) == 82){ //r button
        resetAdjust();
    }
    if ((event.which || event.keycode) == 37){ //left arrowkey
        thetaAzimuth = thetaAzimuth - 4;
    }
    if ((event.which || event.keycode) == 39){ //right arrowkey
        thetaAzimuth = thetaAzimuth + 4;
    }
    if ((event.which || event.keycode) == 78){ //n button
        fov = fov - 1;
    }
    if ((event.which || event.keycode) == 87){ //w button
        fov = fov + 1;
    }
})

//
//move based on Azimuth and adjust x and z coordinates accordingly
//
function moveLeft() {
    xAdjust = xAdjust - (Math.sin(radian - (Math.PI/2))*0.25);
    zAdjust = zAdjust + (Math.cos(radian - (Math.PI/2))*0.25);
}
function moveRight() {
    xAdjust = xAdjust + (Math.sin(radian - (Math.PI/2))*0.25);
    zAdjust = zAdjust - (Math.cos(radian - (Math.PI/2))*0.25);
}
function moveForward() {
    xAdjust = xAdjust - Math.sin(radian)*0.25;
    zAdjust = zAdjust + Math.cos(radian)*0.25;
}
function moveBackward() {
    xAdjust = xAdjust + Math.sin(radian)*0.25;
    zAdjust = zAdjust - Math.cos(radian)*0.25;
}

//
//reset camera 
//
function resetAdjust() {
    yAdjust = 0;
    zAdjust = 0;
    xAdjust = 0;
    thetaAzimuth = 0;
    fov = 45;
}

//colorAdjust cycles through from 0-7 and wraps around
function switchColors() {
    if (colorAdjust == 7) colorAdjust = 0;
    else colorAdjust++;
}

//calculate z and x adjustments for viewMatrix
function calculateAzimuths() {
    thetaAzimuth = thetaAzimuth + 1;
    radian = radians(thetaAzimuth);
    zAzimuth = cameraRadius * Math.cos(radian);
    xAzimuth = cameraRadius * Math.sin(radian);
}


window.onload = function init() {
    
    //
    //initialize and setup canvas
    //
    
    canvas = document.getElementById('glCanvas');
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    
    //
    //set vertexes
    //
    
    colorCube();
    
    
    //
    //initialize shaders
    //
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    
    //
    //set uniform locations
    //

    matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    fColorUniformLocation = gl.getUniformLocation(program, 'fColor');
    
    //
    //initialize matrices
    //
    
    worldMatrix = new Float32Array(16);
    viewMatrix = new Float32Array(16);
    projMatrix = new Float32Array(16);
  
    //
    //render
    //

    render();
}

//
//push vertices for crosshair, cubes, and edges
//
function colorCube()
{
    /*
    //4 vertices for crosshair
    points.push(vertices[8]);
    points.push(vertices[9]);
    points.push(vertices[10]);
    points.push(vertices[11]);
    */
    
    //4 cubes, 6 squares to make cube edge
    for(var i = 0; i < 4; i++){
        quadedge( 0, 1, 2, 3, i); //bottom
        quadedge( 0, 1, 5, 4, i); //left
        quadedge( 0, 4, 7, 3, i); //front
        quadedge( 2, 3, 7, 6, i); //right
        quadedge( 1, 2, 6, 5, i); //back
        quadedge( 4, 5, 6, 7, i); //top
    }
    //4 cubes, 6 quads to make cube surface
    for(var i = 0; i < 4; i++){
        quad( 0, 1, 2, 3, i); //bottom
        quad( 0, 1, 5, 4, i); //left
        quad( 0, 4, 7, 3, i); //front
        quad( 2, 3, 7, 6, i); //right
        quad( 1, 2, 5, 6, i); //back
        quad( 4, 5, 6, 7, i); //top
    }
}

function quad(a, b, c, d, z)
{
    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( add(vertices[indices[i]], moveVec[z]));
    }
}

function quadedge(a, b, c, d, z)
{
    // We need to parition the quad into 4 edges in order for
    // WebGL to be able to render it.

    var indices = [ a, b, b, c, c, d, d, a ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( add(vertices[indices[i]], moveVec[z]) );
    }
}

function render()
{
    //draw cylinder
    if(cylinder == 1){
        
        updateCylinder();
        
        mat4.identity(worldMatrix);
        //initialize static matrices
        csViewMatrix = new Float32Array(16);
        csProjMatrix = new Float32Array(16);
        mat4.lookAt(csViewMatrix, [0, 0, 40],[0, 0, 0],[ 0, 1, 0]);
        mat4.perspective(csProjMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);
        
        //load matrices
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, csViewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, csProjMatrix);
        
        //draw crosshair
        gl.drawArrays( gl.TRIANGLES, NumVerticesEdges + (NumVerticesPerCube*4), NumVerticesPerCylinder);
    }
    
    
    
    //
    //set buffers
    //
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    
    //clear
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    calculateAzimuths();
    
    //
    //set the three world, view, and projection matrices
    //
    mat4.identity(worldMatrix); //identity
    mat4.lookAt(viewMatrix, [cameraX, cameraY, cameraZ],[xAzimuth, yAzimuth, zAzimuth],[ 0, 1, 0]); //xAzimuth and zAzimuth decide where the camera points
    mat4.scalar.translate(viewMatrix, viewMatrix, [xAdjust,yAdjust,zAdjust] ); //Adjustments used for translation
    mat4.perspective(projMatrix, glMatrix.toRadian(fov), canvas.width/canvas.height, 0.1, 1000.0); //projection fov is field of view
    
    //set color to white for edges
    gl.uniform4fv(fColorUniformLocation, vertexColors[9]);
    
    
    //load varying matrices for cubes
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
    //draw edges
    gl.drawArrays( gl.LINES, 0, NumVerticesEdges);
    
    //draw cubes changing colors for every cube.
    for(var i = 0; i < 4; i++){
        gl.uniform4fv(fColorUniformLocation, vertexColors[(i + colorAdjust)%8]);
        gl.drawArrays( gl.TRIANGLES, NumVerticesEdges + (NumVerticesPerCube*i), NumVerticesPerCube );
    }
    
    requestAnimFrame( render );
}