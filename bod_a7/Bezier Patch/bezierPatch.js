let canvas, gl;
let vertexColors = [];
let points = [];
let colors = [];
let uBezierPoints = [];
let vBezierPoints = [];
let bezierPoints = [];
let bezierFacesCount = 0;
let uDirection = 10;
let vDirection = 10;
let controlPoints = [];
let finalPoint = [];

let bufferId;
let vPosition;
let vNormal;
let cBuffer;

let modelViewMatrixLocation;
let projectionMatrixLocation;

let fovy = 90;
let aspect = 500/500;
let Near = 1e-4;
let far = 20;
let radius = 2;
let theta = 0;
let phi = -7.9;
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

let materialAmbient = vec4(0.6, 0.2, 0.2, 1.0);
let materialDiffuse = vec4(0.9, 0.1, 0.1, 1.0);
let materialSpecular = vec4(0.8, 0.8, 0.8, 1.0);
let materialShininess = 80.0;
let lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
let lightPosition2 = vec4(-1.0, 1.0, -1.0, 1.0 );
let lightAmbient= vec4(0.2, 0.2, 0.2, 1.0);
let lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
let lightSpecular =vec4(1.0, 1.0, 1.0, 1.0);
let ambientProduct = mult(lightAmbient, materialAmbient);
let diffuseProduct = mult(lightDiffuse, materialDiffuse);
let specularProduct = mult(lightSpecular, materialSpecular);
let ambientProductLocation;
let diffuseProductLocation;
let specularProductLocation;
let lightPositionLocation;
let lightPosition2Location;
let materialShininessLocation;
let normalModelViewMatrix = [];
let normalModelViewMatrixLocation;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    controlPoints.push(vec3(0.0,0.0,0.0));
    controlPoints.push(vec3(.20,.00,.15));
    controlPoints.push(vec3(.40,.00,.29));
    controlPoints.push(vec3(.60,.00,.00));

    controlPoints.push(vec3(.00,.20,.11));
    controlPoints.push(vec3(.20,.20,.39));
    controlPoints.push(vec3(.40,.20,.31));
    controlPoints.push(vec3(.60,.20,.07));

    controlPoints.push(vec3(.00,.40,-.05));
    controlPoints.push(vec3(.20,.40,.26));
    controlPoints.push(vec3(.40,.40,.24));
    controlPoints.push(vec3(.60,.40,.04));

    controlPoints.push(vec3(.00,.60,.03));
    controlPoints.push(vec3(.20,.60,-.11));
    controlPoints.push(vec3(.40,.60,.13));
    controlPoints.push(vec3(.60,.60,-.02));

    drawBezierPatch(uDirection,vDirection);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //sending the colors
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    modelViewMatrixLocation = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
    ambientProductLocation = gl.getUniformLocation(program, "ambientProduct");
    diffuseProductLocation = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLocation = gl.getUniformLocation(program, "specularProduct");
    lightPositionLocation = gl.getUniformLocation(program, "lightPosition");
    lightPosition2Location = gl.getUniformLocation(program, "lightPosition2");
    materialShininessLocation = gl.getUniformLocation(program, "shininess");
    normalModelViewMatrixLocation = gl.getUniformLocation( program, "normalModelViewMatrix" );

    render();

};

function pointsAndAxis() {
    //adding the points and the axis
    points.push(vec4(0.0,0.0,0.0,1.0));
    points.push(vec4(.20,.00,.15,1.0));
    points.push(vec4(.40,.00,.29,1.0));
    points.push(vec4(.60,.00,.00,1.0));
    points.push(vec4(.00,.20,.11,1.0));
    points.push(vec4(.20,.20,.39,1.0));
    points.push(vec4(.40,.20,.31,1.0));
    points.push(vec4(.60,.20,.07,1.0));
    points.push(vec4(.00,.40,-.05,1.0));
    points.push(vec4(.20,.40,.26,1.0));
    points.push(vec4(.40,.40,.24,1.0));
    points.push(vec4(.60,.40,.04,1.0));
    points.push(vec4(.00,.60,.03,1.0));
    points.push(vec4(.20,.60,-.11,1.0));
    points.push(vec4(.40,.60,.13,1.0));
    points.push(vec4(.60,.60,-.02,1.0));
    points.push(vec4(0,0,0,1.0));
    points.push(vec4(1,0,0,1.0));
    points.push(vec4(0,0,0,1.0));
    points.push(vec4(0,1,0,1.0));
    points.push(vec4(0,0,0,1.0));
    points.push(vec4(0,0,1,1.0));

    //adding the points and the axis colors
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));

    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));

    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));

    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));
    colors.push(vec4(0.0,  0.0,  0.0, 1.0));

    colors.push(vec4(1.0,  0.0,  0.0,  1.0)); //  red
    colors.push(vec4(1.0,  0.0,  0.0,  1.0)); //  red
    colors.push(vec4(0.0,  1.0,  0.0,  1.0));//  green
    colors.push(vec4(0.0,  1.0,  0.0,  1.0));//  green
    colors.push(vec4(0.0,  0.0,  1.0,  1.0)); //  blue
    colors.push(vec4(0.0,  0.0,  1.0,  1.0)); //  blue

}
function drawBezierPatch(u,v) {
    points = [];
    colors = [];
    bezierPoints = [];
    vBezierPoints = [];
    uBezierPoints = [];
    vertexColors = [];


    pointsAndAxis()
    let z = u - v;

    if (u === v) {
        bezierFacesCount = 2 * (u * v - 2 * u + 1);
    } else if (u > v) {
        bezierFacesCount = 2 * (v * v - 2 * v + 1) + (z * (v - 1) * 2);
    } else {
        bezierFacesCount = 2 * (u * u - 2 * u + 1) + (z * -(u - 1) * 2);
    }

    for(let x = 0; x< controlPoints.length; x=x+4){
        casteljauAlgorithmFirst(controlPoints[x], controlPoints[x+1], controlPoints[x+2], controlPoints[x+3], u)
    }

    for(let x = 0; x<v; x++){
        casteljauAlgorithmSecond(uBezierPoints[x], uBezierPoints[x+u], uBezierPoints[x+u+u], uBezierPoints[x+u+u+u], v)
    }

    for(let y=0; y < v-1;y++){
        for(let x=0; x < u-1;x++) {
            bezierPoints.push(vBezierPoints[x+(y*u)],
                                    vBezierPoints[(x+1)+(y*u)],
                                    vBezierPoints[x+((y+1)*u)]);

            bezierPoints.push(vBezierPoints[(x+1)+(y*u)],
                                    vBezierPoints[(x+1)+((y+1)*(u))],
                                    vBezierPoints[x+((y+1)*(u))]);
        }
    }

    for(let x=0;x<bezierPoints.length;x++){
        points.push(vec4(bezierPoints[x],1.0));
    }

    for(let x=0; x<bezierPoints.length; x=x+3) {
        surfaceNormal(bezierPoints[x], bezierPoints[x+1], bezierPoints[x+2]);
    }

    for(let i=0; i<bezierFacesCount;i++){
        colors.push(vertexColors[i]);
        colors.push(vertexColors[i]);
        colors.push(vertexColors[i]);
    }

}

