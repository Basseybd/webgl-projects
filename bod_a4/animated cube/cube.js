let canvas, gl;
let numVertices = 36;
let vertexColors = [];
let vertices = [];
let indices;
let rotationMatrixLocation;
let rotationMatrix;
let translateMatrixLocation;
let translateMatrix;
let scaleMatrixLocation;
let scaleMatrix;
let vPosition;
let bufferId;
let vColor;
let cBuffer;
let iBuffer;

let thetaDefault = 0;
let angleXDefault = 315;
let angleYDefault = 315;
let angleZDefault = 360;
let rotateDefault  = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
let scaleDefault  = scalem(.7,.7,.7);
let translateDefault = translate( 0, 0, 0);
let thetaDelta = 1;
let scaleDelta = .1;
let translateDelta = .1;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = [
        vec3( -0.5, -0.5, 0.5 ),
        vec3( -0.5, 0.5, 0.5 ),
        vec3( 0.5, 0.5, 0.5 ),
        vec3( 0.5, -0.5, 0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5, 0.5, -0.5 ),
        vec3( 0.5, 0.5, -0.5 ),
        vec3( 0.5, -0.5, -0.5 )
    ];

    vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
        vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
    ];


    indices = [
        1,0,3,
        3,2,1,
        2,3,7,
        7,6,2,
        3,0,4,
        4,7,3,
        6,5,1,
        1,2,6,
        4,5,6,
        6,7,4,
        5,4,0,
        0,1,5
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //sending the colors
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    rotationMatrixLocation = gl.getUniformLocation(program, "rotationMatrix");
    translateMatrixLocation = gl.getUniformLocation(program, "translateMatrix");
    scaleMatrixLocation = gl.getUniformLocation(program, "scaleMatrix");
    console.log(rotateDefault)
    render();
};

window.addEventListener("keypress", controls);

function controls(event){
    let option = document.getElementById("transformation").value;
    let key = event.code;
    console.log(key);
    switch(option){
        case "SCALE":
            switch (key) {
                case "KeyQ":
                    scaleDefault = scalem(scaleDefault[0][0]+scaleDelta,scaleDefault[1][1],scaleDefault[2][2]);
                    break;
                case "KeyW":
                    scaleDefault = scalem(scaleDefault[0][0],scaleDefault[1][1]+scaleDelta,scaleDefault[2][2]);
                    break;
                case "KeyE":
                    scaleDefault = scalem(scaleDefault[0][0],scaleDefault[1][1],scaleDefault[2][2]+scaleDelta);
                    break;
                case "KeyA":
                    scaleDefault = scalem(scaleDefault[0][0]-scaleDelta,scaleDefault[1][1],scaleDefault[2][2]);
                    break;
                case "KeyS":
                    scaleDefault = scalem(scaleDefault[0][0],scaleDefault[1][1]-scaleDelta,scaleDefault[2][2]);
                    break;
                case "KeyD":
                    scaleDefault = scalem(scaleDefault[0][0],scaleDefault[1][1],scaleDefault[2][2]-scaleDelta);
                    break;
                case "KeyR":
                    scaleDelta+=.1;
                    break;
                case "KeyF":
                    scaleDelta-=.1;
                    break;
                case "Digit0":
                    setDefault();
                    break;
            }
            break;
        case "ROTATE":
            switch (key) {
                case "KeyX":
                    angleXDefault += thetaDelta;
                    console.log(angleXDefault);
                    rotateDefault = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
                    break;
                case "KeyC":
                    angleXDefault -= thetaDelta;
                    rotateDefault = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
                    break;
                case "KeyV":
                    angleYDefault += thetaDelta;
                    rotateDefault = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
                    break;
                case "KeyB":
                    angleYDefault -= thetaDelta;
                    rotateDefault = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
                    break;
                case "KeyN":
                    angleZDefault += thetaDelta;
                    rotateDefault = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
                    break;
                case "KeyM":
                    angleZDefault -= thetaDelta;
                    rotateDefault = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
                    break;
                case "KeyR":
                    thetaDelta+=1;
                    break;
                case "KeyF":
                    thetaDelta-=1;
                    break;
                case "Digit0":
                    setDefault();
                    break;
            }
            break;
        case "TRANSLATE":
            switch (key) {
                case "KeyI":
                    translateDefault = translate(translateDefault[0][3],translateDefault[1][3]+translateDelta,translateDefault[2][3]);
                    break;
                case "KeyK":
                    translateDefault = translate(translateDefault[0][3],translateDefault[1][3]-translateDelta,translateDefault[2][3]);
                    break;
                case "KeyJ":
                    translateDefault = translate(translateDefault[0][3]-translateDelta,translateDefault[1][3],translateDefault[2][3]);
                    break;
                case "KeyL":
                    translateDefault = translate(translateDefault[0][3]+translateDelta,translateDefault[1][3],translateDefault[2][3]);
                    break;
                case "KeyU":
                    translateDefault = translate(translateDefault[0][3],translateDefault[1][3],translateDefault[2][3]+translateDelta);
                    break;
                case "KeyO":
                    translateDefault = translate(translateDefault[0][3],translateDefault[1][3],translateDefault[2][3]-translateDelta);
                    break;
                case "KeyR":
                    translateDelta+=.1;
                    break;
                case "KeyF":
                    translateDelta-=.1;
                    break;
                case "Digit0":
                    setDefault();
                    break;
            }
            break;
    }
}

function setDefault() {
    scaleDefault  = scalem(.7,.7,.7);
    translateDefault = translate( 0, 0, 0);
    thetaDelta = 1;
    scaleDelta = .1;
    translateDelta = .1;
    thetaDefault = 0;
    angleXDefault = 315;
    angleYDefault = 315;
    angleZDefault = 360;
    rotateDefault  = mult(mult(rotateX(angleXDefault), rotateY(angleYDefault)),rotateZ(angleZDefault));
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(rotationMatrixLocation, false, flatten(rotateDefault));
    gl.uniformMatrix4fv(translateMatrixLocation, false, flatten(translateDefault));
    gl.uniformMatrix4fv(scaleMatrixLocation, false, flatten(scaleDefault));
    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );
    requestAnimFrame(render);
}
