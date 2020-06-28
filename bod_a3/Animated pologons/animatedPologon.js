let gl;
let squareTheta = 0;
let triangleTheta = 0;
let size =1;
let rotationMatrixLocation;
let rotationMatrix;
let translateMatrixLocation;
let translateMatrix;
let scaleMatrixLocation;
let scaleMatrix;
let decreasing = true;
let triangleDirection = true;
let squareDirection = true;
let vertices = [];
let colors = [];
let angle = Math.PI/4;
let nextAngle = Math.PI/2;
let hypotenuse = .6;
let triangleAngle = Math.PI/2;
let triangleRadius = .25;
let radius = 0.2;
let vColor;
let cBuffer;
let pentagonRadius = .10;
let pentagonAngle = Math.PI/2.5;
let vPosition;
let bufferId;

window.onload = function init()
{
    let canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //square
    for (let number_of_squares = 0; number_of_squares<6; number_of_squares++){
        for (let i =0; i<4; i++) {
            let x = hypotenuse * Math.sin(angle);
            let y = hypotenuse * Math.cos(angle);
            vertices.push(vec4(x, y,0.0,1.0));
            angle = angle + nextAngle;
            if (number_of_squares % 2 ===0){
                colors.push(1.0,  1.0,  1.0,  1.0,) ; //white
            }
            else{
                colors.push(0.0,  0.0,  0.0,  1.0,); //black
            }
        }
        hypotenuse = hypotenuse - .1;

    }

    //triangle
    for (let i =0; i<3; i++) {
        let x = triangleRadius * Math.sin(triangleAngle);
        let y = triangleRadius * Math.cos(triangleAngle);
        vertices.push(vec4(x, y,0.0,1.0));
        triangleAngle += Math.PI/1.5;
    }

    colors.push(1.0,  0.0,  0.0,  1.0,); //  red
    colors.push(0.0,  1.0,  0.0,  1.0);//  green
    colors.push(0.0,  0.0,  1.0,  1.0,); //  blue


    //circle
    for (let i =0; i<360; i++){
        let circleAngle = i*Math.PI/180;
        let x = radius*Math.cos(circleAngle);
        let y = radius*Math.sin(circleAngle);
        vertices.push(vec4(x, y,0.0,1.0));
        colors.push(i/360,  0.0,  0.0,  1.0)
    }

    //oval
    for (let i =0; i<360; i++){
        let circleAngle = i*Math.PI/180;
        let x=radius*Math.cos(circleAngle);
        let y=radius*Math.sin(circleAngle);
        vertices.push(vec4(x, y,0.0,1.0));
        colors.push(1.0,  0.0,  0.0,  1.0);
    }

    //Empty pentagon
    for (let i =0; i<5; i++) {
        vertices.push(vec4(0.0, 0.0,0.0,1.0));
        colors.push(0.0,  0.0,  0.0,  1.0);
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //sending the colors
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    rotationMatrixLocation = gl.getUniformLocation(program, "rotationMatrix");
    translateMatrixLocation = gl.getUniformLocation(program, "translateMatrix");
    scaleMatrixLocation = gl.getUniformLocation(program, "scaleMatrix");
    scaleMatrix = scalem(1,.5,1);
    render();
};

window.addEventListener("keypress", controls);

function controls(event){
    let key = event.code;
    switch (key) {
        case "KeyR":
            for (let i =0; i<1440; i=i+4) {
                colors[i+(387*4)] = 1.0;
                colors[i+(387*4)+1] = 0.0;
                colors[i+(387*4)+2] = 0.0;
            }
            break;
        case "KeyG":
            for (let i =0; i<1440; i=i+4) {
                colors[i+(387*4)] = 0.0;
                colors[i+(387*4)+1] = 1.0;
                colors[i+(387*4)+2] = 0.0;
            }
            break;
        case "KeyB":
            for (let i =0; i<1440; i=i+4) {
                colors[i+(387*4)] = 0.0;
                colors[i+(387*4)+1] = 0.0;
                colors[i+(387*4)+2] = 1.0;
            }
            break;
        case "KeyY":
            for (let i =0; i<1440; i=i+4) {
                colors[i+(387*4)] = 1.0;
                colors[i+(387*4)+1] = 1.0;
                colors[i+(387*4)+2] = 0.0;
            }
            break;
        case "KeyP":
            for (let i =0; i<1440; i=i+4) {
                colors[i+(387*4)] = 1.0;
                colors[i+(387*4)+1] = 0.0;
                colors[i+(387*4)+2] = 1.0;
            }
            break;
        case "KeyW":
            for (let i =0; i<1440; i=i+4) {
                colors[i+(387*4)] = 1.0;
                colors[i+(387*4)+1] = 1.0;
                colors[i+(387*4)+2] = 1.0;
            }
            break;
    }
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function pentagon(x,y){
    let X = (-1 + 2*x/500);
    let Y = (-1 + 2*(500-y)/500);

    for (let i =0; i<5; i++) {
        let a = pentagonRadius * Math.sin(pentagonAngle);
        let b = pentagonRadius * Math.cos(pentagonAngle);
        vertices[i + 747] = vec4(a + X, b + Y,0.0,1.0);
        pentagonAngle += Math.PI / 2.5;
    }

    for (let i =0; i<20; i=i+4) {
        colors[i+(747*4)] = getRandomInt(2);
        colors[i+(747*4)+1] = getRandomInt(2);
        colors[i+(747*4)+2] = getRandomInt(2);
        colors[i+(747*4)+4] = 1.0;
    }
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    if (squareDirection)
        {
            squareTheta -= 5;
    }
    else
        {
            squareTheta += 5;
    }

    if (triangleDirection)
    {
        triangleTheta -= 5;
    }
    else
    {
        triangleTheta += 5;
    }
    if (decreasing) {
        size -=.1;
    }
    else{
        size += .1;
    }

    if (size <= .5){
        decreasing =  false;
    }
    if (size >= 1){
        decreasing = true;
    }

    rotationMatrix = rotateZ(squareTheta);
    translateMatrix = translate(0,-.3,0);
    scaleMatrix = scalem(1,1,1);
    gl.uniformMatrix4fv(rotationMatrixLocation, false, flatten(rotationMatrix));
    gl.uniformMatrix4fv(translateMatrixLocation, false, flatten(translateMatrix));
    gl.uniformMatrix4fv(scaleMatrixLocation, false, flatten(scaleMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 12, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 16, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 20, 4 );

    rotationMatrix = rotateZ(triangleTheta);
    translateMatrix = translate(0,.75,0);
    scaleMatrix = scalem(1,1,1);
    gl.uniformMatrix4fv(rotationMatrixLocation, false, flatten(rotationMatrix));
    gl.uniformMatrix4fv(translateMatrixLocation, false, flatten(translateMatrix));
    gl.uniformMatrix4fv(scaleMatrixLocation, false, flatten(scaleMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 24, 3 );

    rotationMatrix = rotateZ(0);
    translateMatrix = translate(.6,.75,0);
    scaleMatrix = scalem(1,size,1);
    gl.uniformMatrix4fv(rotationMatrixLocation, false, flatten(rotationMatrix));
    gl.uniformMatrix4fv(translateMatrixLocation, false, flatten(translateMatrix));
    gl.uniformMatrix4fv(scaleMatrixLocation, false, flatten(scaleMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 27, 360 );

    rotationMatrix = rotateZ(0);
    translateMatrix = translate(-.6,.75,0);
    scaleMatrix = scalem(1,.6,1);
    gl.uniformMatrix4fv(rotationMatrixLocation, false, flatten(rotationMatrix));
    gl.uniformMatrix4fv(translateMatrixLocation, false, flatten(translateMatrix));
    gl.uniformMatrix4fv(scaleMatrixLocation, false, flatten(scaleMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 387, 360 );

    rotationMatrix = rotateZ(0);
    translateMatrix = translate(0,0,0);
    scaleMatrix = scalem(1,1,1);
    gl.uniformMatrix4fv(rotationMatrixLocation, false, flatten(rotationMatrix));
    gl.uniformMatrix4fv(translateMatrixLocation, false, flatten(translateMatrix));
    gl.uniformMatrix4fv(scaleMatrixLocation, false, flatten(scaleMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 747, 5 );

    setTimeout( function() {requestAnimFrame(render);}, 100);
}
