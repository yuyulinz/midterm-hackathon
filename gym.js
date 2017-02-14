var gl;
var canvas;

//number of edges drawn
var NumVerticesEdges = 48 * 4;
var NumVerticesPerCube = 36;
var NumVerticesPerCylinder = 360*3;
var NumVerticesPerCylinderHalfEdge = 360 * 6;

var woodenHeight = 0.60;
var bfitHeight = 0.10;


//buffers for points
var points = [];

//cylinder variables
var cylinder = 0;
var cylinderRadius = 0.75;

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

// flags
var isRotating = true // flag to determine whether cubes should be rotating or not

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
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 0.5 ],  // cyan
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 1.0, 1.0, 1.0 ],  // white
        [ 1.0, 1.0, 1.0, 0.5 ]   //transparent white
    ];

document.addEventListener("keydown", function (event) {
    if ((event.which || event.keycode) == 82){ //r button
        resetAdjust();
    }
    if ((event.which || event.keycode) == 49){
        chooseMonThurs()
        cylinder = 0;
    }
    if ((event.which || event.keycode) == 50){
        chooseFri()
        cylinder = 0;
    }
    if ((event.which || event.keycode) == 51){
        chooseSat()
        cylinder = 0;
    }
    if ((event.which || event.keycode) == 52){
        chooseSun()
        cylinder = 0;
    }
})

var chooseMonThurs = () => {
    isRotating = false
    console.log('z:', Math.floor(zAzimuth), 'x:', Math.floor(xAzimuth))
        // console.log('hello')
            var monThurs = setInterval(() => {
                console.log(Math.floor(zAzimuth), Math.floor(xAzimuth))
                // console.log('test')
                if(!(Math.floor(zAzimuth) == 14 && Math.floor(xAzimuth) == 0)) {
                    thetaAzimuth = thetaAzimuth + 1
                    radian = radians(thetaAzimuth);
                    zAzimuth = cameraRadius * Math.cos(radian);
                    xAzimuth = cameraRadius * Math.sin(radian);   
                }
                else {
                    cylinder = 1;
                    clearInterval(monThurs)
                }
            }, 5)
}

var chooseFri = () => {
    isRotating = false
    console.log('z:', Math.floor(zAzimuth), 'x:', Math.floor(xAzimuth))
        // console.log('hello')
        var Fri = setInterval(() => {
            console.log(Math.floor(zAzimuth), Math.floor(xAzimuth))
            // console.log('test')
            if(!(Math.floor(zAzimuth) == 0 && Math.floor(xAzimuth) == 14)) {
                thetaAzimuth = thetaAzimuth + 1
                radian = radians(thetaAzimuth);
                zAzimuth = cameraRadius * Math.cos(radian);
                xAzimuth = cameraRadius * Math.sin(radian);   
            }
            else{
                cylinder = 1;
                clearInterval(Fri)
            }
        }, 5)
}

var chooseSat = () => {
    isRotating = false
    console.log('z:', Math.floor(zAzimuth), 'x:', Math.floor(xAzimuth))
        // console.log('hello')
        var Sat = setInterval(() => {
            console.log(Math.floor(zAzimuth), Math.floor(xAzimuth))
            // console.log('test')
            if(!(Math.floor(zAzimuth) == -15 && Math.floor(xAzimuth) == 0)) {
                thetaAzimuth = thetaAzimuth + 1
                radian = radians(thetaAzimuth);
                zAzimuth = cameraRadius * Math.cos(radian);
                xAzimuth = cameraRadius * Math.sin(radian);   
            }
            else{
                cylinder = 1;
                clearInterval(Sat)
            }
        }, 5)
}

