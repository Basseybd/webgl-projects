var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // All Six Squares and the triangle
    var vertices = [
        vec2( -0.6, -0.8),
        vec2(  -0.6,  0.4),
        vec2(  0.6, 0.4),
        vec2( 0.6, -0.8),

        vec2( -0.5, -0.7),
        vec2(  -0.5,  0.3),
        vec2(  0.5, 0.3),
        vec2( 0.5, -0.7),

        vec2( -0.4, -0.6),
        vec2(  -0.4,  0.2),
        vec2(  0.4, 0.2),
        vec2( 0.4, -0.6),

        vec2( -0.3, -0.5),
        vec2(  -0.3,  0.1),
        vec2(  0.3, 0.1),
        vec2( 0.3, -0.5),

        vec2( -0.2, -0.4),
        vec2(  -0.2,  0.0),
        vec2(  0.2, 0.0),
        vec2( 0.2, -0.4),

        vec2( -0.1, -0.3),
        vec2(  -0.1,  -0.1),
        vec2(  0.1, -0.1),
        vec2( 0.1, -0.3),

        vec2(  0.0,  1),
        vec2(  -0.25, 0.55),
        vec2( 0.25, 0.55)
    ];

    var colors = [
        1.0,  1.0,  1.0,  1.0,  //  white
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,

        0.0,  0.0,  0.0,  1.0,  //  black
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0,

        1.0,  1.0,  1.0,  1.0,  //  white
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,

        0.0,  0.0,  0.0,  1.0,  //  black
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0,

        1.0,  1.0,  1.0,  1.0,  //  white
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,

        0.0,  0.0,  0.0,  1.0,  //  black
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0,

        1.0,  0.0,  0.0,  1.0, //  red
        0.0,  1.0,  0.0,  1.0, //  green
        0.0,  0.0,  1.0,  1.0, //  blue
    ];


    var radius = 0.2

    for (i =0; i<360; i++){
        var angle = i*Math.PI/180
        console.log(Math.PI)
        var x=radius*Math.cos(angle)+0.6
        var y=radius*Math.sin(angle)+0.75
        vertices.push(vec2(x,y))
        colors.push(i/360,  0.0,  0.0,  1.0)
    };

    for (i =0; i<360; i++){
        var angle = i*Math.PI/180
        var x=radius*Math.cos(angle)-0.6
        var y=radius*Math.sin(angle)*.6+0.75
        vertices.push(vec2(x,y))
        colors.push(1.0,  0.0,  0.0,  1.0)
    };


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //sending the colors
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 12, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 16, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 20, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 24, 3 );
    gl.drawArrays( gl.TRIANGLE_FAN, 27, 360 );
    gl.drawArrays( gl.TRIANGLE_FAN, 387, 360 );
}
