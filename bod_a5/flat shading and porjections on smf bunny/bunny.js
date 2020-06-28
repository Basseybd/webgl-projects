let canvas, gl;
let vertexColors = [];
let vertices = [];
let points = [];
let colors = [];
let indices = [];
let facesCount = 0;

let iBuffer;
let bufferId;
let vPosition;

let vColor;
let cBuffer;


let modelViewMatrixLocation;
let projectionMatrixLocation;

let fovy = 90;
let aspect = 500/500;
let Near = 1e-4;
let far = 10;
let radius = 2;
let theta = 0;
let phi = -7.5;
let radiusDelta = .1;
let thetaDelta = .5;
let phiDelta = .2;
let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);
let left = -1;
let right = 1;
let bottom = -1;
let parallelTop = 1;

let eye = vec3(radius*Math.sin(theta),
    radius*Math.cos(phi),
    radius*Math.cos(theta));
let modelViewMatrix = lookAt(eye, at , up);
let projectionMatrix = ortho( left, right, bottom, parallelTop, Near, far );





window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    let lines = bunny.split("\n");
    for(let i =0; i <lines.length; i++){
        let currentLine=lines[i].split(" ");
        if(currentLine[0]==="v"){
            vertices.push(vec3(parseFloat(currentLine[1]),parseFloat(currentLine[2]),parseFloat(currentLine[3])));
        }
        else {
            facesCount = facesCount + 1;
            indices.push(parseInt(currentLine[1])-1, parseInt(currentLine[2])-1, parseInt(currentLine[3])-1);
        }
    }

    //colors getting meshed with other triangles, generate an array for the individuals and shade them
    for(let i=0; i<indices.length; i = i + 3){
        surfaceNormal(vertices[indices[i]],vertices[indices[i+1]],vertices[indices[i+2]])
        points.push(vertices[indices[i]]);
        points.push(vertices[indices[i+1]]);
        points.push(vertices[indices[i+2]]);
    }

    for(let i=0; i<facesCount;i++){
        colors.push(vertexColors[i]);
        colors.push(vertexColors[i]);
        colors.push(vertexColors[i]);
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
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
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //sending the colors
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrixLocation = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
    render();

};

function surfaceNormal(p1,p2,p3){

    let V = subtract(p2,p1);
    let W = subtract(p3,p1);

    let Nx = (V[1]*W[2])-(V[2]*W[1]);
    let Ny = (V[2]*W[0])-(V[0]*W[2]);
    let Nz = (V[0]*W[1])-(V[1]*W[0]);
    let normal = [Nx,Ny,Nz];
    normalize(normal);
    normal[0] = Math.abs(normal[0]);
    normal[1] = Math.abs(normal[1]);
    normal[2] = Math.abs(normal[2]);
    vertexColors.push(vec4(normal[0],normal[1],normal[2],1.0));
}

window.addEventListener("keypress", controls);
window.addEventListener("change", controls);

function controls(event){
    let option = document.getElementById("projection").value;
    let key = event.code;
    console.log(key);
    console.log(option);
    switch (key) {
        case "KeyQ":
            theta += thetaDelta;
            break;
        case "KeyA":
            theta -= thetaDelta;
            break;
        case "KeyW":
            phi += phiDelta;
            break;
        case "KeyS":
            phi -= phiDelta;
            break;
        case "KeyE":
            radius += radiusDelta;
            break;
        case "KeyD":
            radius -= radiusDelta;
            break;
        case "Digit0":
            setDefault();
            break;
    }

    switch(option){
        case "Parallel":
            eye = vec3(radius*Math.sin(theta),
                radius*Math.cos(phi),
                radius*Math.cos(theta));
            modelViewMatrix = lookAt(eye, at , up);
            projectionMatrix = ortho( left, right, bottom, parallelTop, Near, far );
            break;
        case "Perspective":
            eye = vec3(radius*Math.sin(theta),
                radius*Math.cos(phi),
                radius*Math.cos(theta));
            modelViewMatrix = lookAt(eye, at , up);
            projectionMatrix = perspective(fovy, aspect, Near, far);
            break;
    }
}

function setDefault() {
    radius = 2;
    theta = 0;
    phi = -7.5;;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv( modelViewMatrixLocation, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv( projectionMatrixLocation, false, flatten(projectionMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, indices.length );
    requestAnimFrame(render);
}