function casteljauAlgorithmFirst(p0,p1,p2,p3,num) {

    for (let x = 0; x < num; x++) {
        let t=x/(num-1);
        finalPoint[0] = Math.pow((1 - t), 3) * p0[0] + 3 * Math.pow((1 - t), 2) * t * p1[0] + 3 * (1 - t) * Math.pow(t, 2) * p2[0] + Math.pow(t, 3) * p3[0];
        finalPoint[1] = Math.pow((1 - t), 3) * p0[1] + 3 * Math.pow((1 - t), 2) * t * p1[1] + 3 * (1 - t) * Math.pow(t, 2) * p2[1] + Math.pow(t, 3) * p3[1];
        finalPoint[2] = Math.pow((1 - t), 3) * p0[2] + 3 * Math.pow((1 - t), 2) * t * p1[2] + 3 * (1 - t) * Math.pow(t, 2) * p2[2] + Math.pow(t, 3) * p3[2];
        uBezierPoints.push(vec3(finalPoint));
    }
}

function casteljauAlgorithmSecond(p0,p1,p2,p3,num) {

    for (let x = 0; x < num; x++) {
        let t=x/(num-1);
        finalPoint[0] = Math.pow((1 - t), 3) * p0[0] + 3 * Math.pow((1 - t), 2) * t * p1[0] + 3 * (1 - t) * Math.pow(t, 2) * p2[0] + Math.pow(t, 3) * p3[0];
        finalPoint[1] = Math.pow((1 - t), 3) * p0[1] + 3 * Math.pow((1 - t), 2) * t * p1[1] + 3 * (1 - t) * Math.pow(t, 2) * p2[1] + Math.pow(t, 3) * p3[1];
        finalPoint[2] = Math.pow((1 - t), 3) * p0[2] + 3 * Math.pow((1 - t), 2) * t * p1[2] + 3 * (1 - t) * Math.pow(t, 2) * p2[2] + Math.pow(t, 3) * p3[2];
        vBezierPoints.push(vec3(finalPoint));
    }

}

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
        case "KeyR":
            uDirection += 1;
            vDirection += 1;
            drawBezierPatch(uDirection,vDirection);
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
            gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
            gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );

            //sending the colors
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
            gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vNormal);
            break;
        case "KeyF":
            uDirection -= 1;
            vDirection -= 1;
            drawBezierPatch(uDirection,vDirection);
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
            gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
            gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );

            //sending the colors
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
            gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vNormal);
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
    phi = -7.9;
    uDirection = 10;
    vDirection = 10;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    normalModelViewMatrix =  [vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])];

    gl.uniformMatrix3fv(normalModelViewMatrixLocation, false, flatten(normalModelViewMatrix) );
    gl.uniformMatrix4fv( modelViewMatrixLocation, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv( projectionMatrixLocation, false, flatten(projectionMatrix));
    gl.uniform4fv(ambientProductLocation, flatten(ambientProduct));
    gl.uniform4fv(diffuseProductLocation, flatten(diffuseProduct));
    gl.uniform4fv(specularProductLocation, flatten(specularProduct));
    gl.uniform4fv(lightPositionLocation, flatten(lightPosition));
    gl.uniform4fv(lightPosition2Location, flatten(lightPosition2));
    gl.uniform1f(materialShininessLocation, materialShininess);
    gl.drawArrays(gl.POINTS,0,16);
    gl.drawArrays(gl.LINES, 16, 6);
    gl.drawArrays(gl.TRIANGLES, 22, bezierPoints.length);

    requestAnimFrame(render);
}
