/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }
    
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}


function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }
    
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function main(){
    var canvas = document.querySelector("#c"); // get the html canvas (almost like get by id)

    var gl = canvas.getContext("webgl"); // create a WebGLRenderingContext
    if(!gl){ 
        return; 
    };

    // strings for GLSL shaders
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#frag-shader-2d").text;

    // create GLSL shaders, upload the GLSL source and compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go
    var positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
    // attributes get their data from buffers
    // so create a buffer here
    var positionBuffer = gl.createBuffer();

    // bind it to ARRAY_BUFFER (like ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    // three 2d points
    var positions = [
        0, 0,
        0.7, 0.2,
        0.5, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // here new Float32Array(positions) creates a new array of 32 floating point numbers and copies the number from positions
    // gl.bufferData copies the data to positionBuffer (on the GPU)
    // this is because we bound it to ARRAY_BUFFER bind above
    // gl.STATIC_DRAW is a hint to WEBGL so it can try to optimize sth (that we won't change this data much)

    ////// code up to this point is INITIALIZATION CODE
    ////// runs once when we load the page


    ////// here starts RENDERING CODE
    ////// this code is executed each time we want to render/draw

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // this tells the -1,1 space maps to 0 - gl.canvas.width and 0 - gl.canvas.height

    // clear the canvas
    gl.clearColor(0,0,0,0); // transparent canvas as alpha channel is 0
    gl.clear(gl.COLOR_BUFFER_BIT);

    // tell webgl to use the program (the pair of shaders)
    gl.useProgram(program);

    // turn attribute on
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // tell the attribute how to get the info from positionBuffer (ARRAY_BUFFER)
    var size = 2; // two components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beggining of the buffer

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    // this attribute is now bound to positionBuffer (ARRAY_BUFFER)
    // we can now bind sth else to ARRAY_BUFFER

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3; // this will execute vertex shader 3 times

    gl.drawArrays(primitiveType, offset, count);

    // bc count is 3
    // the first time aPosition.x and aPosition.y will be set as the first two values, 
    // then the next two 
    // and again the last two

    // bc primitiveType is gl.TRIANGLES, webgl will draw a triangle based on the 3 sets of values we gave in to gl_Position

}

main();