var chooseSun = () => {
    isRotating = false
    console.log('z:', Math.floor(zAzimuth), 'x:', Math.floor(xAzimuth))
        // console.log('hello')
        var Sun = setInterval(() => {
            console.log(Math.floor(zAzimuth), Math.floor(xAzimuth))
            // console.log('test')
            if(!(Math.floor(zAzimuth) == 0 && Math.floor(xAzimuth) == -15)) {
                thetaAzimuth = thetaAzimuth + 1
                radian = radians(thetaAzimuth);
                zAzimuth = cameraRadius * Math.cos(radian);
                xAzimuth = cameraRadius * Math.sin(radian);   
            }
            else{
                cylinder = 1;
                clearInterval(Sun)
            }
        }, 5)
}

var updateTime = time => {
    var amOrPm = document.getElementById('amOrPm').value
    if(Math.floor(zAzimuth) == 14 && Math.floor(xAzimuth) == 0) {   
        if(amOrPm == "AM"){
            switch(time) {
                case 12: {
                    woodenHeight = .03
                    bfitHeight = .1
                    break
                }
                case 1: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 2: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 3: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 4: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 5: {
                    woodenHeight = .03
                    bfitHeight = -1
                    break
                }
                case 6: {
                    woodenHeight = .21
                    bfitHeight = .105
                    break

                }
                case 7: {
                    woodenHeight = .2175
                    bfitHeight = .2325
                    break
                }
                case 8: {
                    woodenHeight = .225
                    bfitHeight = .2625
                    break
                }
                case 9: {
                    woodenHeight = .315
                    bfitHeight = .36
                    break
                }
                case 10: {
                    woodenHeight = .405
                    bfitHeight = .315
                    break
                }
                case 11: {
                    woodenHeight = .3225
                    bfitHeight = .315
                    break
                }
            }
        }
        if(amOrPm == "PM"){
            switch(time) {
                case 12: {
                    woodenHeight = .35
                    bfitHeight = .3
                    break
                }
                case 1: {
                    woodenHeight = .38
                    bfitHeight = .26
                    break
                }
                case 2: {
                    woodenHeight = .4
                    bfitHeight = .3
                    break
                }
                case 3: {
                    woodenHeight = .52
                    bfitHeight = .375
                    break
                }
                case 4: {
                    woodenHeight = .62
                    bfitHeight = .51
                    break
                }
                case 5: {
                    woodenHeight = .578
                    bfitHeight = .585
                    break
                }
                case 6: {
                    woodenHeight = .51
                    bfitHeight = .562
                    break

                }
                case 7: {
                    woodenHeight = .48
                    bfitHeight = .465
                    break
                }
                case 8: {
                    woodenHeight = .37
                    bfitHeight = .48
                    break
                }
                case 9: {
                    woodenHeight = .28
                    bfitHeight = .57
                    break
                }
                case 10: {
                    woodenHeight = .17
                    bfitHeight = .5625
                    break
                }
                case 11: {
                    woodenHeight = 0
                    bfitHeight = .435
                    break
                }
            }
        }
    }
    if(Math.floor(zAzimuth) == 0 && Math.floor(xAzimuth) == 14) {   
        if(amOrPm == "AM"){
            switch(time) {
                case 12: {
                    woodenHeight = .45
                    bfitHeight = .195
                    break
                }
                case 1: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 2: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 3: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 4: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 5: {
                    woodenHeight = .225
                    bfitHeight = -1
                    break
                }
                case 6: {
                    woodenHeight = .12
                    bfitHeight = .085
                    break

                }
                case 7: {
                    woodenHeight = .1725
                    bfitHeight = .1425
                    break
                }
                case 8: {
                    woodenHeight = .2025
                    bfitHeight = .2025
                    break
                }
                case 9: {
                    woodenHeight = .2475
                    bfitHeight = .255
                    break
                }
                case 10: {
                    woodenHeight = .3075
                    bfitHeight = .3
                    break
                }
                case 11: {
                    woodenHeight = .4275
                    bfitHeight = .255
                    break
                }
            }
        }
        if(amOrPm == "PM"){
            switch(time) {
                case 12: {
                    woodenHeight = .3075
                    bfitHeight = .3
                    break
                }
                case 1: {
                    woodenHeight = .43
                    bfitHeight = .36
                    break
                }
                case 2: {
                    woodenHeight = .42
                    bfitHeight = .255
                    break
                }
                case 3: {
                    woodenHeight = .405
                    bfitHeight = .2775
                    break
                }
                case 4: {
                    woodenHeight = .435
                    bfitHeight = .3825
                    break
                }
                case 5: {
                    woodenHeight = .495
                    bfitHeight = .5175
                    break
                }
                case 6: {
                    woodenHeight = .4875
                    bfitHeight = .6
                    break

                }
                case 7: {
                    woodenHeight = .3825
                    bfitHeight = .5475
                    break
                }
                case 8: {
                    woodenHeight = .3075
                    bfitHeight = .42
                    break
                }
                case 9: {
                    woodenHeight = .2475
                    bfitHeight = .44
                    break
                }
                case 10: {
                    woodenHeight = .1125
                    bfitHeight = .24
                    break
                }
                case 11: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
            }
        }
    }

    //Saturday
    if(Math.floor(zAzimuth) == -15 && Math.floor(xAzimuth) == 0) {   
        if(amOrPm == "AM"){
            switch(time) {
                case 12: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 1: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 2: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 3: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 4: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 5: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 6: {
                    woodenHeight = .18
                    bfitHeight = .105
                    break

                }
                case 7: {
                    woodenHeight = .225
                    bfitHeight = .2325
                    break
                }
                case 8: {
                    woodenHeight = .2025
                    bfitHeight = .2625
                    break
                }
                case 9: {
                    woodenHeight = .195
                    bfitHeight = .36
                    break
                }
                case 10: {
                    woodenHeight = .18
                    bfitHeight = .315
                    break
                }
                case 11: {
                    woodenHeight = .2025
                    bfitHeight = .315
                    break
                }
            }
        }
        if(amOrPm == "PM"){
            switch(time) {
                case 12: {
                    woodenHeight = .2175
                    bfitHeight = .3
                    break
                }
                case 1: {
                    woodenHeight = .24
                    bfitHeight = .26
                    break
                }
                case 2: {
                    woodenHeight = .27
                    bfitHeight = .3
                    break
                }
                case 3: {
                    woodenHeight = .2475
                    bfitHeight = .375
                    break
                }
                case 4: {
                    woodenHeight = .0975
                    bfitHeight = .51
                    break
                }
                case 5: {
                    woodenHeight = -1
                    bfitHeight = .585
                    break
                }
                case 6: {
                    woodenHeight = -1
                    bfitHeight = .562
                    break

                }
                case 7: {
                    woodenHeight = -1
                    bfitHeight = .465
                    break
                }
                case 8: {
                    woodenHeight = -1
                    bfitHeight = .48
                    break
                }
                case 9: {
                    woodenHeight = -1
                    bfitHeight = .57
                    break
                }
                case 10: {
                    woodenHeight = -1
                    bfitHeight = .5625
                    break
                }
                case 11: {
                    woodenHeight = -1
                    bfitHeight = .435
                    break
                }
            }
        }
    }
    if(Math.floor(zAzimuth) == 0 && Math.floor(xAzimuth) == -15) {   
        if(amOrPm == "AM"){
            switch(time) {
                case 12: {
                    woodenHeight = .03
                    bfitHeight = .1
                    break
                }
                case 1: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 2: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 3: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 4: {
                    woodenHeight = -1
                    bfitHeight = -1
                    break
                }
                case 5: {
                    woodenHeight = .03
                    bfitHeight = -1
                    break
                }
                case 6: {
                    woodenHeight = .21
                    bfitHeight = .105
                    break

                }
                case 7: {
                    woodenHeight = .2175
                    bfitHeight = .2325
                    break
                }
                case 8: {
                    woodenHeight = .225
                    bfitHeight = .2625
                    break
                }
                case 9: {
                    woodenHeight = .315
                    bfitHeight = .36
                    break
                }
                case 10: {
                    woodenHeight = .405
                    bfitHeight = .315
                    break
                }
                case 11: {
                    woodenHeight = .3225
                    bfitHeight = .315
                    break
                }
            }
        }
        if(amOrPm == "PM"){
            switch(time) {
                case 12: {
                    woodenHeight = .35
                    bfitHeight = .3
                    break
                }
                case 1: {
                    woodenHeight = .38
                    bfitHeight = .26
                    break
                }
                case 2: {
                    woodenHeight = .4
                    bfitHeight = .3
                    break
                }
                case 3: {
                    woodenHeight = .52
                    bfitHeight = .375
                    break
                }
                case 4: {
                    woodenHeight = .62
                    bfitHeight = .51
                    break
                }
                case 5: {
                    woodenHeight = .578
                    bfitHeight = .585
                    break
                }
                case 6: {
                    woodenHeight = .51
                    bfitHeight = .562
                    break

                }
                case 7: {
                    woodenHeight = .48
                    bfitHeight = .465
                    break
                }
                case 8: {
                    woodenHeight = .37
                    bfitHeight = .48
                    break
                }
                case 9: {
                    woodenHeight = .28
                    bfitHeight = .57
                    break
                }
                case 10: {
                    woodenHeight = .17
                    bfitHeight = .5625
                    break
                }
                case 11: {
                    woodenHeight = 0
                    bfitHeight = .435
                    break
                }
            }
        }
    }
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

//calculate z and x adjustments for viewMatrix
function calculateAzimuths() {

    if(isRotating){
        thetaAzimuth = thetaAzimuth + 1;
        radian = radians(thetaAzimuth);
        zAzimuth = cameraRadius * Math.cos(radian);
        xAzimuth = cameraRadius * Math.sin(radian);
    }

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
    cylinders();
    updateCylinder();
    
    
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
    
    //192
    //4 cubes, 6 squares to make cube edge
    for(var i = 0; i < 4; i++){
        quadedge( 0, 1, 2, 3, i); //bottom
        quadedge( 0, 1, 5, 4, i); //left
        quadedge( 0, 4, 7, 3, i); //front
        quadedge( 2, 3, 7, 6, i); //right
        quadedge( 1, 2, 6, 5, i); //back
        quadedge( 4, 5, 6, 7, i); //top
    }
    //144
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

function cylinders(){
    //336 already pushed
    //base 540
    for ( var i = 0; i < 180; i++){
        slice(i, -1);
    }
    
    //base 540
    for ( var i = 180; i < 360; i++){
        slice(i, -1);
    }
    
    //1416 pushed
    //edge wooden 1080 1416-2495
    for (var i = 0; i < 180; i++){
        cylinderEdge(i, -1);
    }
    //2496 pushed
    //edge bfit 1080 2496-3575
    for (var i = 180; i < 360; i++){
        cylinderEdge(i, -1);
    }
    
    //3576 pushed
    //top wooden 540 3576-4115
    for ( var i = 0; i < 180; i++){
        slice(i, 6);
    }
    //4116 pushed
    //top bfit 540 4116-4655
    for ( var i = 180; i < 360; i++){
        slice(i, 6);
    }
    //4656 pushed
    
}


function updateCylinder(){
    //update wooden edge
    var check = 1;
    for ( var i = 1416; i < 2496; i++){
        //update three vertex skipping in groups of three
        if(check < 3){
            check++;
            continue;
        } else if(check > 5 ){
            check = 1;
            continue;
        } else {
            check++;    
        }
        
        points[i] = mult(points[i],vec4v(1,0,1,1));
        points[i] = add(points[i],vec4v(0,woodenHeight,0,0));
        
    }
    
    //update wooden top
    for (var i = 3576; i < 4116; i++){
        points[i] = mult(points[i],vec4v(1,0,1,1));
        points[i] = add(points[i],vec4v(0,woodenHeight,0,0));
    }
    
    //update bfit edge
    check = 1;
    for ( var i = 2496; i < 3576; i++){
        //update three vertex skipping in groups of three
        if(check < 3){
            check++;
            continue;
        } else if(check > 5 ){
            check = 1;
            continue;
        } else {
            check++;    
        }
        
        points[i] = mult(points[i],vec4v(1,0,1,1));
        points[i] = add(points[i],vec4v(0,bfitHeight,0,0));
        
    }
    
    //update bfit top
    for (var i = 4116; i < 4656; i++){
        points[i] = mult(points[i],vec4v(1,0,1,1));
        points[i] = add(points[i],vec4v(0,bfitHeight,0,0));
    }
    
}


function slice(degree, height){
    var radian1 = radians(degree);
    var radian2 = radians(degree+1);
    var firstX = cylinderRadius * Math.sin(radian1);
    var secondX = cylinderRadius * Math.sin(radian2);
    var firstZ = cylinderRadius * Math.cos(radian1);
    var secondZ = cylinderRadius * Math.cos(radian2);
    
    points.push(vec4v(firstX,height,firstZ,1.0));
    points.push(vec4v(secondX,height,secondZ,1.0));
    points.push(vec4v(0,height,0,1.0));
    
}

function cylinderEdge(degree, height){
    var radian1 = radians(degree);
    var radian2 = radians(degree+1);
    var firstX = cylinderRadius * Math.sin(radian1);
    var secondX = cylinderRadius * Math.sin(radian2);
    var firstZ = cylinderRadius * Math.cos(radian1);
    var secondZ = cylinderRadius * Math.cos(radian2);
    
    points.push(vec4v(firstX,height,firstZ, 1.0));
    points.push(vec4v(secondX,height,secondZ,1.0));
    points.push(vec4v(firstX, 5, firstZ, 1.0));
    points.push(vec4v(firstX,5,firstZ,1.0));
    points.push(vec4v(secondX, 5, secondZ,1.0));
    points.push(vec4v(secondX, height, secondZ, 1.0));
}


function render()
{
    
    
    
    //clear
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //
    //set buffers
    //
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    //draw cylinder
    if(cylinder == 1){
        updateCylinder()
        
        mat4.identity(worldMatrix);
        //initialize static matrices
        csViewMatrix = new Float32Array(16);
        csProjMatrix = new Float32Array(16);
        mat4.lookAt(csViewMatrix, [0, 2, 5],[0, 0, 0],[ 0, 1, 0]);
        mat4.perspective(csProjMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);
        
        //load matrices
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, csViewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, csProjMatrix);
        
        //draw base disk
        gl.drawArrays( gl.TRIANGLES, NumVerticesEdges + (NumVerticesPerCube*4), NumVerticesPerCylinder);
        
        gl.uniform4fv(fColorUniformLocation, vertexColors[8]); //blue
        //draw height
        gl.drawArrays( gl.TRIANGLES, NumVerticesEdges + (NumVerticesPerCube*4) + NumVerticesPerCylinder, NumVerticesPerCylinderHalfEdge/2);
        
        gl.uniform4fv(fColorUniformLocation, vertexColors[7]); //yellow
        gl.drawArrays( gl.TRIANGLES, NumVerticesEdges + (NumVerticesPerCube*4) + NumVerticesPerCylinder + NumVerticesPerCylinderHalfEdge/2, NumVerticesPerCylinderHalfEdge/2);
        
        gl.uniform4fv(fColorUniformLocation, vertexColors[9]); //blue
        //draw top disk
        gl.drawArrays( gl.TRIANGLES, NumVerticesEdges + (NumVerticesPerCube*4) + NumVerticesPerCylinder + NumVerticesPerCylinderHalfEdge, NumVerticesPerCylinder/2);
        
        gl.uniform4fv(fColorUniformLocation, vertexColors[9]); //yellow
        
        gl.drawArrays( gl.TRIANGLES, NumVerticesEdges + (NumVerticesPerCube*4) + NumVerticesPerCylinder + NumVerticesPerCylinderHalfEdge + NumVerticesPerCylinder/2, NumVerticesPerCylinder/2);
    }
    
    if(isRotating)
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