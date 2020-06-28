let canvas, gl;
let vertexColors = [];
let points = [];
let colors = [];
let uBezierPoints = [];
let vBezierPoints = [];
let bezierPoints = [];
let bezierFacesCount = 0;
let uDirection = 12;
let vDirection = 12;
let controlPoints = [];
let finalPoint = [];

let bufferId;
let vPosition;
let vNormal;
let cBuffer;

let texturePoints = [];
let texture;
let textureBufferId;
let starsImage;
let vTexCoord;
let vTextureLocation;

let modelViewMatrixLocation;
let projectionMatrixLocation;

let fovy = 90;
let aspect = 500/500;
let Near = 1e-4;
let far = 20;
let radius = 1;
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

    lines = bunny.split("\n");
    pointsAndColor();
    configureTexture('stars.jpg');
    configureTexturePoints(points);


    //configure webgl

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

    textureBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, textureBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texturePoints), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );

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
    vTextureLocation = gl.getUniformLocation(program, "texture");

    render();
};



function configureTexture( image ) {

    texture = gl.createTexture();
    gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([255, 0, 0, 255]));


    starsImage = new Image();
    starsImage.src = image;
    starsImage.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, starsImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };

    gl.activeTexture(gl.TEXTURE0);
}

function configureTexturePoints( Points ) {
    let xMin = 0;
    let yMin = 0;
    let zMin = 0;
    let xMax = 0;
    let yMax = 0;
    let zMax = 0;

    for(let i=0;i<Points.length;i++)
    {
        if(Points[i][0] < xMin){
            xMin = Points[i][0];
        }
        if(Points[i][1] < yMin){
            yMin = Points[i][1];
        }
        if(Points[i][2] < zMin){
            zMin= Points[i][2];
        }
        if(Points[i][1] > xMax){
            xMax= Points[i][0];
        }
        if(Points[i][1] > yMax ){
            yMax = Points[i][1];
        }
        if(Points[i][2] > zMax){
            xMax = Points[i][2];
        }
    }

    let x = (Math.abs(xMin)+Math.abs(xMax));
    let y = (Math.abs(yMin)+Math.abs(yMax));
    let z = (Math.abs(zMin)+Math.abs(zMax));


    for(let i = 0; i<Points.length;i++){

        let u=Points[i][0]/x;
        let v=Points[i][1]/y;
        let w=Points[i][2]/z;
        texturePoints.push(vec3(u,v,w))
    }
}

function surfaceNormal(p1,p2,p3){

    let V = subtract(p2,p1);
    let W = subtract(p3,p1);

    let Nx = (V[1]*W[2])-(V[2]*W[1]);
    let Ny = (V[2]*W[0])-(V[0]*W[2]);
    let Nz = (V[0]*W[1])-(V[1]*W[0]);
    let normal = [Nx,Ny,Nz];
    normal = normalize(normal);
    normal = vec4(normal);
    normal[3]  = 0.0;
    normal[0] = Math.abs(normal[0]);
    normal[1] = Math.abs(normal[1]);
    normal[2] = Math.abs(normal[2]);

    vertexFaceNormal.push(vec4(normal[0],normal[1],normal[2],normal[3]))
}

function pointsAndColor(){
    facesCount = 0;
    vertices = [];
    points = [];
    colors = [];
    indices = [];
    vertexFaceNormal=[];
    vertexNormalColor=[];
    vertexNormalColors = [];

    for(let i =0; i <lines.length; i++){
        let currentLine=lines[i].split(" ");
        if(currentLine[0]==="v"){
            vertices.push(vec4(parseFloat(currentLine[1]),parseFloat(currentLine[2]),parseFloat(currentLine[3]),1.0));
            vertexNormalColor.push(vec4([0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]));
        }
        else {
            facesCount = facesCount + 1;
            indices.push(parseInt(currentLine[1])-1, parseInt(currentLine[2])-1, parseInt(currentLine[3])-1);
        }
    }

    //colors getting meshed with other triangles, generate an array for the individuals and shade them
    for(let i=0; i<indices.length; i = i + 4){
        surfaceNormal(vertices[indices[i]],vertices[indices[i+1]],vertices[indices[i+2]]);
        points.push(vertices[indices[i]]);
        points.push(vertices[indices[i+1]]);
        points.push(vertices[indices[i+2]]);
        points.push(vertices[indices[i+3]]);

    }

    //get the normals for everything and assign the averaged normal to all of the vertices.
    for(let i=0; i<vertices.length;i++){

        let pointIndices = [];
        for(let j=0;j<indices.length;j++){
            if (indices[j]===i){
                pointIndices.push(j)
            }
        }
        vertexFaceNormal = [];
        vertexNormalColors = [];
        for(let k=0;k<pointIndices.length;k++){
            let faceIndex=Math.floor(pointIndices[k]/3);
            if((faceIndex % 3)===0){
                surfaceNormal(vertices[indices[faceIndex]],vertices[indices[faceIndex+1]],vertices[indices[faceIndex+2]]);
                vertexNormalColors.push(vertexFaceNormal[k]);
            }
            else if ((faceIndex % 3)===1){
                surfaceNormal(vertices[indices[faceIndex-1]],vertices[indices[faceIndex]],vertices[indices[faceIndex+1]]);
                vertexNormalColors.push(vertexFaceNormal[k]);
            }
            else if ((faceIndex% 3)===2){
                surfaceNormal(vertices[indices[faceIndex-2]],vertices[indices[faceIndex-1]],vertices[indices[faceIndex]]);
                vertexNormalColors.push(vertexFaceNormal[k]);
            }
        }
        let count = 0;
        for(let m =0;m<vertexNormalColors.length;m++){
            count +=1;
            vertexNormalColor[i][0] += vertexNormalColors[m][0];
            vertexNormalColor[i][1] += vertexNormalColors[m][1];
            vertexNormalColor[i][2] += vertexNormalColors[m][2];
        }

        vertexNormalColor[i] = [(vertexNormalColor[i][0]) / count, (vertexNormalColor[i][1]) / count, (vertexNormalColor[i][2])/ count,0];
    }

    for(let i=0; i<indices.length;i++){
        colors.push(vertexNormalColor[indices[i]]);
    }
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
    radius = 1;
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
    gl.uniform1i(vTextureLocation, 0);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);



    requestAnimFrame(render);
}

